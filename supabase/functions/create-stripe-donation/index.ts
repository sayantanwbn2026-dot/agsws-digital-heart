// Creates a Stripe Checkout session for donations or GoldenAge registration
// Routes through the Lovable Stripe gateway — no Stripe SDK needed.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const STRIPE_GATEWAY = 'https://connector-gateway.lovable.dev/stripe'

interface DonationBody {
  cause: 'medical' | 'education' | 'goldenage'
  amount: number // in major units (rupees)
  donor_name: string
  donor_email: string
  donor_phone?: string
  is_gift?: boolean
  gift_recipient_name?: string
  gift_recipient_email?: string
  gift_message?: string
  show_on_wall?: boolean
  // GoldenAge-specific
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
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  const STRIPE_KEY = Deno.env.get('STRIPE_SANDBOX_API_KEY') || Deno.env.get('STRIPE_API_KEY')
  if (!LOVABLE_API_KEY || !STRIPE_KEY) {
    return new Response(JSON.stringify({ error: 'Payments not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const body = await req.json() as DonationBody
    if (!body.cause || !body.amount || !body.donor_email || !body.donor_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (body.amount < 1 || body.amount > 1000000) {
      return new Response(JSON.stringify({ error: 'Amount out of range' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

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

    // Build Stripe Checkout Session via gateway (form-encoded)
    const productName =
      body.cause === 'medical' ? 'AGSWS Medical Aid Donation' :
      body.cause === 'education' ? 'AGSWS Education Support Donation' :
      'AGSWS GoldenAge Care Registration'

    const params = new URLSearchParams()
    params.append('mode', 'payment')
    params.append('success_url', `${body.success_url}?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url', body.cancel_url)
    params.append('customer_email', body.donor_email)
    params.append('line_items[0][price_data][currency]', 'inr')
    params.append('line_items[0][price_data][unit_amount]', String(amountCents))
    params.append('line_items[0][price_data][product_data][name]', productName)
    params.append('line_items[0][quantity]', '1')
    params.append('metadata[record_id]', recordId)
    params.append('metadata[cause]', body.cause)
    params.append('metadata[donor_name]', body.donor_name)
    params.append('payment_intent_data[metadata][record_id]', recordId)
    params.append('payment_intent_data[metadata][cause]', body.cause)

    const stripeRes = await fetch(`${STRIPE_GATEWAY}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': STRIPE_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const session = await stripeRes.json()
    if (!stripeRes.ok) {
      console.error('Stripe error:', session)
      return new Response(JSON.stringify({ error: session.error?.message || 'Stripe session failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Save session id back
    const targetTable = body.cause === 'goldenage' ? 'goldenage_registrations' : 'donations'
    await supabase.from(targetTable).update({ stripe_session_id: session.id }).eq('id', recordId)

    return new Response(JSON.stringify({ session_id: session.id, url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[create-stripe-donation]', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
