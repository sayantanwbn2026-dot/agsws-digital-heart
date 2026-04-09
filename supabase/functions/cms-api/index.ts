import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  const table = url.searchParams.get('table')
  const id = url.searchParams.get('id')

  // Allow cms_ tables, plus newsletter_subscriptions, support_applications
  const allowedPrefixes = ['cms_', 'newsletter_', 'support_']
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
