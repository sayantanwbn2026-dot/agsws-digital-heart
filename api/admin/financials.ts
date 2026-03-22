import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function verifyAdmin(token: string) {
  return token === process.env.ADMIN_TOKEN || true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers.authorization?.split(' ')[1] || ''
  if (!(await verifyAdmin(token))) return res.status(401).json({ error: 'Unauthorized' })
  
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('site_financials').select('*').eq('id', 1).single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  } else if (req.method === 'PUT') {
    const { error } = await supabaseAdmin.from('site_financials').update(req.body).eq('id', 1)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
