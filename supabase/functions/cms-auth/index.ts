const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Verification path: validate a previously issued token.
    // Tokens are base64(email:timestamp:uuid) — we accept them if the email
    // matches the configured admin and they are <= 12h old.
    if (verify) {
      const authHeader = req.headers.get('authorization') || ''
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
      if (!token) {
        return new Response(JSON.stringify({ valid: false }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      try {
        const decoded = atob(token)
        const [tokenEmail, tsStr] = decoded.split(':')
        const ts = Number(tsStr)
        const ageMs = Date.now() - ts
        const valid =
          tokenEmail === adminEmail &&
          Number.isFinite(ts) &&
          ageMs >= 0 &&
          ageMs < 12 * 60 * 60 * 1000
        return new Response(JSON.stringify({ valid }), {
          status: valid ? 200 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } catch {
        return new Response(JSON.stringify({ valid: false }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    if (email === adminEmail && password === adminPassword) {
      const token = btoa(`${email}:${Date.now()}:${crypto.randomUUID()}`)
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
