import type { VercelRequest, VercelResponse } from '@vercel/node'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body
    const gateway = body.gateway

    const notes: Record<string, string> = {
      gateway,
      donor_name:           body.donor_name           ?? body.registrant_name  ?? '',
      donor_email:          body.donor_email           ?? body.registrant_email ?? '',
      donor_phone:          body.donor_phone           ?? body.registrant_phone ?? '',
      pan_number:           body.pan_number            ?? '',
      frequency:            body.frequency             ?? 'one-time',
      tier:                 body.tier                  ?? '',
      is_gift:              String(body.is_gift        ?? false),
      gift_recipient_name:  body.gift_recipient_name   ?? '',
      gift_recipient_email: body.gift_recipient_email  ?? '',
      gift_message:         body.gift_message          ?? '',
      show_on_wall:         String(body.show_on_wall   ?? true),
      referrer_code:        body.referrer_code         ?? '',
      dedication_name:      body.dedication_name       ?? '',
      parent_name:          body.parent_name           ?? '',
    }

    const order = await razorpay.orders.create({
      amount:   body.amount,
      currency: 'INR',
      receipt:  'rcpt_' + gateway + '_' + Date.now(),
      notes,
    })

    return res.status(200).json({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
      key_id:   process.env.RAZORPAY_KEY_ID,
    })

  } catch (err) {
    console.error('[create-order]', err)
    return res.status(500).json({ error: 'Failed to create order' })
  }
}
