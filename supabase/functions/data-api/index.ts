import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ADMIN_EMAIL = Deno.env.get('CMS_ADMIN_EMAIL') || ''

function isValidAdminToken(token: string): boolean {
  if (!token) return false
  try {
    const decoded = atob(token)
    const [tokenEmail, tsStr] = decoded.split(':')
    const ts = Number(tsStr)
    const ageMs = Date.now() - ts
    return (
      tokenEmail === ADMIN_EMAIL &&
      Number.isFinite(ts) &&
      ageMs >= 0 &&
      ageMs < 12 * 60 * 60 * 1000
    )
  } catch {
    return false
  }
}

function requireAdmin(req: Request): boolean {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  return isValidAdminToken(token)
}

function buildDonationStages(row: any) {
  const created = row.created_at ? new Date(row.created_at) : null
  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null
  const succeeded = row.status === 'succeeded'
  const updated = row.updated_at ? new Date(row.updated_at) : created
  return [
    { label: 'Payment Received', completed: !!created, date: fmt(created), note: 'Donation confirmed and receipt issued.' },
    { label: 'Funds Verified', completed: succeeded, date: succeeded ? fmt(updated) : null, note: 'Payment captured and reconciled by finance team.' },
    { label: 'Allocated to Cause', completed: succeeded, date: succeeded ? fmt(updated) : null, note: `Allocated to ${row.cause || 'programme'} fund.` },
    { label: 'Deployed in Field', completed: succeeded, date: succeeded ? fmt(updated) : null, note: 'Used for direct beneficiary support in Kolkata.' },
  ]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    // Path style: /data-api/<action>
    const segments = url.pathname.split('/').filter(Boolean)
    const action = segments[segments.length - 1] || ''

    // ====== PUBLIC ======
    if (action === 'donor-wall' && req.method === 'GET') {
      const gateway = url.searchParams.get('gateway')
      const limit = Math.min(Number(url.searchParams.get('limit') || '50'), 200)
      let q = supabase
        .from('donations')
        .select('id, donor_name, cause, amount_cents, currency, created_at, metadata')
        .eq('status', 'succeeded')
        .eq('show_on_wall', true)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (gateway && gateway.toLowerCase() !== 'all') {
        const g = gateway.toLowerCase()
        const causeMap: Record<string, string> = {
          'medical aid': 'medical', medical: 'medical',
          education: 'education',
          registration: 'goldenage', goldenage: 'goldenage',
        }
        q = q.eq('cause', causeMap[g] || g)
      }
      const { data, error } = await q
      if (error) return json({ error: error.message }, 500)
      const mapped = (data || []).map((d: any) => {
        const first = (d.donor_name || 'Anonymous').split(' ')[0]
        return {
          id: d.id,
          name: first,
          donor_first_name: first,
          city: d.metadata?.city || 'India',
          gateway: d.cause,
          amount: Math.round((d.amount_cents || 0) / 100),
          time: timeAgo(d.created_at),
          created_at: d.created_at,
        }
      })
      return json(mapped)
    }

    if (action === 'track-donation' && req.method === 'GET') {
      const ref = url.searchParams.get('payment_id') || ''
      if (!ref) return json({ error: 'Missing payment_id' }, 400)
      const { data, error } = await supabase
        .from('donations')
        .select('id, donor_name, cause, amount_cents, status, created_at, updated_at, stripe_payment_intent, stripe_session_id')
        .or(`stripe_payment_intent.eq.${ref},stripe_session_id.eq.${ref},id.eq.${isUuid(ref) ? ref : '00000000-0000-0000-0000-000000000000'}`)
        .maybeSingle()
      if (error) return json({ error: error.message }, 500)
      if (!data) return json({ error: 'Not found' }, 404)
      return json({
        amount: Math.round((data.amount_cents || 0) / 100),
        gateway: data.cause,
        createdAt: new Date(data.created_at).toLocaleDateString('en-IN'),
        status: data.status,
        stages: buildDonationStages(data),
      })
    }

    if (action === 'track-registration' && req.method === 'GET') {
      const ref = (url.searchParams.get('id') || '').trim()
      if (!ref) return json({ error: 'Missing id' }, 400)
      const { data, error } = await supabase
        .from('goldenage_registrations')
        .select('registration_ref, parent_name, registrant_name, registrant_city, status, created_at')
        .eq('registration_ref', ref)
        .maybeSingle()
      if (error) return json({ error: error.message }, 500)
      if (!data) return json({ error: 'Not found' }, 404)
      const status = data.status === 'paid' ? 'Active' : data.status === 'pending' ? 'Pending' : 'Closed'
      const completedCount = data.status === 'paid' ? 2 : data.status === 'pending' ? 1 : 0
      const STEP_META = [
        { label: 'Registration Confirmed', desc: 'Your registration and ₹100 payment received.' },
        { label: 'Coordinator Assigned', desc: 'A local AGSWS coordinator will contact you within 24 hours.' },
        { label: 'First Wellness Check', desc: 'Your parent will be visited and briefed.' },
        { label: 'Emergency Support Active', desc: '24/7 emergency response activation pending.' },
      ]
      return json({
        parentName: data.parent_name,
        registrant: data.registrant_name,
        city: data.registrant_city,
        status,
        case_status: data.status,
        created_at: data.created_at,
        steps: STEP_META.map((m, i) => ({
          label: m.label,
          completed: i < completedCount,
          date: i === 0 && data.created_at ? new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
          desc: m.desc,
        })),
      })
    }

    // ====== ADMIN ======
    if (action === 'admin-donations' && req.method === 'GET') {
      if (!requireAdmin(req)) return json({ error: 'Unauthorized' }, 401)
      const gateway = (url.searchParams.get('gateway') || '').toLowerCase()
      let q = supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(500)
      if (gateway === 'education') q = q.eq('cause', 'education')
      else if (gateway === 'medical') q = q.eq('cause', 'medical')
      const { data, error } = await q
      if (error) return json({ error: error.message }, 500)
      return json(data || [])
    }

    if (action === 'admin-registrations' && req.method === 'GET') {
      if (!requireAdmin(req)) return json({ error: 'Unauthorized' }, 401)
      const { data, error } = await supabase
        .from('goldenage_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      if (error) return json({ error: error.message }, 500)
      return json(data || [])
    }

    return json({ error: `Unknown action: ${action}` }, 404)
  } catch (err) {
    console.error('[data-api]', err)
    return json({ error: (err as Error).message }, 500)
  }
})

function timeAgo(iso?: string): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}