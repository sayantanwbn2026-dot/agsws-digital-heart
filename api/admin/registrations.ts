import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { verifyAdmin } from '../_shared/verifyAdmin'

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
  
  const { data, error } = await supabaseAdmin.from('parent_registrations').select('*').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
