#!/usr/bin/env node

/**
 * Verify Firebase and Vercel configuration
 * Run this script to check if all required environment variables are set
 */

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

console.log('🔍 Checking Firebase Environment Variables...\n');

let allPresent = true;
let hasValues = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const present = value !== undefined;
  const hasValue = present && value.length > 0;
  
  const status = hasValue ? '✅' : (present ? '⚠️ (empty)' : '❌');
  console.log(`${status} ${varName}`);
  
  if (!present) allPresent = false;
  if (!hasValue) hasValues = false;
});

console.log('\n📋 Summary:');

if (allPresent && hasValues) {
  console.log('✅ All Firebase environment variables are properly configured!');
  console.log('\n📝 Next steps:');
  console.log('1. Verify Firestore security rules (see FIRESTORE_RULES.md)');
  console.log('2. Check Firebase Console for any errors');
  console.log('3. Test the leaderboard in production');
  process.exit(0);
} else if (allPresent && !hasValues) {
  console.log('⚠️  Some environment variables are empty');
  console.log('\n📝 Action required:');
  console.log('1. Check your .env file for empty values');
  console.log('2. Update Vercel environment variables if deploying to production');
  process.exit(1);
} else {
  console.log('❌ Some environment variables are missing');
  console.log('\n📝 Action required:');
  console.log('1. Create a .env file in the project root');
  console.log('2. Add all required Firebase configuration values');
  console.log('3. Set the same variables in Vercel project settings:');
  console.log('   https://vercel.com/[your-project]/settings/environment-variables');
  console.log('\nExample .env file:');
  console.log('---');
  requiredEnvVars.forEach(varName => {
    console.log(`${varName}=your-value-here`);
  });
  console.log('---');
  process.exit(1);
}
