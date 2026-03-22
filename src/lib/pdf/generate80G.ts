import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
 
interface ReceiptData {
  donorName: string
  donorEmail: string
  panNumber?: string
  amount: number
  paymentId: string
  gateway: 'medical' | 'education'
  date: string
}
 
export async function generate80GPDF(
  data: ReceiptData
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()
 
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontReg  = await doc.embedFont(StandardFonts.Helvetica)
 
  const teal = rgb(0.12, 0.60, 0.66)
  const dark = rgb(0.16, 0.11, 0.18)
  const mid  = rgb(0.33, 0.45, 0.45)
 
  // Header band
  page.drawRectangle({
    x: 0, y: height - 80, width, height: 80,
    color: teal,
  })
 
  page.drawText('AGSWS', {
    x: 40, y: height - 52,
    size: 28, font: fontBold, color: rgb(1,1,1),
  })
 
  page.drawText('SOCIAL WELFARE SOCIETY', {
    x: 40, y: height - 70,
    size: 9, font: fontReg, color: rgb(1,1,1,0.8),
  })
 
  page.drawText('80G DONATION RECEIPT', {
    x: width - 200, y: height - 52,
    size: 12, font: fontBold, color: rgb(1,1,1),
  })
 
  // Receipt title
  page.drawText('Official Donation Receipt', {
    x: 40, y: height - 120,
    size: 18, font: fontBold, color: teal,
  })
 
  // Amount box
  page.drawRectangle({
    x: 40, y: height - 220, width: 240, height: 80,
    color: rgb(0.90, 0.97, 0.97),
    borderColor: teal, borderWidth: 1,
  })
 
  page.drawText('Amount Donated', {
    x: 52, y: height - 152,
    size: 9, font: fontBold, color: mid,
  })
 
  page.drawText(
    '₹' + data.amount.toLocaleString('en-IN'),
    { x: 52, y: height - 178, size: 28, font: fontBold, color: teal }
  )
 
  // Tax saving box
  const taxSaving = Math.round(data.amount * 0.5 * 0.30)
  page.drawRectangle({
    x: 300, y: height - 220, width: 240, height: 80,
    color: rgb(0.94, 0.99, 0.95),
    borderColor: rgb(0.09, 0.64, 0.29), borderWidth: 1,
  })
  page.drawText('Est. Tax Saving (80G, 30%)', {
    x: 312, y: height - 152,
    size: 9, font: fontBold, color: mid,
  })
  page.drawText(
    '~₹' + taxSaving.toLocaleString('en-IN'),
    { x: 312, y: height - 178,
      size: 22, font: fontBold, color: rgb(0.09, 0.64, 0.29) }
  )
 
  // Details table
  const rows = [
    ['Payment ID',    data.paymentId],
    ['Date',          data.date],
    ['Cause',         data.gateway === 'medical'
      ? 'Medical Aid & Hospital Support'
      : 'Education Support for Children'],
    ['Donor Name',    data.donorName],
    ['Donor Email',   data.donorEmail],
    ['PAN Number',    data.panNumber ?? 'Not provided'],
    ['80G Reg No.',   '[80G-CERTIFICATE-NUMBER]'],
    ['NGO Reg No.',   '[NGO-REGISTRATION-NUMBER]'],
    ['12A Cert No.',  '[12A-CERTIFICATE-NUMBER]'],
  ]
 
  let y = height - 270
  page.drawText('RECEIPT DETAILS', {
    x: 40, y, size: 10, font: fontBold, color: teal,
  })
  y -= 20
 
  for (const [label, value] of rows) {
    page.drawLine({
      start: { x: 40, y }, end: { x: width - 40, y },
      thickness: 0.5, color: rgb(0.88, 0.88, 0.88),
    })
    page.drawText(label + ':', {
      x: 40, y: y - 14, size: 9, font: fontBold, color: mid,
    })
    page.drawText(value, {
      x: 200, y: y - 14, size: 9, font: fontReg, color: dark,
    })
    y -= 26
  }
 
  // 80G notice box
  page.drawRectangle({
    x: 40, y: y - 60, width: width - 80, height: 55,
    color: rgb(0.94, 0.99, 0.95),
    borderColor: rgb(0.09, 0.64, 0.29), borderWidth: 1,
  })
  page.drawText(
    '80G TAX BENEFIT: This donation qualifies for 50% deduction',
    { x: 52, y: y - 28, size: 9, font: fontBold,
      color: rgb(0.09, 0.45, 0.20) }
  )
  page.drawText(
    'under Section 80G of the Income Tax Act, 1961.',
    { x: 52, y: y - 42, size: 9, font: fontReg,
      color: rgb(0.09, 0.45, 0.20) }
  )
 
  // Footer
  page.drawRectangle({
    x: 0, y: 0, width, height: 60, color: rgb(0.95, 0.97, 0.97),
  })
  page.drawText(
    'The Ascension Group — Social Welfare Society | Kolkata, WB',
    { x: 40, y: 38, size: 8, font: fontReg, color: mid }
  )
  page.drawText(
    'This is a computer-generated receipt and does not require a signature.',
    { x: 40, y: 22, size: 8, font: fontReg, color: mid }
  )
 
  return doc.save()
}
