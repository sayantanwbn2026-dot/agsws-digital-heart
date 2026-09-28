import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { type StripeEnv, verifyWebhook } from '../_shared/stripe.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const internalHeaders = () => ({ 'x-internal-key': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '' })

// Stripe objects reference related objects either by id or expanded.
const idOf = (v: any): string | undefined => (typeof v === 'string' ? v : v?.id) || undefined

// Invoice → subscription id. Newer Stripe API versions (2025-03-31 "basil" and
// later) moved it under `parent.subscription_details`; the webhook payload uses
// whatever version the endpoint was created with, so accept both shapes.
const invoiceSubscriptionId = (inv: any): string | undefined =>
  idOf(inv.subscription) || idOf(inv.parent?.subscription_details?.subscription)

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
      // Present only for monthly donations (Checkout in subscription mode).
      const subscriptionId = idOf(obj.subscription)

      const { data: row, error } = await supabase
        .from(targetTable)
        .update({
          status: newStatus,
          stripe_payment_intent: paymentIntent ?? null,
          ...(subscriptionId && targetTable === 'donations'
            ? { stripe_subscription_id: subscriptionId, subscription_status: 'active' }
            : {}),
        })
        .eq(recordId ? 'id' : 'stripe_session_id', recordId || sessionId)
        .select()
        .single()

      if (error) console.error('[webhook update]', error)

      // Fire emails
      if (row) {
        try {
          await supabase.functions.invoke('send-email', {
            headers: internalHeaders(),
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
              headers: internalHeaders(),
              body: { type: 'gift-card', to: row.gift_recipient_email, data: row },
            })
          } catch (e) { console.error('[gift email]', e) }
        }

        // Admin notification
        try {
          await supabase.functions.invoke('send-email', {
            headers: internalHeaders(),
            body: { type: 'admin-donation', to: 'admin', data: row },
          })
        } catch (e) { console.error('[admin email]', e) }
      }
    } else if (type === 'invoice.paid') {
      // A monthly donation charged again. The first invoice of a subscription is
      // the checkout payment itself, already recorded above — skip it.
      const subscriptionId = invoiceSubscriptionId(obj)
      if (subscriptionId && obj.billing_reason !== 'subscription_create') {
        const { data: original, error: lookupError } = await supabase
          .from('donations')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .is('parent_donation_id', null)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()
        if (lookupError) throw lookupError

        if (!original) {
          console.error('[webhook invoice.paid] no donation for subscription', subscriptionId)
        } else {
          const { data: renewal, error: insertError } = await supabase
            .from('donations')
            .insert({
              cause: original.cause,
              amount_cents: obj.amount_paid ?? original.amount_cents,
              currency: original.currency,
              donor_name: original.donor_name,
              donor_email: original.donor_email,
              donor_phone: original.donor_phone,
              show_on_wall: original.show_on_wall,
              status: 'succeeded',
              frequency: 'monthly',
              stripe_subscription_id: subscriptionId,
              stripe_invoice_id: obj.id,
              parent_donation_id: original.id,
            })
            .select()
            .single()

          // 23505 = this invoice was already recorded (Stripe retried the event).
          if (insertError && insertError.code !== '23505') throw insertError

          if (renewal) {
            try {
              await supabase.functions.invoke('send-email', {
                headers: internalHeaders(),
                body: { type: 'donation-receipt', to: renewal.donor_email, data: renewal },
              })
            } catch (e) { console.error('[renewal email]', e) }
          }
        }
      }
    } else if (type === 'customer.subscription.updated' || type === 'customer.subscription.deleted') {
      // Mirror Stripe's status (active, past_due, canceled…) onto the original
      // donation so staff can see who is still giving monthly.
      await supabase
        .from('donations')
        .update({ subscription_status: obj.status })
        .eq('stripe_subscription_id', obj.id)
        .is('parent_donation_id', null)
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
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
