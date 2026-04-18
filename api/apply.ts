import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { data, error } = await supabaseAdmin
    .from('support_applications')
    .insert([req.body])
    .select('application_ref, applicant_name, email, phone, type')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  // Notify admin
  try {
    await supabaseAdmin.functions.invoke('send-email', {
      body: { type: 'admin-application', to: 'admin', data },
    })
  } catch (e) {
    console.error('[application admin email]', e)
  }

  return res.status(200).json({ application_ref: data.application_ref })
}
