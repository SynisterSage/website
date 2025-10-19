import type { VercelRequest, VercelResponse } from '@vercel/node'
import { 
  checkRateLimit, 
  getClientIdentifier, 
  sanitizeEmail, 
  sanitizeString, 
  sanitizeUrl,
  setSecurityHeaders,
  setCorsHeaders 
} from './_security'

// Serverless endpoint to forward contact form to SendGrid using the Web API via fetch.
// Requires environment variable SENDGRID_API_KEY and optionally FROM_EMAIL and TO_EMAIL.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set security headers
  setSecurityHeaders(res);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Set CORS headers for actual request
  setCorsHeaders(res);

  // Rate limiting - 3 emails per minute per IP
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { windowMs: 60000, max: 3 });
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', '3');
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
  
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter?.toString() || '60');
    res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: rateLimit.retryAfter 
    });
    return;
  }

  const { name, email, message, website, timeline, budget } = req.body || {}

  // Validate and sanitize inputs
  const sanitizedName = sanitizeString(name, 100);
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedMessage = sanitizeString(message, 5000);
  const sanitizedWebsite = website ? sanitizeUrl(website) : null;
  const sanitizedTimeline = timeline ? sanitizeString(timeline, 100) : null;
  const sanitizedBudget = budget ? sanitizeString(budget, 100) : null;

  if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
    res.status(400).json({ error: 'Invalid or missing required fields: name, email, message' })
    return
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  const TO_EMAIL = process.env.TO_EMAIL || 'afergyy@gmail.com'
  const FROM_EMAIL = process.env.FROM_EMAIL || `no-reply@${process.env.VERCEL_URL || 'example.com'}`

  if (!SENDGRID_API_KEY) {
    res.status(500).json({ error: 'SendGrid API key not configured (SENDGRID_API_KEY).' })
    return
  }

  const subject = `Website inquiry from ${sanitizedName}`
  const fullBody = [`Name: ${sanitizedName}`, `Email: ${sanitizedEmail}`]
  if (sanitizedWebsite) fullBody.push(`Website: ${sanitizedWebsite}`)
  if (sanitizedTimeline) fullBody.push(`Timeline: ${sanitizedTimeline}`)
  if (sanitizedBudget) fullBody.push(`Budget: ${sanitizedBudget}`)
  fullBody.push('', 'Message:', sanitizedMessage)
  fullBody.push('', `Sent from IP: ${clientId}`)
  fullBody.push(`Timestamp: ${new Date().toISOString()}`)

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
      // Pass SendGrid response body through for debugging
      res.status(502).json({ error: 'SendGrid error', detail: text })
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Unexpected error', detail: String(err) })
  }
}
