const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// HMAC-SHA256 signed admin token: base64url(payload).base64url(sig)
// payload = `${email}:${issuedAtMs}`
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const b64urlDecode = (s: string) => {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0
  const bin = atob(s + '='.repeat(pad))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function importKey(secret: string) {
  return await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function getSecret(): string {
  // Prefer dedicated signing secret; fall back to admin password so existing
  // deployments keep working without an extra env var.
  return Deno.env.get('CMS_TOKEN_SECRET') || Deno.env.get('CMS_ADMIN_PASSWORD') || ''
}

export async function issueToken(email: string): Promise<string> {
  const payload = `${email}:${Date.now()}`
  const key = await importKey(getSecret())
  const sig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)),
  )
  return `${b64url(new TextEncoder().encode(payload))}.${b64url(sig)}`
}

export async function verifyToken(token: string, expectedEmail: string): Promise<boolean> {
  if (!token || !expectedEmail) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  try {
    const payloadBytes = b64urlDecode(parts[0])
    const sigBytes = b64urlDecode(parts[1])
    const key = await importKey(getSecret())
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { email, password, verify } = body as {
      email?: string
      password?: string
      verify?: boolean
    }

    const adminEmail = Deno.env.get('CMS_ADMIN_EMAIL')
    const adminPassword = Deno.env.get('CMS_ADMIN_PASSWORD')

    if (!adminEmail || !adminPassword) {
      return new Response(JSON.stringify({ error: 'Admin credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verification path: validate a previously issued HMAC-signed token.
    if (verify) {
      const authHeader = req.headers.get('authorization') || ''
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
      if (!token) {
        return new Response(JSON.stringify({ valid: false }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const valid = await verifyToken(token, adminEmail)
      return new Response(JSON.stringify({ valid }), {
        status: valid ? 200 : 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (email === adminEmail && password === adminPassword) {
      const token = await issueToken(email)
      return new Response(JSON.stringify({ success: true, token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
