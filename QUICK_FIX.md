# 🚀 Quick Fix Guide - Snake Leaderboard Not Showing for All Users

## The Problem
The snake leaderboard works for some users but not others. Scores don't appear in real-time across different devices.

## The Solution (3 Steps)

### Step 1: Update Firestore Security Rules ⚡ MOST IMPORTANT

Your Firestore database likely has rules that block public access. This prevents users from seeing each other's scores.

**What to do:**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: `website-portfolio-72419`
3. Go to **Firestore Database** → **Rules** tab
4. Replace ALL existing rules with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Snake Game Leaderboard - Allow public access
    match /snakeLeaderboard/{document=**} {
      allow read: if true;
      allow create: if request.resource.data.username is string
                    && request.resource.data.username.size() > 0
                    && request.resource.data.username.size() <= 20
                    && request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.timestamp is number;
      allow update: if request.resource.data.score > resource.data.score;
      allow delete: if false;
    }
    
    // Block access to everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** button
6. Wait for "Rules published successfully" message

### Step 2: Set Environment Variables in Vercel

Your Firebase config needs to be available in production.

**What to do:**
1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your website project
3. Go to **Settings** → **Environment Variables**
4. Add these 6 variables for **Production**, **Preview**, AND **Development**:

| Variable Name | Value |
|--------------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCXeTH_iTmBkdXfEHsGv5kpFrGGHxLjBhM` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `website-portfolio-72419.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `website-portfolio-72419` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `website-portfolio-72419.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `55171404175` |
| `VITE_FIREBASE_APP_ID` | `1:55171404175:web:0bed5bf90550f0ef79bbfa` |

5. After adding all variables, go to **Deployments** tab
6. Click on the latest deployment → **⋯** menu → **Redeploy**

### Step 3: Deploy Code Changes

I've added better error handling and logging. Deploy these changes:

```bash
git add .
git commit -m "Fix: Snake leaderboard Firebase integration with logging"
git push
```

## Testing

After completing all 3 steps:

1. **Open your website** in a normal browser tab
2. **Press F12** to open the console
3. **Look for:** `[Firebase] Successfully initialized` ✅
4. **Play the snake game** and submit a score
5. **Open the website on your phone** (different device)
6. **Play again** and submit a different score
7. **Check both devices** - you should see both scores!

## What to Look For in Console

### ✅ Good (Working):
```
[Firebase] Successfully initialized
[Leaderboard] Fetched 5 entries from Firestore
[Leaderboard] Real-time listener active
```

### ❌ Bad (Not Working):
```
[Firebase] Missing required configuration
[Leaderboard] Firebase not initialized, using localStorage
[Leaderboard] Failed to fetch from Firestore: [permission-denied]
```

If you see the bad messages:
- **"Missing required configuration"** → Check Step 2 (Vercel env vars)
- **"permission-denied"** → Check Step 1 (Firestore rules)

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Scores only on my device | Check Firestore rules (Step 1) |
| Firebase not initialized | Check Vercel env vars (Step 2) |
| Scores don't update live | Both Step 1 and Step 2 must be done |
| Still not working | Check browser console for specific error messages |

## Need More Help?

See the detailed guides:
- `DEPLOYMENT_CHECKLIST.md` - Complete deployment guide
- `FIRESTORE_RULES.md` - Detailed security rules explanation

---

**Estimated Time:** 5-10 minutes  
**Difficulty:** Easy (mostly copy/paste)
