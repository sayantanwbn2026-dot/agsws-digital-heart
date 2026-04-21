import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { verifyAdmin } from '../_shared/verifyAdmin'

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })
  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
  
  const { volunteer_id, activity, hours } = req.body
  const { data: vol, error: fetchErr } = await supabaseAdmin.from('volunteers')
    .select('activities, total_hours').eq('id', volunteer_id).single()
    
  if (fetchErr || !vol) return res.status(404).json({ error: 'Not found' })
  
  const activities = vol.activities || []
  activities.push(activity)
  const total_hours = (vol.total_hours || 0) + (hours || 0)
  
  const { error } = await supabaseAdmin.from('volunteers')
    .update({ activities, total_hours }).eq('id', volunteer_id)
    
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ success: true })
}
