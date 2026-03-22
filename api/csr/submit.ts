import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { sendAdminNotification } from '../../src/lib/email/sender'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  const { error } = await supabaseAdmin.from('csr_enquiries').insert([req.body])
  if (error) return res.status(500).json({ error: error.message })
  
  await sendAdminNotification({
    type: 'CSR Enquiry',
    details: `New CSR enquiry received from ${req.body.company_name || 'a company'}.`
  }).catch((err) => console.error('Email error:', err))
  
  return res.status(200).json({ success: true })
}
