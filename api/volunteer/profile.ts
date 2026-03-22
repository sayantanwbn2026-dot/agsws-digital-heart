import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const volunteer_id = req.query.volunteer_id as string
  if (!volunteer_id) return res.status(400).json({ error: 'Missing volunteer_id param' })
  
  const { data, error } = await supabase.rpc('get_volunteer_profile', { volunteer_id })
  if (error || !data) return res.status(404).json({ error: 'Not found' })
  
  return res.status(200).json(data)
}
