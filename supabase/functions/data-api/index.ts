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

function buildApplicationStages(row: any) {
  const created = row.created_at ? new Date(row.created_at) : null
  const updated = row.updated_at ? new Date(row.updated_at) : created
  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null
  const status = String(row.status || 'pending').toLowerCase()
  const isReceived = !!created
  const isReviewing = ['reviewing', 'approved', 'rejected', 'waitlisted'].includes(status)
  const isDecided = ['approved', 'rejected'].includes(status)
  const decisionLabel =
    status === 'approved' ? 'Approved' :
    status === 'rejected' ? 'Rejected' :
    status === 'waitlisted' ? 'Waitlisted' : 'Decision Pending'
  return [
    { label: 'Application Received', completed: isReceived, date: fmt(created), note: 'We have your application and reference number.' },
    { label: 'Under Review', completed: isReviewing, date: isReviewing ? fmt(updated) : null, note: 'Our team is reviewing your details and any documents.' },
    { label: decisionLabel, completed: isDecided, date: isDecided ? fmt(updated) : null, note: isDecided ? (status === 'approved' ? 'Your application has been approved. We will be in touch with next steps.' : 'Your application could not be approved at this time.') : 'You will receive an email once a decision is made.' },
  ]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    // Path style: /data-api/<action>
    const segments = url.pathname.split('/').filter(Boolean)
    // Support both /data-api/<action> and /data-api?action=<action>
    let action = url.searchParams.get('action') || ''
    if (!action) {
      const last = segments[segments.length - 1] || ''
      // If the last segment is the function name itself, there's no action
      action = last === 'data-api' ? '' : last
    }

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

    if (action === 'track-volunteer' && req.method === 'GET') {
      const ref = (url.searchParams.get('id') || '').trim()
      if (!ref) return json({ error: 'Missing id' }, 400)
      const { data, error } = await supabase
        .from('support_applications')
        .select('application_ref, applicant_name, email, phone, status, form_data, created_at')
        .eq('type', 'volunteer')
        .eq('application_ref', ref)
        .maybeSingle()
      if (error) return json({ error: error.message }, 500)
      if (!data) return json({ error: 'Not found' }, 404)
      const fd = (data.form_data || {}) as any
      return json({
        ref: data.application_ref,
        name: data.applicant_name,
        role: fd.role_interest || 'Volunteer',
        since: new Date(data.created_at).getFullYear().toString(),
        status: data.status,
        totalHours: Number(fd.total_hours || 0),
        categories: fd.categories || { field: 0, medical: 0, education: 0, admin: 0 },
        activities: Array.isArray(fd.activities) ? fd.activities : [],
      })
    }

    // Public application status tracker — exposes only non-sensitive info
    if (action === 'track-application' && req.method === 'GET') {
      const ref = (url.searchParams.get('id') || '').trim().toUpperCase()
      if (!ref) return json({ error: 'Missing id' }, 400)
      const { data, error } = await supabase
        .from('support_applications')
        .select('application_ref, applicant_name, type, status, created_at, updated_at, admin_notes')
        .eq('application_ref', ref)
        .maybeSingle()
      if (error) return json({ error: error.message }, 500)
      if (!data) return json({ error: 'Not found' }, 404)
      return json({
        ref: data.application_ref,
        name: data.applicant_name,
        type: data.type,
        status: data.status,
        admin_notes: data.admin_notes || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        stages: buildApplicationStages(data),
      })
    }

    // Direct upload to private application-docs bucket — used by the public
    // apply form. We accept multipart uploads here (rather than handing out a
    // signed URL) so the bucket can stay strictly private and the client
    // never needs storage credentials. Validates type + size server-side.
    if (action === 'upload-application-doc' && req.method === 'POST') {
      const ALLOWED = new Set(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
      const MAX_BYTES = 5 * 1024 * 1024
      const form = await req.formData()
      const file = form.get('file') as File | null
      const refKey = String(form.get('ref') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
      if (!file) return json({ error: 'No file provided' }, 400)
      if (!ALLOWED.has(file.type)) return json({ error: 'Unsupported file type' }, 400)
      if (file.size > MAX_BYTES) return json({ error: 'File exceeds 5 MB' }, 400)
      if (!refKey) return json({ error: 'Missing ref' }, 400)
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
      const path = `${refKey}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`
      const { error: upErr } = await supabase.storage
        .from('application-docs')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
      if (upErr) return json({ error: upErr.message }, 500)
      return json({ path, name: file.name, size: file.size, type: file.type })
    }

    // Admin-only: returns a short-lived signed URL for an application doc
    if (action === 'admin-application-doc-url' && req.method === 'GET') {
      if (!requireAdmin(req)) return json({ error: 'Unauthorized' }, 401)
      const path = url.searchParams.get('path') || ''
      if (!path) return json({ error: 'Missing path' }, 400)
      const { data, error } = await supabase.storage
        .from('application-docs')
        .createSignedUrl(path, 60 * 10)
      if (error) return json({ error: error.message }, 500)
      return json({ url: data.signedUrl, expires_in: 600 })
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