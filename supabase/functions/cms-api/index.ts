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

// Tables that don't have sort_order column
const NO_SORT_ORDER = ['cms_site_settings', 'cms_hero', 'cms_payment_config', 'newsletter_subscriptions', 'support_applications']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
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

      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
      
      const { data, error } = await supabaseAdmin.storage
        .from('cms-uploads')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      
      if (error) throw error

      const { data: urlData } = supabaseAdmin.storage
        .from('cms-uploads')
        .getPublicUrl(data.path)

      return new Response(JSON.stringify({ url: urlData.publicUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  const table = url.searchParams.get('table')
  const id = url.searchParams.get('id')

  // Allow cms_ tables, plus newsletter_subscriptions, support_applications
  const allowedPrefixes = ['cms_', 'newsletter_', 'support_', 'cms_resources']
  if (!table || !allowedPrefixes.some(p => table.startsWith(p))) {
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
      if (table === 'support_applications' || table === 'newsletter_subscriptions') {
        query = query.order('created_at', { ascending: false })
      }
      if (table === 'cms_blog_posts') {
        query = query.order('created_at', { ascending: false })
      }
      const { data, error } = await query
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      const body = await req.json()
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
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
