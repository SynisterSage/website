import type { VercelRequest, VercelResponse } from '@vercel/node'

// Serverless endpoint to forward contact form to SendGrid.
// Requires environment variable SENDGRID_API_KEY and optionally FROM_EMAIL.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { name, email, message, website, timeline, budget } = req.body || {}

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  const TO_EMAIL = process.env.TO_EMAIL || 'afergyy@gmail.com'
  const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@' + (process.env.VERCEL_URL || 'example.com')

  if (!SENDGRID_API_KEY) {
    res.status(500).json({ error: 'SendGrid API key not configured (SENDGRID_API_KEY).' })
    return
  }

  const subject = `Website inquiry from ${name}`
  const fullBody = [`Name: ${name}`, `Email: ${email}`]
  if (website) fullBody.push(`Website: ${website}`)
  if (timeline) fullBody.push(`Timeline: ${timeline}`)
  if (budget) fullBody.push(`Budget: ${budget}`)
  fullBody.push('', 'Message:', message)

  const payload = {
    personalizations: [
      {
        to: [{ email: TO_EMAIL }],
        subject,
      },
    ],
    from: { email: FROM_EMAIL },
    content: [
      {
        type: 'text/plain',
        value: fullBody.join('\n'),
      },
    ],
  }

  try {
    const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (r.ok) {
      res.status(200).json({ ok: true })
    } else {
      const text = await r.text()
      res.status(502).json({ error: 'SendGrid error', detail: text })
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Unexpected error', detail: String(err) })
  }
}
