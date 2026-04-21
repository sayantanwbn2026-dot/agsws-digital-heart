import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { verifyAdmin } from '../_shared/verifyAdmin'

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })
  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
  
  const { payment_id, gateway, stage_index, stage_date, stage_note } = req.body
  const table = gateway === 'medical' ? 'medical_donations' : 'education_donations'
  
  const { data: row, error: fetchErr } = await supabaseAdmin.from(table)
    .select('journey_stages').eq('razorpay_payment_id', payment_id).single()
    
  if (fetchErr || !row) return res.status(404).json({ error: 'Not found' })
  
  const stages = row.journey_stages || []
  if (stages[stage_index]) {
    stages[stage_index].completed = true
    stages[stage_index].date = stage_date
    stages[stage_index].note = stage_note
  }
  
  const { error } = await supabaseAdmin.from(table)
    .update({ journey_stages: stages }).eq('razorpay_payment_id', payment_id)
    
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ success: true, journey_stages: stages })
}
