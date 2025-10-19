import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

    // Validate input
    if (!username || typeof username !== 'string' || username.length < 1 || username.length > 20) {
      return res.status(400).json({ error: 'Invalid username. Must be 1-20 characters.' });
    }

    if (typeof score !== 'number' || score < 0 || score > 100000) {
      return res.status(400).json({ error: 'Invalid score.' });
    }

    // Check if user already has a score
    const existingEntry = leaderboard.find(
      entry => entry.username.toLowerCase() === username.trim().toLowerCase()
    );

    // Only update if new score is higher OR user doesn't exist
    if (!existingEntry || score > existingEntry.score) {
      // Remove any existing entries for this user
      leaderboard = leaderboard.filter(
        entry => entry.username.toLowerCase() !== username.trim().toLowerCase()
      );

      // Create new entry
      const entry: LeaderboardEntry = {
        username: username.trim(),
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
