import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { generate80GPDF } from '../src/lib/pdf/generate80G'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const payment_id = req.query.payment_id as string
  if (!payment_id) return res.status(400).json({ error: 'Missing payment_id' })
  
  let { data: donation } = await supabaseAdmin.from('medical_donations')
    .select('*').eq('razorpay_payment_id', payment_id).single()
  
  let gateway: 'medical' | 'education' = 'medical'
  
  if (!donation) {
    const { data: eduDonation } = await supabaseAdmin.from('education_donations')
      .select('*').eq('razorpay_payment_id', payment_id).single()
    donation = eduDonation
    gateway = 'education'
  }
  
  if (!donation) return res.status(404).json({ error: 'Donation not found' })
  
  const pdfBuffer = await generate80GPDF({
    donorName: donation.donor_name,
    donorEmail: donation.donor_email,
    amount: donation.amount,
    paymentId: donation.razorpay_payment_id,
    panNumber: donation.pan_number || undefined,
    gateway,
    date: new Date(donation.created_at || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  })
  
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename=AGSWS-80G-Receipt.pdf')
  return res.send(Buffer.from(pdfBuffer))
}
