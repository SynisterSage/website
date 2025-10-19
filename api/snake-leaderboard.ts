import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  checkRateLimit, 
  getClientIdentifier, 
  sanitizeString,
  setSecurityHeaders,
  setCorsHeaders 
} from './_security';

interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: number;
  id: string;
}

// In-memory leaderboard (will reset on serverless function cold start)
// For production, you'd want to use a database like Supabase, Firebase, or Vercel KV
let leaderboard: LeaderboardEntry[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set security headers
  setSecurityHeaders(res);
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Rate limiting
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { 
    windowMs: 60000, 
    max: req.method === 'GET' ? 30 : 10 // More lenient for GET, stricter for POST
  });
  
  res.setHeader('X-RateLimit-Limit', req.method === 'GET' ? '30' : '10');
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter?.toString() || '60');
    return res.status(429).json({ 
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter 
    });
  }

  if (req.method === 'GET') {
    // Return top 10 scores
    const topScores = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    return res.status(200).json({ leaderboard: topScores });
  }

  if (req.method === 'POST') {
    const { username, score } = req.body;

    // Validate and sanitize input
    const sanitizedUsername = sanitizeString(username, 20);
    
    if (!sanitizedUsername || sanitizedUsername.length < 1) {
      return res.status(400).json({ error: 'Invalid username. Must be 1-20 characters.' });
    }

    if (typeof score !== 'number' || score < 0 || score > 100000 || !Number.isInteger(score)) {
      return res.status(400).json({ error: 'Invalid score. Must be an integer between 0 and 100000.' });
    }

    // Check if user already has a score
    const existingEntry = leaderboard.find(
      entry => entry.username.toLowerCase() === sanitizedUsername.toLowerCase()
    );

    // Only update if new score is higher OR user doesn't exist
    if (!existingEntry || score > existingEntry.score) {
      // Remove any existing entries for this user
      leaderboard = leaderboard.filter(
        entry => entry.username.toLowerCase() !== sanitizedUsername.toLowerCase()
      );

      // Create new entry
      const entry: LeaderboardEntry = {
        username: sanitizedUsername,
        score,
        timestamp: Date.now(),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Add to leaderboard
      leaderboard.push(entry);

      // Keep only top 50 entries to prevent memory issues
      leaderboard = leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);
    }

    // Return updated top 10
    const topScores = leaderboard.slice(0, 10);
    
    return res.status(200).json({ 
      success: true, 
      leaderboard: topScores,
      updated: !existingEntry || score > existingEntry.score
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
