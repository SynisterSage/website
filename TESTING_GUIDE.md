# 🔍 Testing the Leaderboard Fix

## Quick Test Steps

### Test 1: Open the Test Page (Fastest)

1. Open `test-firebase.html` in your browser
2. It will automatically test Firebase connection
3. Look for:
   - ✅ **Green "Firebase Connected"** = Working!
   - ❌ **Red error** = Check the issue below

### Test 2: Test in Your App

1. **Open localhost** (http://localhost:5174)
2. **Open Browser Console** (F12 → Console tab)
3. **Play the snake game** (press S or click the snake icon)
4. Look for these console messages:

#### ✅ GOOD - Firebase is working:
```
[Firebase] Successfully initialized
[SnakeGame] Firebase available: true
[SnakeGame] Firebase is available - clearing localStorage to prevent conflicts
[Leaderboard] Fetched X entries from Firestore
[Leaderboard] Real-time listener active - leaderboard will update automatically
```

#### ❌ BAD - Firebase is NOT working:
```
[Firebase] Missing required configuration
[SnakeGame] Firebase available: false
[SnakeGame] Firebase NOT available - leaderboard will be local only
[Leaderboard] Using localStorage - scores will NOT sync across devices!
```

### Test 3: Multi-Device Test

Once Firebase shows as working:

1. **Device 1 (Computer):**
   - Open http://localhost:5174
   - Play snake, submit score
   - Note the score

2. **Device 2 (Phone on same network):**
   - Find your computer's IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
   - Open `http://YOUR-IP:5174` on phone
   - Check if you see Device 1's score
   - Submit a different score

3. **Both devices:**
   - Should see BOTH scores
   - Should update in real-time (within 1-2 seconds)

### Test 4: Clear Old Data

If you see different leaderboards on different devices, old localStorage data is cached:

**Option 1: Use the test page**
- Open `test-firebase.html`
- Click "Clear localStorage" button

**Option 2: Browser Console**
```javascript
localStorage.removeItem('snakeLeaderboard')
```

**Option 3: Clear all site data**
- Chrome: Settings → Privacy → Clear browsing data → Cached images and files
- Firefox: Settings → Privacy → Clear Data
- Safari: Develop → Empty Caches

Then refresh and test again!

## Common Issues & Solutions

### Issue: "Permission Denied" in console
**Cause:** Firestore security rules not updated  
**Fix:** Go to Firebase Console → Firestore Database → Rules → Paste rules from FIRESTORE_RULES.md

### Issue: "Firebase not initialized" 
**Cause:** Environment variables missing  
**Fix:** Check Vercel dashboard → Settings → Environment Variables

### Issue: Different scores on different devices
**Cause:** Old localStorage data cached  
**Fix:** Clear localStorage (see Test 4 above)

### Issue: Scores don't update in real-time
**Cause:** Real-time listener not active  
**Fix:** Check console for "Real-time listener active" message. If missing, check Firebase rules.

## Expected Console Flow

When everything works correctly, you should see this flow:

```
1. [Firebase] Initializing with config: {...}
2. [Firebase] Successfully initialized
3. [SnakeGame] Component mounted
4. [SnakeGame] Firebase available: true
5. [SnakeGame] Firebase is available - clearing localStorage to prevent conflicts
6. [Leaderboard] Cleared local leaderboard data
7. [Leaderboard] Fetching leaderboard...
8. [Leaderboard] Fetched 3 entries from Firestore
9. [SnakeGame] Fetched 3 entries
10. [Leaderboard] Setting up real-time listener
11. [SnakeGame] Real-time listener active - leaderboard will update automatically
12. [Leaderboard] Real-time update: 3 entries
13. [SnakeGame] Received real-time update with 3 entries
```

When someone submits a score:
```
14. [SnakeGame] Submitting score: PlayerName 150
15. [Leaderboard] Adding new entry for PlayerName with score 150
16. [Leaderboard] Real-time update: 4 entries  ← This happens automatically!
17. [SnakeGame] Received real-time update with 4 entries
```

## Verification Checklist

Before deploying, verify:

- [ ] `test-firebase.html` shows green "Firebase Connected"
- [ ] Console shows "[Firebase] Successfully initialized"
- [ ] Console shows "Firebase available: true"
- [ ] Console shows "clearing localStorage to prevent conflicts"
- [ ] Console shows "Real-time listener active"
- [ ] NO warnings about "Using localStorage"
- [ ] Leaderboard shows entries from Firestore
- [ ] Same leaderboard on different browser tabs
- [ ] Scores update automatically when you submit a new one

If ALL checkboxes are ✅, you're ready to deploy!
