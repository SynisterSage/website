# Deployment Checklist - Snake Leaderboard

## Issue Summary
The Snake game leaderboard works inconsistently:
- ✅ Works in deployment for some users
- ❌ Doesn't show scores for other users (different devices/accounts)
- ❌ Scores not appearing live for all users

## Root Causes Identified

1. **Firestore Security Rules**: If rules don't allow public read/write, users can't access the leaderboard
2. **Environment Variables**: Firebase config must be set in Vercel (not just local .env)
3. **Real-time Listeners**: May fail silently without proper error handling

## Fixes Applied

### 1. Enhanced Logging ✅
- Added detailed console logging to track Firebase initialization
- Added logs for leaderboard fetch/submit operations
- Added logs for real-time listener setup

### 2. Better Error Handling ✅
- Improved fallback to localStorage when Firebase fails
- Added error callbacks to real-time listeners
- More descriptive error messages

### 3. Security Rules Documentation ✅
- Created `FIRESTORE_RULES.md` with complete Firestore rules
- Rules allow public read/write for leaderboard collection

## Required Actions

### Action 1: Update Firestore Security Rules 🔴 CRITICAL

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `website-portfolio-72419`
3. Go to **Firestore Database** → **Rules**
4. Copy rules from `FIRESTORE_RULES.md`
5. Click **Publish**

**Current rules might look like:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ❌ This blocks everyone!
    }
  }
}
```

**Must be updated to allow leaderboard access** (see FIRESTORE_RULES.md)

### Action 2: Verify Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these variables are set for **Production**, **Preview**, and **Development**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

**Values from your .env file:**
```
VITE_FIREBASE_API_KEY=AIzaSyCXeTH_iTmBkdXfEHsGv5kpFrGGHxLjBhM
VITE_FIREBASE_AUTH_DOMAIN=website-portfolio-72419.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=website-portfolio-72419
VITE_FIREBASE_STORAGE_BUCKET=website-portfolio-72419.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=55171404175
VITE_FIREBASE_APP_ID=1:55171404175:web:0bed5bf90550f0ef79bbfa
```

5. After adding/updating variables, **redeploy** the site

### Action 3: Deploy and Test

1. **Deploy the changes:**
   ```bash
   git add .
   git commit -m "Fix: Improve Firebase leaderboard with better error handling and logging"
   git push
   ```

2. **Test in production:**
   - Open the deployed site
   - Open browser console (F12)
   - Look for Firebase initialization messages:
     - `[Firebase] Successfully initialized` ✅
     - `[Firebase] Missing required configuration` ❌
   - Play the snake game and submit a score
   - Check console for leaderboard messages
   - Open site on different device/account
   - Verify both users can see each other's scores

### Action 4: Monitor Console Logs

After deployment, check browser console for these messages:

**Good Signs:**
```
[Firebase] Successfully initialized
[Leaderboard] Fetched X entries from Firestore
[Leaderboard] Real-time listener active
[Leaderboard] Real-time update: X entries
```

**Bad Signs:**
```
[Firebase] Missing required configuration
[Leaderboard] Firebase not initialized, using localStorage
[Leaderboard] Failed to fetch from Firestore: [permission-denied]
```

## Testing Checklist

- [ ] Firestore rules updated
- [ ] Vercel environment variables set
- [ ] Site redeployed after env var changes
- [ ] Tested on desktop in normal mode
- [ ] Tested on desktop in incognito/private mode
- [ ] Tested on mobile device
- [ ] Tested with different accounts
- [ ] Verified real-time updates work (score appears immediately for other users)
- [ ] Checked browser console for errors

## Troubleshooting

### Issue: "Permission Denied" errors
**Solution:** Update Firestore security rules (Action 1)

### Issue: Firebase not initialized
**Solution:** Check Vercel environment variables (Action 2)

### Issue: Scores only visible on one device
**Solution:** Both issues above - Firebase must be working and rules must allow access

### Issue: Scores don't update live
**Solution:** Real-time listeners require proper Firebase initialization and security rules

## Success Criteria

✅ Multiple users can submit scores  
✅ All users see the same leaderboard  
✅ Scores update in real-time  
✅ Works on desktop and mobile  
✅ Works for logged-in and anonymous users  
✅ Console shows successful Firebase initialization  
✅ No permission-denied errors in console
