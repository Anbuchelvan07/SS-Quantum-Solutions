/**
 * HTTP-based email service using Resend API
 * Works over HTTPS (port 443) — no SMTP required
 * Free tier: 3,000 emails/month
 *
 * Setup: sign up at https://resend.com, get your API key,
 * and set RESEND_API_KEY in .env
 */

/**
 * Send appointment notification to admin via Resend HTTP API
 */
export async function sendAppointmentEmail({ name, email, date, time, notes }) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL

  if (!apiKey) {
    console.warn('⚠️  RESEND_API_KEY not set — skipping email notification')
    return null
  }

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#0284c7;padding:20px 24px">
        <h2 style="color:#fff;margin:0;font-size:18px">📅 New Consultation Scheduled</h2>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#64748b;width:110px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Date</td><td style="padding:8px 0;font-weight:600">${date}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Time</td><td style="padding:8px 0;font-weight:600">${time}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Notes</td><td style="padding:8px 0">${notes || 'No additional notes provided.'}</td></tr>
        </table>
      </div>
      <div style="background:#f8fafc;padding:14px 24px;font-size:12px;color:#94a3b8;text-align:center">
        This email was sent automatically by the HR Consultancy booking system.
      </div>
    </div>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'HR Consultancy <onboarding@resend.dev>',
      to: [adminEmail],
      reply_to: email,
      subject: `New Consultation Booking — ${name}`,
      html: htmlBody,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || `Resend API error: ${response.status}`)
  }

  console.log('✅ Email sent via Resend:', result.id)
  return result
}

/**
 * Send contact form submission to admin via Resend HTTP API
 */
export async function sendContactFormEmail({ name, email, organization, topic, message }) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL

  if (!apiKey) {
    console.warn('⚠️  RESEND_API_KEY not set — skipping email notification')
    return null
  }

  const topicLabels = {
    'feedback-consultation': 'Feedback about consultancy session',
    'enquiry-blockchain': 'Enquiry about blockchain',
    'other': 'Other',
  }

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#0284c7;padding:20px 24px">
        <h2 style="color:#fff;margin:0;font-size:18px">📧 New Contact Form Submission</h2>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#64748b;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Organization</td><td style="padding:8px 0">${organization}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Topic</td><td style="padding:8px 0">${topicLabels[topic] || topic}</td></tr>
        </table>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e2e8f0">
          <p style="color:#64748b;margin:0 0 8px 0;font-size:12px;font-weight:600">MESSAGE:</p>
          <p style="margin:0;color:#334155;line-height:1.6;white-space:pre-wrap">${message}</p>
        </div>
      </div>
      <div style="background:#f8fafc;padding:14px 24px;font-size:12px;color:#94a3b8;text-align:center">
        This email was sent automatically by the HR Consultancy contact form.
      </div>
    </div>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'HR Consultancy <onboarding@resend.dev>',
      to: [adminEmail],
      reply_to: email,
      subject: `Contact Form — ${topic === 'other' ? 'General Inquiry' : topicLabels[topic] || topic} from ${name}`,
      html: htmlBody,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || `Resend API error: ${response.status}`)
  }

  console.log('✅ Contact form email sent via Resend:', result.id)
  return result
}
