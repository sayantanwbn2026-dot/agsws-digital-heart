import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ADMIN_EMAIL = Deno.env.get('CMS_ADMIN_EMAIL') || ''
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000
const TOKEN_SECRET = Deno.env.get('CMS_TOKEN_SECRET') || Deno.env.get('CMS_ADMIN_PASSWORD') || ''

const b64urlDecode = (s: string) => {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0
  const bin = atob(s + '='.repeat(pad))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

let _key: CryptoKey | null = null
async function getKey() {
  if (_key) return _key
  _key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  return _key
}

async function verifyToken(token: string, expectedEmail: string): Promise<boolean> {
  if (!token || !expectedEmail || !TOKEN_SECRET) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  try {
    const payloadBytes = b64urlDecode(parts[0])
    const sigBytes = b64urlDecode(parts[1])
    const key = await getKey()
    const ok = await crypto.subtle.verify('HMAC', key, sigBytes, payloadBytes)
    if (!ok) return false
    const decoded = new TextDecoder().decode(payloadBytes)
    const [tokenEmail, tsStr] = decoded.split(':')
    const ts = Number(tsStr)
    const age = Date.now() - ts
    return tokenEmail === expectedEmail && Number.isFinite(ts) && age >= 0 && age < TOKEN_TTL_MS
  } catch {
    return false
  }
}

const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'
])
const ALLOWED_UPLOAD_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'])
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

// Tables that don't have sort_order column
const NO_SORT_ORDER = ['cms_site_settings', 'cms_hero', 'cms_payment_config', 'cms_sections', 'newsletter_subscriptions', 'support_applications', 'donations', 'goldenage_registrations']
const DIRECT_TABLES = new Set(['donations', 'goldenage_registrations'])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  const validAdmin = ADMIN_EMAIL ? await verifyToken(token, ADMIN_EMAIL) : false
  if (!validAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  
  // Handle file upload endpoint
  if (url.pathname.endsWith('/cms-api/upload')) {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    try {
      const formData = await req.formData()
      const file = formData.get('file') as File
      const folder = (formData.get('folder') as string) || 'general'
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const ext = (file.name.split('.').pop() || '').toLowerCase()
      if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
        return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (!ALLOWED_UPLOAD_EXT.has(ext)) {
        return new Response(JSON.stringify({ error: 'Unsupported file extension' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return new Response(JSON.stringify({ error: 'File exceeds 10 MB' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const safeFolder = String(folder).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'general'
      const path = `${safeFolder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
      
      const { data, error } = await supabaseAdmin.storage
        .from('cms-uploads')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
      
      if (error) throw error

      const { data: urlData } = supabaseAdmin.storage
        .from('cms-uploads')
        .getPublicUrl(data.path)

      return new Response(JSON.stringify({ url: urlData.publicUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  const table = url.searchParams.get('table')
  const id = url.searchParams.get('id')

  // Allow cms_ tables, plus newsletter_subscriptions, support_applications,
  // donations, goldenage_registrations.
  const allowedPrefixes = ['cms_', 'newsletter_', 'support_']
  if (!table || (!allowedPrefixes.some(p => table.startsWith(p)) && !DIRECT_TABLES.has(table))) {
    return new Response(JSON.stringify({ error: 'Invalid table' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    if (req.method === 'GET') {
      let query = supabaseAdmin.from(table).select('*')
      if (!NO_SORT_ORDER.includes(table)) {
        query = query.order('sort_order', { ascending: true })
      }
      if (table === 'support_applications' || table === 'newsletter_subscriptions' || table === 'donations' || table === 'goldenage_registrations') {
        query = query.order('created_at', { ascending: false })
      }
      if (table === 'cms_blog_posts') {
        query = query.order('created_at', { ascending: false })
      }
      if (table === 'cms_events') {
        // Events list ordering is critical — guarantee a deterministic sort:
        //   1) primary: event_date DESC, NULLs last (so dated events always
        //      win over undated ones)
        //   2) tie-breaker: created_at DESC (newer record wins on identical
        //      dates — useful when admins clone an event)
        //   3) final tie-breaker: id ASC (stable across page loads)
        query = query
          .order('event_date', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .order('id', { ascending: true })
      }
      const { data, error } = await query
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      const body = await req.json()
      if (table === 'cms_volunteers' && body && typeof body.certificate_password === 'string' && body.certificate_password.length > 0) {
        const { data: hashed, error: hErr } = await supabaseAdmin.rpc('hash_password', { _password: body.certificate_password })
        if (hErr) throw hErr
        body.certificate_password = hashed
      }
      const { data, error } = await supabaseAdmin.from(table).insert(body).select().single()
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'PUT') {
      if (!id) throw new Error('ID required for update')
      const body = await req.json()
      delete body.id
      delete body.created_at
      delete body.updated_at
      if (table === 'cms_volunteers') {
        if (typeof body.certificate_password === 'string' && body.certificate_password.length > 0) {
          // Don't re-hash an already-hashed value (admins sometimes resubmit the form unchanged)
          if (!body.certificate_password.startsWith('$2')) {
            const { data: hashed, error: hErr } = await supabaseAdmin.rpc('hash_password', { _password: body.certificate_password })
            if (hErr) throw hErr
            body.certificate_password = hashed
          }
        } else if (body.certificate_password === '' || body.certificate_password === null) {
          // Treat empty string as "no change" to avoid wiping an existing password by accident
          delete body.certificate_password
        }
      }
      const { data, error } = await supabaseAdmin.from(table).update(body).eq('id', id).select().single()
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'DELETE') {
      if (!id) throw new Error('ID required for delete')
      const { error } = await supabaseAdmin.from(table).delete().eq('id', id)
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
