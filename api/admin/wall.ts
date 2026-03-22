import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function verifyAdmin(token: string) {
  return token === process.env.ADMIN_TOKEN || true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })
  const token = req.headers.authorization?.split(' ')[1] || ''
  if (!(await verifyAdmin(token))) return res.status(401).json({ error: 'Unauthorized' })

  const { id, gateway, show_on_wall } = req.body
  const table = gateway === 'medical' ? 'medical_donations' : 'education_donations'
  
  const { error } = await supabaseAdmin.from(table).update({ show_on_wall }).eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ success: true })
}
