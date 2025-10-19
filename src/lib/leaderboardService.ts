import { db, collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, where } from './firebase';
import { onSnapshot } from 'firebase/firestore';

export interface SnakeLeaderboardEntry {
  id: string;
  username: string;
  score: number;
  userId?: string; // User ID for persistence across logins
  timestamp: number;
}

/**
 * Fetch top 10 leaderboard entries from Firestore
 */
export const fetchLeaderboard = async (): Promise<SnakeLeaderboardEntry[]> => {
  if (!db) {
    // Fallback to localStorage if Firebase not initialized
    return getLocalLeaderboard();
  }

  try {
    const leaderboardRef = collection(db, 'snakeLeaderboard');
    const q = query(
      leaderboardRef,
      orderBy('score', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SnakeLeaderboardEntry[];
  } catch (error) {
    console.error('Failed to fetch leaderboard from Firestore:', error);
    // Fallback to localStorage
    return getLocalLeaderboard();
  }
};

/**
 * Submit a score to Firestore
 */
export const submitScore = async (
  username: string,
  score: number,
  userId?: string
): Promise<boolean> => {
  if (!db) {
    // Fallback to localStorage
    return submitLocalScore(username, score, userId);
  }

  try {
    const leaderboardRef = collection(db, 'snakeLeaderboard');
    
    // Check if user already has an entry
    let queryConstraints = [where('username', '==', username)];
    if (userId) {
      // If userId provided, search by userId instead
      queryConstraints = [where('userId', '==', userId)];
    }
    
    const q = query(leaderboardRef, ...queryConstraints);
    const snapshot = await getDocs(q);
    
    // Only update if new score is higher
    if (snapshot.empty) {
      // New entry
      await addDoc(leaderboardRef, {
        username: username.trim(),
        score,
        userId: userId || null,
        timestamp: Date.now()
      });
      return true;
    } else {
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();
      
      if (score > existingData.score) {
        // Update with higher score
        await updateDoc(doc(leaderboardRef, existingDoc.id), {
          score,
          timestamp: Date.now()
        });
        return true;
      }
      return false; // Score not higher, didn't update
    }
  } catch (error) {
    console.error('Failed to submit score to Firestore:', error);
    // Fallback to localStorage
    return submitLocalScore(username, score, userId);
  }
};

/**
 * Listen for real-time leaderboard updates
 */
export const onLeaderboardUpdate = (
  callback: (entries: SnakeLeaderboardEntry[]) => void
): (() => void) | null => {
  if (!db) {
    return null; // Real-time updates not available without Firebase
  }

  try {
    const leaderboardRef = collection(db, 'snakeLeaderboard');
    const q = query(
      leaderboardRef,
      orderBy('score', 'desc'),
      limit(10)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const entries = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as SnakeLeaderboardEntry[];
      callback(entries);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Failed to set up real-time leaderboard updates:', error);
    return null;
  }
};

/**
 * Get leaderboard from localStorage (fallback)
 */
const getLocalLeaderboard = (): SnakeLeaderboardEntry[] => {
  try {
    const localScores = localStorage.getItem('snakeLeaderboard');
    if (!localScores) return [];
    
    const parsed = JSON.parse(localScores);
    
    // Filter to only show highest score per user
    const uniqueScores = parsed.reduce((acc: SnakeLeaderboardEntry[], current: SnakeLeaderboardEntry) => {
      const existing = acc.find(entry => entry.username.toLowerCase() === current.username.toLowerCase());
      if (!existing) {
        acc.push(current);
      } else if (current.score > existing.score) {
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
      return acc;
    }, []);
    
    return uniqueScores.sort((a: SnakeLeaderboardEntry, b: SnakeLeaderboardEntry) => b.score - a.score).slice(0, 10);
  } catch (error) {
    console.error('Failed to get local leaderboard:', error);
    return [];
  }
};

/**
 * Submit score to localStorage (fallback)
 */
const submitLocalScore = (username: string, score: number, userId?: string): boolean => {
  try {
    const localScores = localStorage.getItem('snakeLeaderboard');
    let scores: SnakeLeaderboardEntry[] = localScores ? JSON.parse(localScores) : [];
    
    // Check if user already has a score
    const existingEntry = scores.find(entry => entry.username.toLowerCase() === username.trim().toLowerCase());
    
    // Only update if new score is higher OR user doesn't exist
    if (!existingEntry || score > existingEntry.score) {
      // Remove any existing entries for this user
      scores = scores.filter(entry => entry.username.toLowerCase() !== username.trim().toLowerCase());
      
      // Add new score
      scores.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username: username.trim(),
        score,
        userId: userId || undefined,
        timestamp: Date.now()
      });
      
      // Sort and keep top 50 for storage
      scores.sort((a, b) => b.score - a.score);
      scores = scores.slice(0, 50);
      
      localStorage.setItem('snakeLeaderboard', JSON.stringify(scores));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to submit local score:', error);
    return false;
  }
};
