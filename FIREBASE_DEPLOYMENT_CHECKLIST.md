# 🚀 Firebase Google Sign-In - Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Firebase Console Setup
- [ ] **Firebase Project Created**
  - Go to [Firebase Console](https://console.firebase.google.com/)
  - Create or select your project

- [ ] **Google Sign-In Enabled**
  - Navigate to: Authentication > Sign-in method
  - Click on "Google" provider
  - Toggle "Enable"
  - Set Project support email
  - Click "Save"

- [ ] **Authorized Domains Added**
  - Go to: Authentication > Settings > Authorized domains
  - Add these domains:
    ```
    localhost
    your-app.vercel.app
    your-custom-domain.com (if applicable)
    ```
  - Click "Add domain" for each

- [ ] **Web App Configured**
  - Go to: Project Settings > General
  - Scroll to "Your apps"
  - If no web app exists, click "Add app" > Web
  - Copy all Firebase config values (we'll need these for Vercel)

- [ ] **Service Account Created**
  - Go to: Project Settings > Service Accounts
  - Click "Generate new private key"
  - Download the JSON file (keep it secure!)
  - We'll extract values from this for Vercel

---

### 2. Vercel Environment Variables

- [ ] **Navigate to Vercel Settings**
  - Go to: Vercel Dashboard > Your Project > Settings > Environment Variables

- [ ] **Add Client-Side Firebase Variables** (⚠️ Must have `NEXT_PUBLIC_` prefix)
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
  NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef...
  ```
  
  **Where to get these:**
  - Firebase Console > Project Settings > General > Your apps > Web app config

- [ ] **Add Server-Side Firebase Admin Variables**
  ```
  FIREBASE_ADMIN_PROJECT_ID=your-project-id
  FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
  FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
  ```
  
  **Where to get these:**
  - From the service account JSON file you downloaded
  - Extract: `project_id`, `client_email`, `private_key`
  - ⚠️ **CRITICAL:** Wrap `private_key` in double quotes and keep `\n` characters

- [ ] **Apply Variables to All Environments**
  - Check: Production
  - Check: Preview
  - Check: Development

---

### 3. Code Verification

- [ ] **Firebase Client Config Updated**
  - File: `lib/firebase.js`
  - Uses `NEXT_PUBLIC_` env vars ✅
  - Auth persistence set to `browserLocalPersistence` ✅
  - Error handling for missing config ✅

- [ ] **Login/Signup Pages Updated**
  - Files: `app/login/page.jsx`, `app/signup/page.jsx`
  - Error handling for popup blocked ✅
  - Error handling for unauthorized domain ✅
  - Detailed logging for debugging ✅

- [ ] **Backend Route Updated**
  - File: `app/api/auth/google/route.js`
  - Verifies Firebase tokens ✅
  - Detailed logging ✅
  - Specific error messages ✅

---

### 4. Local Testing

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **Copy Environment Variables**
  ```bash
  cp .env.local.example .env.local
  # Fill in your Firebase values
  ```

- [ ] **Test Locally**
  ```bash
  npm run dev
  # Open http://localhost:3000/login
  # Try Google Sign-In
  ```

- [ ] **Check Console for Errors**
  - Open Browser DevTools (F12)
  - Go to Console tab
  - Should see: "✅ Firebase config loaded"
  - Should see: "✅ Firebase auth persistence set"

---

### 5. Deployment

- [ ] **Build Locally First**
  ```bash
  npm run build
  ```
  - Verify no build errors
  - Check for missing env var warnings

- [ ] **Deploy to Vercel**
  ```bash
  vercel --prod
  ```
  Or use Vercel GitHub integration (automatic deploy on push)

- [ ] **Wait for Deployment to Complete**
  - Check Vercel dashboard for deployment status
  - Should be "Ready"

---

### 6. Production Testing

- [ ] **Open Vercel App**
  - Go to your Vercel URL: `https://your-app.vercel.app`

- [ ] **Open Browser Console** (F12)
  - Go to Console tab
  - Keep it open during testing

- [ ] **Test Google Sign-In**
  - Click "Continue with Google"
  - Check console for logs:
    ```
    ✅ Firebase config loaded
    ✅ Firebase auth persistence set
    🔵 Starting Google Sign-In...
    🔵 Attempting popup sign-in...
    ✅ Popup sign-in successful
    ✅ Google Sign-In successful: user@example.com
    🔵 Getting Firebase ID token...
    ✅ Firebase token obtained
    🔵 Exchanging Firebase token for backend JWT...
    ✅ Backend authentication successful
    ✅ Redirecting to dashboard...
    ```

- [ ] **Verify Redirect**
  - Should redirect to `/dashboard`
  - User should be logged in
  - Profile should show user info

- [ ] **Test Persistence**
  - Refresh the page
  - User should stay logged in
  - No need to sign in again

---

### 7. Check Vercel Logs

- [ ] **View Function Logs**
  ```bash
  vercel logs --follow
  ```
  Or in Vercel Dashboard: Your Project > Deployments > Latest > Function Logs

- [ ] **Look for Backend Logs**
  ```
  🔵 Google auth request received
  🔵 Firebase token received, length: 1234
  🔵 Verifying Firebase token...
  ✅ Firebase token verified for: user@example.com
  🔵 Connecting to database...
  ✅ Database connected
  ✅ Existing user found: 507f1f77bcf86cd799439011
  🔵 Generating JWT token...
  ✅ JWT token generated for user: 507f1f77bcf86cd799439011
  ```

---

## 🐛 Troubleshooting

### Issue: "auth/unauthorized-domain"

**Cause:** Your Vercel domain is not in Firebase Authorized domains

**Solution:**
1. Go to Firebase Console > Authentication > Settings > Authorized domains
2. Click "Add domain"
3. Enter your Vercel domain: `your-app.vercel.app`
4. Click "Add"
5. Wait 1-2 minutes for changes to propagate
6. Try again

---

### Issue: "Popup was blocked by your browser"

**Cause:** Browser is blocking the popup

**Solution:**
1. Allow popups for your site in browser settings
2. Or user will see clear error message to allow popups
3. Refresh and try again

---

### Issue: "Firebase configuration error"

**Cause:** Missing or incorrect `NEXT_PUBLIC_` environment variables

**Solution:**
1. Go to Vercel > Settings > Environment Variables
2. Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
3. Check for typos
4. Make sure they're applied to Production environment
5. Redeploy: `vercel --prod`

---

### Issue: "Invalid Firebase token"

**Cause:** Backend can't verify the Firebase token

**Solution:**
1. Check `FIREBASE_ADMIN_PRIVATE_KEY` in Vercel
2. Ensure it's wrapped in double quotes: `"-----BEGIN...-----\n"`
3. Ensure `\n` characters are preserved (not actual newlines)
4. Verify `FIREBASE_ADMIN_PROJECT_ID` matches your Firebase project
5. Verify `FIREBASE_ADMIN_CLIENT_EMAIL` is correct
6. Redeploy: `vercel --prod`

---

### Issue: No error shown, but login doesn't complete

**Cause:** Silent failure, check logs

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check Vercel function logs: `vercel logs`
4. Common causes:
   - Missing env vars
   - Database connection issue
   - Token verification failure

---

## 📊 Success Indicators

✅ **All these should be true after deployment:**

- [ ] Google Sign-In button works
- [ ] Popup opens and shows Google account selection
- [ ] Account selection completes without errors
- [ ] User is redirected to `/dashboard`
- [ ] User info is displayed correctly
- [ ] Refresh keeps user logged in
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs
- [ ] Same behavior on localhost and production

---

## 🔒 Security Notes

- ✅ Never commit `.env.local` to Git
- ✅ Keep Firebase private key secure
- ✅ Only add trusted domains to Authorized domains
- ✅ Use environment variables for all secrets
- ✅ Regularly rotate Firebase Admin private keys

---

## 📝 Quick Reference

### Environment Variables Needed:

**Client-Side (6 vars):**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Server-Side (3 vars):**
```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

**Other Required:**
```
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

## 🎉 After Successful Deployment

- [ ] Document your Firebase setup for team
- [ ] Set up monitoring/alerts in Vercel
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor Vercel usage and costs

---

**Last Updated:** December 23, 2025

Need help? Check the detailed documentation in [FIREBASE_PRODUCTION_FIX.md](./FIREBASE_PRODUCTION_FIX.md)
