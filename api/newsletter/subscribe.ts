import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, source } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Email required' })

  const { error } = await supabaseAdmin
    .from('newsletter_subscriptions')
    .insert([{ email, name: name || null, source: source || 'website' }])

  if (error && error.code !== '23505') {
    return res.status(500).json({ error: error.message })
  }

  // Fire-and-forget welcome email via Edge Function
  try {
    await supabaseAdmin.functions.invoke('send-email', {
      body: { type: 'newsletter-welcome', to: email, data: { name } },
    })
  } catch (e) {
    console.error('[newsletter welcome email]', e)
  }

  return res.status(200).json({ success: true })
}
