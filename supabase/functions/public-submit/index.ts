import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const body = await req.json()
    const kind = String(body?.kind || '').trim()

    if (kind === 'support_application') {
      const payload = body?.payload || {}
      const insert = {
        type: String(payload.type || 'general').slice(0, 50),
        applicant_name: String(payload.applicant_name || '').slice(0, 200),
        email: String(payload.email || '').slice(0, 255),
        phone: String(payload.phone || '').slice(0, 30),
        status: ['pending', 'waitlisted'].includes(payload.status) ? payload.status : 'pending',
        form_data: payload.form_data || {},
      }
      if (!insert.applicant_name || !insert.email || !insert.phone) {
        return json({ error: 'Missing required fields' }, 400)
      }
      const { data, error } = await supabaseAdmin
        .from('support_applications')
        .insert(insert)
        .select('application_ref')
        .single()
      if (error) return json({ error: error.message }, 500)

      // Best-effort admin notification
      try {
        await supabaseAdmin.functions.invoke('send-email', {
          headers: { 'x-internal-key': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '' },
          body: {
            type: 'admin-application',
            to: 'admin',
            data: {
              application_ref: data.application_ref,
              applicant_name: insert.applicant_name,
              email: insert.email,
              phone: insert.phone,
              type: insert.type,
            },
          },
        })
      } catch (e) {
        console.error('[public-submit email]', e)
      }

      return json({ application_ref: data.application_ref })
    }

    if (kind === 'event_seats_taken') {
      const eventId = String(body?.event_id || '')
      if (!eventId) return json({ error: 'event_id required' }, 400)
      const { data, error } = await supabaseAdmin
        .from('support_applications')
        .select('form_data,status')
        .eq('type', 'event_registration')
      if (error) return json({ error: error.message }, 500)
      const seats = (data || [])
        .filter((r: any) => r?.form_data?.event_id === eventId && r?.status !== 'rejected' && r?.status !== 'waitlisted')
        .reduce((sum: number, r: any) => sum + (Number(r?.form_data?.attendees) || 1), 0)
      return json({ seats })
    }

    return json({ error: 'Unknown kind' }, 400)
  } catch (err) {
    return json({ error: (err as Error).message }, 500)
  }
})