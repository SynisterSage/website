import { db, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from './firebase';
import type { Unsubscribe, DocumentSnapshot } from 'firebase/firestore';

export interface ProjectLikes {
  projectId: string;
  count: number;
  updatedAt: number;
}

const LIKES_COLLECTION = 'projectLikes';
const LOCAL_STORAGE_KEY = 'portfolio_liked_projects';

/**
 * Get liked projects from localStorage
 */
export const getLikedProjects = (): Set<string> => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('[Likes] Error reading from localStorage:', error);
  }
  return new Set();
};

/**
 * Save liked projects to localStorage
 */
const saveLikedProjects = (likedProjects: Set<string>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...likedProjects]));
  } catch (error) {
    console.error('[Likes] Error saving to localStorage:', error);
  }
};

/**
 * Check if user has liked a project
 */
export const hasLikedProject = (projectId: string): boolean => {
  const liked = getLikedProjects();
  return liked.has(projectId);
};

/**
 * Get project like count from Firestore
 */
export const getProjectLikes = async (projectId: string): Promise<number> => {
  if (!db) {
    console.warn('[Likes] Firebase not initialized');
    return 0;
  }

  try {
    const docRef = doc(db, LIKES_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as ProjectLikes;
      return data.count || 0;
    }
    return 0;
  } catch (error) {
    console.error('[Likes] Error fetching likes:', error);
    return 0;
  }
};

/**
 * Subscribe to real-time like count updates
 */
export const subscribeToProjectLikes = (
  projectId: string,
  onUpdate: (count: number) => void
): Unsubscribe | null => {
  if (!db) {
    console.warn('[Likes] Firebase not initialized');
    return null;
  }

  try {
    const docRef = doc(db, LIKES_COLLECTION, projectId);
    return onSnapshot(docRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ProjectLikes;
        onUpdate(data.count || 0);
      } else {
        onUpdate(0);
      }
    }, (error: Error) => {
      console.error('[Likes] Error in snapshot listener:', error);
    });
  } catch (error) {
    console.error('[Likes] Error subscribing to likes:', error);
    return null;
  }
};

/**
 * Toggle like for a project
 */
export const toggleProjectLike = async (projectId: string): Promise<{ liked: boolean; count: number }> => {
  const likedProjects = getLikedProjects();
  const currentlyLiked = likedProjects.has(projectId);
  
  // Optimistically update localStorage
  if (currentlyLiked) {
    likedProjects.delete(projectId);
  } else {
    likedProjects.add(projectId);
  }
  saveLikedProjects(likedProjects);

  if (!db) {
    console.warn('[Likes] Firebase not initialized, using localStorage only');
    return { liked: !currentlyLiked, count: 0 };
  }

  try {
    const docRef = doc(db, LIKES_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document exists, increment or decrement
      await updateDoc(docRef, {
        count: increment(currentlyLiked ? -1 : 1),
        updatedAt: Date.now()
      });
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data() as ProjectLikes;
      return { liked: !currentlyLiked, count: data.count || 0 };
    } else {
      // Document doesn't exist, create it
      const initialData: ProjectLikes = {
        projectId,
        count: 1,
        updatedAt: Date.now()
      };
      await setDoc(docRef, initialData);
      return { liked: true, count: 1 };
    }
  } catch (error) {
    console.error('[Likes] Error toggling like:', error);
    
    // Revert localStorage on error
    if (currentlyLiked) {
      likedProjects.add(projectId);
    } else {
      likedProjects.delete(projectId);
    }
    saveLikedProjects(likedProjects);
    
    throw error;
  }
};

/**
 * Get all project likes (for analytics/admin)
 */
export const getAllProjectLikes = async (): Promise<ProjectLikes[]> => {
  if (!db) {
    console.warn('[Likes] Firebase not initialized');
    return [];
  }

  try {
    const { getDocs, query: firestoreQuery, collection: firestoreCollection, orderBy } = await import('./firebase');
    const q = firestoreQuery(firestoreCollection(db, LIKES_COLLECTION), orderBy('count', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data() as ProjectLikes);
  } catch (error) {
    console.error('[Likes] Error fetching all likes:', error);
    return [];
  }
};
