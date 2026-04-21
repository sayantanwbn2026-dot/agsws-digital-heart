import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Strict whitelist for event registration submissions.
const registrationSchema = z.object({
  event_id: z.string().trim().min(1).max(100).optional(),
  event_title: z.string().trim().min(1).max(200).optional(),
  attendee_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(30),
  guests: z.number().int().min(0).max(20).optional(),
  notes: z.string().trim().max(1000).optional(),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const parsed = registrationSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const { error } = await supabaseAdmin.from('event_registrations').insert([parsed.data])
  if (error) return res.status(500).json({ error: error.message })
  
  return res.status(200).json({ success: true })
}
