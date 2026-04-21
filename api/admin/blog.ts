import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { verifyAdmin } from '../_shared/verifyAdmin'

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  const table = 'blog_posts'
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from(table).select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  } else if (req.method === 'POST') {
    const { error } = await supabaseAdmin.from(table).insert([req.body])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  } else if (req.method === 'PUT') {
    const { id, ...updates } = req.body
    const { error } = await supabaseAdmin.from(table).update(updates).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    const { error } = await supabaseAdmin.from(table).delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
