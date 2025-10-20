import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, where, writeBatch, getDoc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

// Your Firebase config - Replace with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

// Log Firebase config status (without exposing full keys)
console.log('[Firebase] Initializing with config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  hasDomain: !!firebaseConfig.authDomain,
});

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('[Firebase] Successfully initialized');
  } else {
    console.warn('[Firebase] Missing required configuration. Leaderboard will use localStorage fallback.');
  }
} catch (error) {
  console.error('[Firebase] Failed to initialize:', error);
  console.warn('[Firebase] Leaderboard will use localStorage fallback.');
}

export { db, auth, app };
export { collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, where, writeBatch, getDoc, setDoc, increment, onSnapshot };
