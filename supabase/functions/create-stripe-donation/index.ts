// Creates a Stripe Checkout session for donations or GoldenAge registration
// Uses the shared createStripeClient that routes through the Lovable gateway.
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
  success_url: string
  cancel_url: string
  environment?: StripeEnv
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

    const env: StripeEnv = body.environment || 'sandbox'
    const stripe = createStripeClient(env)

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const amountCents = Math.round(body.amount * 100)

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
      }).select('id').single()
      if (error) throw error
      recordId = data.id
    }

    const productName =
      body.cause === 'medical' ? 'AGSWS Medical Aid Donation' :
      body.cause === 'education' ? 'AGSWS Education Support Donation' :
      'AGSWS GoldenAge Care Registration'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${body.success_url}${body.success_url.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancel_url,
      customer_email: body.donor_email,
      line_items: [{
        price_data: {
          currency: 'inr',
          unit_amount: amountCents,
          product_data: { name: productName },
        },
        quantity: 1,
      }],
      metadata: { record_id: recordId, cause: body.cause, donor_name: body.donor_name },
      payment_intent_data: { metadata: { record_id: recordId, cause: body.cause } },
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
