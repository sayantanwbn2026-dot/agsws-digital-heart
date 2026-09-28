// Creates a Stripe Checkout session for a donation (one-time or monthly) or a
// GoldenAge registration. Monthly donations use a Stripe subscription; later
// monthly charges are recorded by payments-webhook on `invoice.paid`.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { type StripeEnv, createStripeClient } from '../_shared/stripe.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface DonationBody {
  cause: 'medical' | 'education' | 'goldenage'
  amount: number
  donor_name: string
  donor_email: string
  donor_phone?: string
  is_gift?: boolean
  gift_recipient_name?: string
  gift_recipient_email?: string
  gift_message?: string
  show_on_wall?: boolean
  registrant_city?: string
  relation?: string
  parent_name?: string
  parent_age?: number
  parent_address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_condition?: string
  blood_group?: string
  alternative_phone?: string
  plan_label?: string
  frequency?: 'once' | 'monthly'
  success_url: string
  cancel_url: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const body = await req.json() as DonationBody
    if (!body.cause || !body.amount || !body.donor_email || !body.donor_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (body.amount < 1 || body.amount > 1000000) {
      return new Response(JSON.stringify({ error: 'Amount out of range' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Stripe environment is determined server-side; clients cannot force sandbox/live.
    const env: StripeEnv = Deno.env.get('STRIPE_ENV') === 'live' ? 'live' : 'sandbox'
    const stripe = createStripeClient(env)

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const amountCents = Math.round(body.amount * 100)
    // GoldenAge is a one-off registration fee; only donations can repeat.
    const isMonthly = body.frequency === 'monthly' && body.cause !== 'goldenage'

    // Pre-create row
    let recordId = ''
    if (body.cause === 'goldenage') {
      const { data, error } = await supabase.from('goldenage_registrations').insert({
        registrant_name: body.donor_name,
        registrant_email: body.donor_email,
        registrant_phone: body.donor_phone || '',
        registrant_city: body.registrant_city,
        relation: body.relation,
        parent_name: body.parent_name || body.donor_name,
        parent_age: body.parent_age,
        parent_address: body.parent_address,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        medical_condition: body.medical_condition,
        blood_group: body.blood_group,
        alternative_phone: body.alternative_phone,
        plan_label: body.plan_label,
        amount_cents: amountCents,
      }).select('id, registration_ref').single()
      if (error) throw error
      recordId = data.id
    } else {
      const { data, error } = await supabase.from('donations').insert({
        cause: body.cause,
        amount_cents: amountCents,
        donor_name: body.donor_name,
        donor_email: body.donor_email,
        donor_phone: body.donor_phone,
        is_gift: body.is_gift || false,
        gift_recipient_name: body.gift_recipient_name,
        gift_recipient_email: body.gift_recipient_email,
        gift_message: body.gift_message,
        show_on_wall: body.show_on_wall ?? true,
        frequency: isMonthly ? 'monthly' : 'once',
      }).select('id').single()
      if (error) throw error
      recordId = data.id
    }

    const productName =
      body.cause === 'medical' ? 'AGSWS Medical Aid Donation' :
      body.cause === 'education' ? 'AGSWS Education Support Donation' :
      'AGSWS GoldenAge Care Registration'

    const recordMeta = { record_id: recordId, cause: body.cause }
    const session = await stripe.checkout.sessions.create({
      // A subscription charges now and then on the same date each month.
      mode: isMonthly ? 'subscription' : 'payment',
      success_url: `${body.success_url}${body.success_url.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancel_url,
      customer_email: body.donor_email,
      line_items: [{
        price_data: {
          currency: 'inr',
          unit_amount: amountCents,
          product_data: { name: isMonthly ? `${productName} (Monthly)` : productName },
          ...(isMonthly ? { recurring: { interval: 'month' as const } } : {}),
        },
        quantity: 1,
      }],
      metadata: { ...recordMeta, donor_name: body.donor_name, frequency: isMonthly ? 'monthly' : 'once' },
      // payment_intent_data is only valid in payment mode; subscriptions carry
      // the same metadata so renewal invoices can be traced to this donation.
      ...(isMonthly
        ? { subscription_data: { metadata: recordMeta } }
        : { payment_intent_data: { metadata: recordMeta } }),
    })

    const targetTable = body.cause === 'goldenage' ? 'goldenage_registrations' : 'donations'
    await supabase.from(targetTable).update({ stripe_session_id: session.id }).eq('id', recordId)

    return new Response(JSON.stringify({ session_id: session.id, url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('[create-stripe-donation]', err?.message || err)
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
