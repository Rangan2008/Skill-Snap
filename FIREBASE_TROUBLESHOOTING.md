# 🔥 Firebase Google Sign-In - Quick Troubleshooting Guide

## 🚨 Common Production Errors

### 1. "auth/unauthorized-domain"

**Error Message:**
```
This domain (your-app.vercel.app) is not authorized. Contact support.
```

**What it means:**
Your Vercel domain is not added to Firebase's Authorized domains list.

**Fix:**
```
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Navigate to: Authentication > Settings > Authorized domains
4. Click "Add domain"
5. Enter: your-app.vercel.app
6. Click "Add"
7. Wait 1-2 minutes for changes to propagate
8. Try again
```

**Prevention:**
Always add new domains BEFORE deploying.

---

### 2. "Popup was blocked by your browser"

**Error Message:**
```
Popup was blocked by your browser. Please allow popups for this site and try again.
```

**What it means:**
Browser's popup blocker is preventing the Google Sign-In window from opening.

**Fix (for users):**
```
1. Look for popup blocked icon in address bar
2. Click it and select "Always allow popups from this site"
3. Refresh the page
4. Try signing in again
```

**Fix (for developers):**
Consider implementing redirect-based sign-in as fallback (already in code).

---

### 3. "Firebase configuration error"

**Error Message:**
```
Firebase configuration error. Please contact support.
```

**What it means:**
One or more Firebase environment variables are missing or incorrect in Vercel.

**Fix:**
```
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Verify all these are set:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
3. Check for typos
4. Ensure they're applied to "Production" environment
5. Redeploy your app
```

**How to verify locally:**
```javascript
// In browser console on your Vercel app:
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
// Should show your API key, not 'undefined'
```

---

### 4. "Invalid Firebase token"

**Error Message:**
```
Invalid Firebase token. Please try logging in again.
```

**What it means:**
The backend can't verify the Firebase ID token. Usually an issue with Firebase Admin SDK configuration.

**Fix:**
```
1. Go to Vercel Dashboard > Settings > Environment Variables
2. Check FIREBASE_ADMIN_PRIVATE_KEY:
   - Must be wrapped in double quotes
   - Must include \n for newlines (not actual newlines)
   - Example: "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
3. Verify FIREBASE_ADMIN_PROJECT_ID matches your Firebase project
4. Verify FIREBASE_ADMIN_CLIENT_EMAIL is correct
5. Redeploy your app
```

**Test backend config:**
```bash
# Check Vercel function logs
vercel logs --follow

# Should see:
# ✅ Firebase Admin SDK initialized with environment variables
# NOT:
# ❌ Firebase admin initialization error
```

---

### 5. Sign-in completes but doesn't redirect

**Symptoms:**
- Google popup closes
- No error message shown
- User not redirected to dashboard
- Stuck on login page

**What it means:**
Silent failure in the auth flow.

**Fix:**
```
1. Open browser DevTools (F12) > Console tab
2. Try signing in again
3. Look for error messages
4. Common causes:
   a) Network error - check internet connection
   b) Backend API error - check Vercel logs
   c) Database connection failure - check MONGODB_URI
   d) Invalid JWT secret - check JWT_SECRET in Vercel
```

**Check Vercel logs:**
```bash
vercel logs --follow

# Look for errors like:
# ❌ Database connection failed
# ❌ JWT token generation failed
# ❌ Firebase token verification failed
```

---

### 6. "Network error. Please check your connection"

**Error Message:**
```
Network error. Please check your connection and try again.
```

**What it means:**
Request to Firebase or your backend failed.

**Possible causes:**
1. User's internet connection is down
2. Firebase is down (rare)
3. Your Vercel API is down (check status)
4. CORS issue (shouldn't happen with Next.js)

**Fix:**
```
1. Check user's internet connection
2. Check Firebase Status: https://status.firebase.google.com/
3. Check Vercel Status: https://www.vercel-status.com/
4. Try again in a few minutes
5. Check Vercel function logs for errors
```

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console

```javascript
// Open your Vercel app
// Open DevTools (F12) > Console tab
// You should see these logs on page load:

✅ Firebase config loaded: { projectId: 'your-project', authDomain: 'your-project.firebaseapp.com' }
✅ Firebase auth persistence set to browserLocalPersistence

// If you see errors instead, those are your clues!
```

### Step 2: Check Environment Variables

```javascript
// In browser console on your Vercel app:

console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
})

// All should show values, not 'undefined'
```

### Step 3: Check Vercel Function Logs

```bash
# In terminal:
vercel logs --follow

# Or in Vercel Dashboard:
# Your Project > Deployments > Latest > Function Logs
```

### Step 4: Test Sign-In Flow

```
1. Open browser console (F12)
2. Click "Continue with Google"
3. Watch console logs:

Expected flow:
🔵 Starting Google Sign-In...
🔵 Attempting popup sign-in...
✅ Popup sign-in successful
✅ Google Sign-In successful: user@example.com
🔵 Getting Firebase ID token...
✅ Firebase token obtained, length: 1234
🔵 Exchanging Firebase token for backend JWT...
✅ Backend authentication successful
✅ Redirecting to dashboard...

If flow stops at any step, that's where the problem is!
```

---

## 📋 Environment Variables Checklist

### Client-Side (must have NEXT_PUBLIC_ prefix):
```bash
# Check in Vercel > Settings > Environment Variables

✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ NEXT_PUBLIC_FIREBASE_APP_ID
```

### Server-Side (for backend token verification):
```bash
✅ FIREBASE_ADMIN_PROJECT_ID
✅ FIREBASE_ADMIN_CLIENT_EMAIL
✅ FIREBASE_ADMIN_PRIVATE_KEY (wrapped in quotes!)
```

---

## 🧪 Quick Tests

### Test 1: Firebase Config Loaded?
```javascript
// Browser console on your Vercel app:
import { isFirebaseConfigured } from '@/lib/firebase'
console.log('Firebase configured:', isFirebaseConfigured())
// Should return: true
```

### Test 2: Can Popup Open?
```javascript
// Manually test popup:
window.open('https://google.com', '_blank', 'width=500,height=600')
// If this doesn't open, popups are blocked
```

### Test 3: Backend Reachable?
```javascript
// Test API endpoint:
fetch('https://your-app.vercel.app/api/auth/me')
  .then(r => r.json())
  .then(console.log)
// Should get response (even if 401 unauthorized)
```

---

## 🎯 Common Mistakes

### Mistake 1: Wrong prefix on env vars
```bash
# ❌ WRONG:
FIREBASE_API_KEY=...

# ✅ CORRECT:
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

### Mistake 2: Wrong Auth Domain format
```bash
# ❌ WRONG:
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.web.app

# ✅ CORRECT:
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

### Mistake 3: Private key not wrapped in quotes
```bash
# ❌ WRONG (in Vercel env vars):
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBg...
-----END PRIVATE KEY-----

# ✅ CORRECT:
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

### Mistake 4: Forgot to add Vercel domain to Firebase
```
❌ Deployed to: my-app.vercel.app
❌ Firebase Authorized domains: localhost

✅ Firebase Authorized domains: localhost, my-app.vercel.app
```

---

## 🔧 Quick Fixes

### Fix 1: Redeploy with correct env vars
```bash
# Update env vars in Vercel Dashboard
# Then redeploy:
vercel --prod
```

### Fix 2: Clear browser cache
```
1. Open DevTools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"
4. Try signing in again
```

### Fix 3: Test in incognito mode
```
1. Open incognito/private window
2. Go to your Vercel app
3. Try signing in
4. This rules out browser extension conflicts
```

---

## 📞 Still Not Working?

### Check these files for detailed help:
- [FIREBASE_PRODUCTION_FIX.md](./FIREBASE_PRODUCTION_FIX.md) - Complete technical guide
- [FIREBASE_DEPLOYMENT_CHECKLIST.md](./FIREBASE_DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment

### Get detailed logs:
```bash
# Vercel function logs:
vercel logs --follow

# Build logs:
vercel logs --build

# Check specific deployment:
vercel logs <deployment-url>
```

### Check Firebase Console:
1. Usage tab - See authentication requests
2. Errors tab - See Firebase-side errors
3. Users tab - See if users are being created

---

## ✅ Success Checklist

After fixing, all these should work:

- [ ] No errors in browser console
- [ ] Google Sign-In popup opens
- [ ] Account selection works
- [ ] Redirects to dashboard
- [ ] User stays logged in after refresh
- [ ] No errors in Vercel logs
- [ ] Works in incognito mode
- [ ] Works on mobile

---

**Remember:** 90% of production auth issues are due to:
1. Missing environment variables (40%)
2. Wrong domain in Firebase Console (30%)
3. Wrong private key format (20%)
4. Other (10%)

Check these first! 🎯
