import { Resend } from 'resend'
import { render } from '@react-email/render'
import { generate80GPDF } from '../pdf/generate80G'
 
const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM_RECEIPTS = 'AGSWS Receipts <receipts@YOURDOMAIN.org>'
const FROM_NOREPLY  = 'AGSWS <noreply@YOURDOMAIN.org>'
const FROM_REGISTER = 'AGSWS Registration <register@YOURDOMAIN.org>'
 
// Replace YOURDOMAIN.org with your actual domain after DNS setup
 
// ── Donation receipt with 80G PDF ──────────────────────────────
export async function sendDonationReceipt(payload: {
  gateway: 'medical' | 'education'
  donorName: string
  donorEmail: string
  amount: number
  paymentId: string
  panNumber?: string
}) {
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
 
  const pdfBuffer = await generate80GPDF({
    ...payload, date,
  })
 
  const subject = payload.gateway === 'medical'
    ? 'Your AGSWS Medical Aid Donation Receipt — ₹' +
      payload.amount.toLocaleString('en-IN')
    : 'Your AGSWS Education Donation Receipt — ₹' +
      payload.amount.toLocaleString('en-IN')
 
  await resend.emails.send({
    from: FROM_RECEIPTS,
    to: payload.donorEmail,
    subject,
    html: buildReceiptHTML(payload),
    attachments: [{
      filename: 'AGSWS-80G-Receipt-' + payload.paymentId + '.pdf',
      content: Buffer.from(pdfBuffer).toString('base64'),
    }],
  })
}
 
// ── Gift honour card ───────────────────────────────────────────
export async function sendGiftHonourCard(payload: {
  recipientName: string
  recipientEmail: string
  donorName: string
  amount: number
  gateway: string
  message?: string
}) {
  await resend.emails.send({
    from: FROM_NOREPLY,
    to: payload.recipientEmail,
    subject: 'A gift has been made in your honour by ' +
      payload.donorName,
    html: buildGiftCardHTML(payload),
  })
}
 
// ── Parent registration confirmation ──────────────────────────
export async function sendRegistrationConfirm(payload: {
  registrantName: string
  registrantEmail: string
  parentName: string
  registrationId: string
  paymentId: string
}) {
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
  await resend.emails.send({
    from: FROM_REGISTER,
    to: payload.registrantEmail,
    subject: 'Registration Confirmed — ' + payload.registrationId +
      ' | AGSWS Parent Care',
    html: buildRegistrationHTML({ ...payload, date }),
  })
}
 
// ── Admin notification (new CSR enquiry, support application) ──
export async function sendAdminNotification(payload: {
  type: string
  details: string
}) {
  await resend.emails.send({
    from: FROM_NOREPLY,
    to: process.env.ADMIN_EMAIL!,
    subject: '[AGSWS Admin] New ' + payload.type,
    html: '<p>' + payload.details + '</p>',
  })
}
 
// ── Simple HTML builders (replace with React Email templates) ──
function buildReceiptHTML(p: any): string {
  return '<div style=font-family:Arial,sans-serif>' +
    '<div style=background:#1F9AA8;padding:24px>' +
    '<h2 style=color:#fff;margin:0>AGSWS — Donation Receipt</h2>' +
    '</div>' +
    '<div style=padding:24px>' +
    '<h3>Thank you, ' + p.donorName + '!</h3>' +
    '<p><strong>Amount:</strong> ₹' +
    p.amount.toLocaleString('en-IN') + '</p>' +
    '<p><strong>Payment ID:</strong> ' + p.paymentId + '</p>' +
    '<p><strong>Cause:</strong> ' + p.gateway + '</p>' +
    '<p>Your 80G receipt PDF is attached to this email.</p>' +
    '</div></div>'
}
 
function buildGiftCardHTML(p: any): string {
  return '<div style=font-family:Arial,sans-serif;padding:32px>' +
    '<div style=background:#1F9AA8;padding:24px;text-align:center>' +
    '<h2 style=color:#fff>A Gift Has Been Made in Your Honour</h2>' +
    '</div>' +
    '<div style=padding:24px>' +
    '<p>Dear ' + p.recipientName + ',</p>' +
    '<p>' + p.donorName + ' has made a donation of ₹' +
    p.amount.toLocaleString('en-IN') +
    ' to AGSWS in your honour.</p>' +
    (p.message ? '<p><em>"' + p.message + '"</em></p>' : '') +
    '</div></div>'
}
 
function buildRegistrationHTML(p: any): string {
  return '<div style=font-family:Arial,sans-serif>' +
    '<div style=background:#1F9AA8;padding:24px>' +
    '<h2 style=color:#fff>Registration Confirmed</h2>' +
    '</div>' +
    '<div style=padding:24px>' +
    '<h3>Dear ' + p.registrantName + ',</h3>' +
    '<p>' + p.parentName +
    ' has been registered for AGSWS Parent Care.</p>' +
    '<div style=background:#E6F4F6;padding:16px;' +
    'border-radius:8px;text-align:center>' +
    '<p style=margin:0;font-size:12px;color:#555>' +
    'Registration ID</p>' +
    '<h2 style=color:#1F9AA8;margin:4px 0>' +
    p.registrationId + '</h2>' +
    '</div>' +
    '<p>Our coordinator will contact your parent within 24 hours.</p>' +
    '<p>Emergency helpline: ' +
    (process.env.EMERGENCY_PHONE ?? '[PHONE]') + '</p>' +
    '</div></div>'
}
