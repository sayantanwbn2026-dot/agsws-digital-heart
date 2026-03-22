import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import {
  sendDonationReceipt,
  sendGiftHonourCard,
  sendRegistrationConfirm,
  sendAdminNotification,
} from '../../src/lib/email/sender'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawBody = JSON.stringify(req.body)
  const sig = req.headers['x-razorpay-signature'] as string

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')

  if (expected !== sig) {
    return res.status(401).send('Unauthorized')
  }

  const event = req.body
  if (event.event !== 'payment.captured') {
    return res.status(200).send('OK')
  }

  const payment = event.payload.payment.entity
  const notes   = payment.notes as Record<string, string>
  const gateway = notes?.gateway

  try {
    if (gateway === 'medical')       await handleMedical(payment, notes)
    else if (gateway === 'education') await handleEducation(payment, notes)
    else if (gateway === 'registration') await handleRegistration(payment, notes)
  } catch (err) {
    console.error('[webhook] error:', err)
  }

  return res.status(200).send('OK')
}

async function handleMedical(payment: any, notes: Record<string, string>) {
  const amount = payment.amount / 100
  const now = new Date().toISOString().split('T')[0]
  const journeyStages = [
    { stage:'received', label:'Donation Received', completed:true, date:now, note:'Payment captured' },
    { stage:'allocated', label:'Funds Allocated', completed:false, date:null, note:'' },
    { stage:'deployed', label:'Programme Deployed', completed:false, date:null, note:'' },
    { stage:'impact', label:'Impact Confirmed', completed:false, date:null, note:'' },
  ]
  await supabaseAdmin.from('medical_donations').upsert({
    razorpay_order_id:    payment.order_id,
    razorpay_payment_id:  payment.id,
    amount,
    frequency:        notes.frequency    ?? 'one-time',
    donor_name:       notes.donor_name,
    donor_email:      notes.donor_email,
    donor_phone:      notes.donor_phone  || null,
    pan_number:       notes.pan_number   || null,
    is_gift:          notes.is_gift === 'true',
    gift_recipient_name:  notes.gift_recipient_name  || null,
    gift_recipient_email: notes.gift_recipient_email || null,
    gift_message:         notes.gift_message         || null,
    show_on_wall:     notes.show_on_wall !== 'false',
    referrer_code:    notes.referrer_code || null,
    status:           'captured',
    journey_stages:   journeyStages,
  }, { onConflict: 'razorpay_payment_id' })

  if (notes.referrer_code) {
    await supabaseAdmin.from('referrals').insert({
      referrer_code: notes.referrer_code,
      referred_payment_id: payment.id,
      referred_gateway: 'medical',
      referred_amount: amount,
    })
  }

  await sendDonationReceipt({
    gateway: 'medical',
    donorName:  notes.donor_name,
    donorEmail: notes.donor_email,
    amount,
    paymentId:  payment.id,
    panNumber:  notes.pan_number,
  })

  if (notes.is_gift === 'true' && notes.gift_recipient_email) {
    await sendGiftHonourCard({
      recipientName:  notes.gift_recipient_name,
      recipientEmail: notes.gift_recipient_email,
      donorName:      notes.donor_name,
      amount,
      gateway:        'Medical Aid',
      message:        notes.gift_message,
    })
  }

  await supabaseAdmin.rpc('increment_total_donors')
}

async function handleEducation(payment: any, notes: Record<string, string>) {
  const amount = payment.amount / 100
  const now = new Date().toISOString().split('T')[0]
  const journeyStages = [
    { stage:'received', completed:true, date:now, note:'Payment captured' },
    { stage:'allocated', completed:false, date:null, note:'' },
    { stage:'deployed', completed:false, date:null, note:'' },
    { stage:'impact',   completed:false, date:null, note:'' },
  ]
  await supabaseAdmin.from('education_donations').upsert({
    razorpay_order_id:    payment.order_id,
    razorpay_payment_id:  payment.id,
    amount,
    tier:             notes.tier       ?? 'custom',
    frequency:        notes.frequency  ?? 'one-time',
    donor_name:       notes.donor_name,
    donor_email:      notes.donor_email,
    donor_phone:      notes.donor_phone        || null,
    pan_number:       notes.pan_number         || null,
    dedication_name:  notes.dedication_name    || null,
    is_gift:          notes.is_gift === 'true',
    gift_recipient_name:  notes.gift_recipient_name  || null,
    gift_recipient_email: notes.gift_recipient_email || null,
    gift_message:         notes.gift_message         || null,
    show_on_wall:     notes.show_on_wall !== 'false',
    referrer_code:    notes.referrer_code || null,
    status:           'captured',
    journey_stages:   journeyStages,
  }, { onConflict: 'razorpay_payment_id' })

  await sendDonationReceipt({
    gateway: 'education',
    donorName:  notes.donor_name,
    donorEmail: notes.donor_email,
    amount,
    paymentId:  payment.id,
    panNumber:  notes.pan_number,
  })

  await supabaseAdmin.rpc('increment_total_donors')
}

async function handleRegistration(payment: any, notes: Record<string, string>) {
  const { data: reg } = await supabaseAdmin
    .from('parent_registrations')
    .select('id, registration_id, registrant_email, registrant_name, parent_name')
    .eq('razorpay_order_id', payment.order_id)
    .single()

  if (!reg) return

  await supabaseAdmin.from('parent_registrations').update({
    razorpay_payment_id: payment.id,
    payment_status: 'captured',
    case_status:    'active',
  }).eq('id', reg.id)

  await sendRegistrationConfirm({
    registrantName:  reg.registrant_name,
    registrantEmail: reg.registrant_email,
    parentName:      reg.parent_name,
    registrationId:  reg.registration_id,
    paymentId:       payment.id,
  })

  await sendAdminNotification({
    type: 'Parent Registration',
    details: 'New: ' + reg.registration_id + ' — ' + reg.parent_name,
  })
}
