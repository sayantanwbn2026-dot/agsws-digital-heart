// Sends transactional emails via Resend (connector gateway)
// Templates: donation-receipt, goldenage-confirmation, gift-card,
//            admin-donation, admin-application, newsletter-welcome

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const RESEND_GATEWAY = 'https://connector-gateway.lovable.dev/resend'
const FROM = 'AGSWS <onboarding@resend.dev>'
const ADMIN_EMAIL = Deno.env.get('CMS_ADMIN_EMAIL') || 'admin@agsws.org'

const TEAL = '#1F9AA8'
const YELLOW = '#F2B705'

function fmtINR(cents: number) {
  return '₹' + Math.round((cents || 0) / 100).toLocaleString('en-IN')
}

function donationReceiptHTML(d: any) {
  const causeLabel = d.cause === 'medical' ? 'Medical Aid' : d.cause === 'education' ? 'Education Support' : 'GoldenAge Care'
  return `
    <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#F7F5F2;padding:32px 0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
        <div style="background:linear-gradient(135deg,${TEAL},#176B75);padding:36px;text-align:center">
          <div style="display:inline-block;background:rgba(255,255,255,.15);padding:8px 16px;border-radius:99px;color:#fff;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase">Receipt</div>
          <h1 style="color:#fff;margin:16px 0 0;font-size:28px;font-weight:800">Thank you, ${d.donor_name}!</h1>
        </div>
        <div style="padding:36px">
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px">Your generosity helps us continue serving families across Kolkata. Here are your donation details:</p>
          <div style="background:#F7F5F2;border-radius:12px;padding:24px;margin-bottom:24px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="color:#64748b;padding:6px 0">Amount</td><td style="text-align:right;font-weight:700;color:#1F9AA8;font-size:18px">${fmtINR(d.amount_cents)}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Cause</td><td style="text-align:right;font-weight:600">${causeLabel}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Payment ID</td><td style="text-align:right;font-family:monospace;font-size:12px">${d.stripe_payment_intent || d.stripe_session_id || '—'}</td></tr>
              <tr><td style="color:#64748b;padding:6px 0">Date</td><td style="text-align:right">${new Date(d.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>
            </table>
          </div>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px">A formal acknowledgement letter will be issued separately if needed for your records.</p>
          <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">AGSWS — The Ascension Group Social Welfare Society<br/>Kolkata, West Bengal, India</p>
        </div>
      </div>
    </div>`
}

function goldenageHTML(d: any) {
  return `
    <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#F7F5F2;padding:32px 0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,${TEAL},#176B75);padding:36px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800">Registration Confirmed</h1>
        </div>
        <div style="padding:36px">
          <p style="color:#475569;font-size:15px">Dear ${d.registrant_name},</p>
          <p style="color:#475569;font-size:15px">Your parent <strong>${d.parent_name}</strong> has been successfully registered for AGSWS GoldenAge Care.</p>
          <div style="background:#E6F4F6;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
            <p style="margin:0;font-size:11px;color:#64748b;letter-spacing:.1em;text-transform:uppercase">Registration ID</p>
            <h2 style="color:${TEAL};margin:6px 0 0;font-size:24px;font-weight:800">${d.registration_ref}</h2>
          </div>
          <p style="color:#475569;font-size:14px">Our coordinator will contact your parent within 24 hours.</p>
        </div>
      </div>
    </div>`
}

function giftCardHTML(d: any) {
  return `
    <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#F7F5F2;padding:32px 0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,${YELLOW},#D89F04);padding:36px;text-align:center">
          <h1 style="color:#1a1a1a;margin:0;font-size:24px;font-weight:800">A gift in your honour</h1>
        </div>
        <div style="padding:36px">
          <p style="color:#475569;font-size:15px">Dear ${d.gift_recipient_name},</p>
          <p style="color:#475569;font-size:15px"><strong>${d.donor_name}</strong> has made a donation of <strong style="color:${TEAL}">${fmtINR(d.amount_cents)}</strong> to AGSWS in your honour.</p>
          ${d.gift_message ? `<blockquote style="border-left:3px solid ${TEAL};padding:8px 0 8px 16px;margin:16px 0;color:#1F9AA8;font-style:italic">"${d.gift_message}"</blockquote>` : ''}
          <p style="color:#475569;font-size:14px">Thank you for being part of this kindness.</p>
        </div>
      </div>
    </div>`
}

function adminDonationHTML(d: any) {
  return `<div style="font-family:Arial,sans-serif;padding:24px"><h2>New donation received</h2><p><strong>${d.donor_name || d.registrant_name}</strong> (${d.donor_email || d.registrant_email})</p><p>Cause: ${d.cause || 'goldenage'}</p><p>Amount: ${fmtINR(d.amount_cents)}</p><p>Status: ${d.status}</p></div>`
}

function adminAppHTML(d: any) {
  return `<div style="font-family:Arial,sans-serif;padding:24px"><h2>New ${d.type} application</h2><p><strong>${d.applicant_name}</strong> (${d.email}, ${d.phone})</p><p>Ref: ${d.application_ref}</p></div>`
}

function newsletterHTML(d: any) {
  return `<div style="font-family:-apple-system,Arial,sans-serif;background:#F7F5F2;padding:32px"><div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:36px"><h1 style="color:${TEAL};margin:0 0 12px">Welcome to AGSWS</h1><p style="color:#475569">Thanks for subscribing${d.name ? ', ' + d.name : ''}. You'll receive our impact updates and stories from the field.</p></div></div>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const { type, to, data } = await req.json()
    let html = ''
    let subject = ''
    let recipient = to === 'admin' ? ADMIN_EMAIL : to

    switch (type) {
      case 'donation-receipt':
        subject = `Your AGSWS donation receipt — ${fmtINR(data.amount_cents)}`
        html = donationReceiptHTML(data)
        break
      case 'goldenage-confirmation':
        subject = `Registration Confirmed — ${data.registration_ref}`
        html = goldenageHTML(data)
        break
      case 'gift-card':
        subject = `${data.donor_name} made a gift in your honour`
        html = giftCardHTML(data)
        break
      case 'admin-donation':
        subject = `[AGSWS] New ${data.cause || 'goldenage'} ${fmtINR(data.amount_cents)} from ${data.donor_name || data.registrant_name}`
        html = adminDonationHTML(data)
        break
      case 'admin-application':
        subject = `[AGSWS] New ${data.type} application — ${data.applicant_name}`
        html = adminAppHTML(data)
        break
      case 'newsletter-welcome':
        subject = 'Welcome to AGSWS updates'
        html = newsletterHTML(data)
        break
      default:
        return new Response(JSON.stringify({ error: 'Unknown email type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const resendRes = await fetch(`${RESEND_GATEWAY}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [recipient], subject, html }),
    })

    const result = await resendRes.json()
    if (!resendRes.ok) {
      console.error('[resend]', result)
      return new Response(JSON.stringify({ error: result.message || 'Email send failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ id: result.id, sent: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('[send-email]', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
