# Firestore Security Rules

To ensure the Snake Game leaderboard works correctly for all users, you need to set up the following security rules in your Firebase Console.

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `website-portfolio-72419`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the rules below
5. Click **Publish**

## Required Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Snake Game Leaderboard Rules
    match /snakeLeaderboard/{document=**} {
      // Allow anyone to read the leaderboard
      allow read: if true;
      
      // Allow anyone to create new entries
      allow create: if request.resource.data.username is string
                    && request.resource.data.username.size() > 0
                    && request.resource.data.username.size() <= 20
                    && request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.score <= 100000
                    && request.resource.data.timestamp is number;
      
      // Allow updates only if score is increasing
      allow update: if request.resource.data.score > resource.data.score
                    && request.resource.data.username == resource.data.username;
      
      // Prevent deletion (leaderboard entries should persist)
      allow delete: if false;
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## What These Rules Do

1. **Read Access**: Anyone can view the leaderboard (required for all users to see scores)
2. **Create Access**: Anyone can submit a score with validation:
   - Username must be 1-20 characters
   - Score must be between 0 and 100,000
   - Timestamp must be provided
3. **Update Access**: Only allows updates if the new score is higher than the existing score
4. **Delete Access**: Prevents deletion of leaderboard entries
5. **Default Deny**: All other collections are protected

## Testing

After updating the rules, test the leaderboard:

1. Open the website in an incognito/private window
2. Play the Snake game and submit a score
3. Verify the score appears in the leaderboard
4. Try submitting a lower score - it should not update
5. Submit a higher score - it should update

## Troubleshooting

If the leaderboard still doesn't work:

1. Check the browser console for errors (F12 → Console)
2. Verify Firebase config environment variables are set in Vercel:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Check Firestore Database is enabled (not Realtime Database)
4. Verify the collection name is exactly `snakeLeaderboard`
