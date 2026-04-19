import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { type StripeEnv, verifyWebhook } from '../_shared/stripe.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const env = ((new URL(req.url).searchParams.get('env') || 'sandbox') === 'live' ? 'live' : 'sandbox') as StripeEnv

  try {
    const event = await verifyWebhook(req, env)
    const type = event.type as string
    const obj = event.data?.object || {}

    if (type === 'checkout.session.completed') {
      const sessionId = obj.id || obj.session_id
      const paymentIntent = typeof obj.payment_intent === 'string' ? obj.payment_intent : obj.payment_intent?.id || obj.payment_intent_id
      const recordId = obj.metadata?.record_id
      const cause = obj.metadata?.cause

      const targetTable = cause === 'goldenage' ? 'goldenage_registrations' : 'donations'
      const newStatus = cause === 'goldenage' ? 'paid' : 'succeeded'

      const { data: row, error } = await supabase
        .from(targetTable)
        .update({ status: newStatus, stripe_payment_intent: paymentIntent })
        .eq(recordId ? 'id' : 'stripe_session_id', recordId || sessionId)
        .select()
        .single()

      if (error) console.error('[webhook update]', error)

      // Fire emails
      if (row) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              type: cause === 'goldenage' ? 'goldenage-confirmation' : 'donation-receipt',
              to: row.donor_email || row.registrant_email,
              data: row,
            },
          })
        } catch (e) {
          console.error('[webhook email]', e)
        }

        // Gift email
        if (row.is_gift && row.gift_recipient_email) {
          try {
            await supabase.functions.invoke('send-email', {
              body: { type: 'gift-card', to: row.gift_recipient_email, data: row },
            })
          } catch (e) { console.error('[gift email]', e) }
        }

        // Admin notification
        try {
          await supabase.functions.invoke('send-email', {
            body: { type: 'admin-donation', to: 'admin', data: row },
          })
        } catch (e) { console.error('[admin email]', e) }
      }
    } else if (type === 'payment_intent.payment_failed' || type === 'checkout.session.expired') {
      const sessionId = obj.id || obj.session_id
      const recordId = obj.metadata?.record_id
      const cause = obj.metadata?.cause
      const targetTable = cause === 'goldenage' ? 'goldenage_registrations' : 'donations'
      await supabase.from(targetTable).update({ status: cause === 'goldenage' ? 'cancelled' : 'failed' })
        .eq(recordId ? 'id' : 'stripe_session_id', recordId || sessionId)
    }

    return new Response(JSON.stringify({ received: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('[payments-webhook]', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
