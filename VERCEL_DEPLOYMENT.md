# Vercel Deployment Guide - Login/Signup Fix

## 🚨 Common Login Issues on Vercel

If you're experiencing login/signup problems on Vercel, you likely have one of these issues:

### 🔥 Issue 1: PDF Parser Crashing Server (MOST COMMON)
**Symptoms**: Google Sign-In shows "Connection closed", auth fails randomly

👉 **[SEE COMPLETE FIX: VERCEL_PDF_FIX.md](VERCEL_PDF_FIX.md)**

This is the #1 cause of auth failures. The PDF parser was loading during auth requests and crashing the server.

**Quick Check**: Look for `ReferenceError: DOMMatrix is not defined` in Vercel logs

✅ **FIXED IN LATEST VERSION** - PDF parsing now isolated with Node.js runtime

---

### 🔐 Issue 2: Firebase Admin Credentials Missing
**Symptoms**: "Invalid Firebase token" errors

👉 See Step 3 below for Firebase Admin setup

---

## ✅ Step 1: Set Environment Variables on Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

### Required Variables (Copy from your .env.local):

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skill-snap.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skill-snap
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skill-snap.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Backend - CRITICAL!)
FIREBASE_ADMIN_PROJECT_ID=skill-snap
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@skill-snap.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

⚠️ **IMPORTANT**: Keep the quotes around `FIREBASE_ADMIN_PRIVATE_KEY` and preserve `\n` characters!

---

## ✅ Step 2: Configure Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **skill-snap**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain:
   ```
   your-app.vercel.app
   ```

### ⚠️ Auth Domain Must Match EXACTLY

In your Firebase config (and Vercel env vars):
```
✔️ CORRECT: skill-snap.firebaseapp.com
❌ WRONG:   skill-snap.web.app
❌ WRONG:   localhost
```

---

## ✅ Step 3: Get Firebase Admin Credentials

### How to get Firebase Admin credentials:

1. Go to **Firebase Console** → **Project Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Download the JSON file
4. Extract these values:

```json
{
  "project_id": "skill-snap",                          // → FIREBASE_ADMIN_PROJECT_ID
  "client_email": "firebase-adminsdk-xxx@...",        // → FIREBASE_ADMIN_CLIENT_EMAIL
  "private_key": "-----BEGIN PRIVATE KEY-----\n..."  // → FIREBASE_ADMIN_PRIVATE_KEY
}
```

5. **For Vercel**: Copy the `private_key` value AS-IS (including `\n` characters)

---

## ✅ Step 4: Configure Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add **Authorized redirect URIs**:
   ```
   https://skill-snap.firebaseapp.com/__/auth/handler
   https://your-app.vercel.app
   ```

---

## ✅ Step 5: Redeploy on Vercel

After setting environment variables:

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click **"..."** on the latest deployment → **Redeploy**
3. Make sure **"Use existing Build Cache"** is **UNCHECKED**
4. Click **Redeploy**

---

## 🐛 Debugging Login Issues

### Check Vercel Logs

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **"Functions"** tab
4. Look for errors in `/api/auth/google` or `/api/auth/login`

### Common Errors:

#### Error: "Firebase Admin SDK initialization failed"
- **Cause**: Firebase Admin credentials not set
- **Fix**: Set `FIREBASE_ADMIN_*` environment variables on Vercel

#### Error: "Invalid Firebase token"
- **Cause**: Firebase auth domain mismatch or unauthorized domain
- **Fix**: 
  - Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skill-snap.firebaseapp.com`
  - Add your Vercel domain to Firebase authorized domains

#### Error: "MongoNetworkError" or "MongoServerError"
- **Cause**: MongoDB connection issue
- **Fix**: 
  - Check `MONGODB_URI` is set correctly on Vercel
  - Whitelist Vercel's IP (0.0.0.0/0) in MongoDB Atlas Network Access

#### Error: "Invalid email or password"
- **Cause**: User doesn't exist or wrong credentials
- **Fix**: 
  - Create account first via signup
  - Check email/password are correct

---

## ✅ Step 6: Test Login Flow

1. Open your Vercel deployment URL
2. Try **"Continue with Google"**
3. Check browser console (F12) for errors
4. Check Vercel function logs for backend errors

---

## 📋 Checklist

- [ ] All environment variables set on Vercel (especially `FIREBASE_ADMIN_*`)
- [ ] Firebase auth domain is `skill-snap.firebaseapp.com`
- [ ] Vercel domain added to Firebase authorized domains
- [ ] OAuth redirect URIs configured in Google Cloud Console
- [ ] MongoDB IP whitelist includes `0.0.0.0/0` (or Vercel IPs)
- [ ] Redeployed on Vercel without build cache
- [ ] Tested login on Vercel deployment

---

## 🆘 Still Having Issues?

### Enable Debug Logging

Add to Vercel environment variables:
```
NODE_ENV=production
DEBUG=true
```

Then redeploy and check function logs.

### Check Browser Console

Open DevTools (F12) → Console tab → Look for:
- Firebase errors
- Network errors (failed API calls)
- Authentication errors

---

## 📞 Quick Reference

| Issue | Check |
|-------|-------|
| "Login failed" | Vercel function logs → `/api/auth/login` |
| "Google login failed" | Firebase auth domain + authorized domains |
| "Token invalid" | Firebase Admin credentials on Vercel |
| Page not loading | Environment variables, then redeploy |
| CORS errors | Add Vercel domain to Firebase + Google OAuth |

---

## ✨ Production Checklist

Before going live:

1. ✅ All environment variables set on Vercel
2. ✅ Firebase Admin SDK credentials configured
3. ✅ Auth domains configured correctly
4. ✅ MongoDB accessible from Vercel
5. ✅ JWT_SECRET is a strong random string
6. ✅ Cloudinary credentials valid
7. ✅ Gemini API key has quota
8. ✅ Test all login methods (email/password + Google)

---

**Need Help?** Check Vercel function logs and browser console for specific error messages.
