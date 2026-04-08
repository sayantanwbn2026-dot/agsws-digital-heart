import { corsHeaders } from '@supabase/supabase-js/cors'

const ADMIN_EMAIL = 'sayantanmukherjee2505@gmail.com'
const ADMIN_PASSWORD = 'Admin@2025'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password } = await req.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate a simple session token
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
