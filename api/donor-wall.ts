import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  
  const gateway = req.query.gateway as string || null
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20
  
  const { data, error } = await supabase.rpc('get_wall_donations', { gateway, limit })
  if (error) return res.status(500).json({ error: error.message })
  
  return res.status(200).json(data || [])
}
