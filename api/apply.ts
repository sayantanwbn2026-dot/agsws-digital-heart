import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Whitelist + validate fields. Status, admin_notes, application_ref are NEVER
// accepted from the client — they are managed server-side / by the database.
const applicationSchema = z.object({
  type: z.string().trim().min(1).max(50),
  applicant_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(30),
  form_data: z.record(z.unknown()).default({}),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const parsed = applicationSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const { data, error } = await supabaseAdmin
    .from('support_applications')
    .insert([parsed.data])
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
