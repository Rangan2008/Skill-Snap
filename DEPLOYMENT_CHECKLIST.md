# 🚀 Vercel Deployment Checklist

Use this checklist to ensure your deployment is properly configured.

## ✅ Before Deployment

### 1. Environment Variables Prepared
- [ ] Created `.env.local` from `.env.local.example`
- [ ] Filled in all required values
- [ ] Tested locally with `npm run dev`

### 2. Firebase Configuration
- [ ] Firebase project created: `skill-snap`
- [ ] Firebase Auth enabled (Email/Password + Google)
- [ ] Firebase service account key downloaded
- [ ] Auth domain is: `skill-snap.firebaseapp.com` (NOT .web.app)

### 3. MongoDB Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access allows `0.0.0.0/0` (all IPs for Vercel)
- [ ] Connection string copied to `.env.local`

### 4. External Services
- [ ] Cloudinary account created
- [ ] Cloudinary credentials obtained
- [ ] Gemini API key obtained from Google AI Studio
- [ ] All service credentials tested locally

---

## ✅ Vercel Deployment

### 1. Initial Setup
- [ ] Repository pushed to GitHub
- [ ] Vercel account connected to GitHub
- [ ] Project imported to Vercel

### 2. Environment Variables on Vercel
Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

#### Required Variables (copy from .env.local):
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `JWT_EXPIRES_IN`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `GEMINI_API_KEY`

#### Firebase Client (Frontend):
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `skill-snap.firebaseapp.com`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `skill-snap`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `skill-snap.appspot.com`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Firebase Admin (Backend) - CRITICAL:
- [ ] `FIREBASE_ADMIN_PROJECT_ID` = `skill-snap`
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL` = `firebase-adminsdk-xxxxx@skill-snap.iam.gserviceaccount.com`
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY` = `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
  - ⚠️ Keep the quotes!
  - ⚠️ Keep the `\n` characters!

### 3. Deploy
- [ ] Clicked "Deploy" button
- [ ] Build completed successfully
- [ ] Deployment URL assigned (e.g., `your-app.vercel.app`)

---

## ✅ Post-Deployment Configuration

### 1. Firebase Authorized Domains
Go to: Firebase Console → Authentication → Settings → Authorized domains

- [ ] Added: `your-app.vercel.app` (your actual Vercel domain)
- [ ] Verified: `skill-snap.firebaseapp.com` is listed

### 2. Google OAuth Configuration
Go to: Google Cloud Console → APIs & Services → Credentials

- [ ] Selected OAuth 2.0 Client ID
- [ ] Added to Authorized redirect URIs:
  - [ ] `https://skill-snap.firebaseapp.com/__/auth/handler`
  - [ ] `https://your-app.vercel.app` (your Vercel domain)

### 3. MongoDB Network Access
Go to: MongoDB Atlas → Network Access

- [ ] Verified `0.0.0.0/0` is whitelisted (or added Vercel's IPs)

---

## ✅ Testing

### 1. Basic Functionality
- [ ] Website loads on Vercel URL
- [ ] Homepage displays correctly
- [ ] Navigation works
- [ ] Styling/CSS loads properly

### 2. Authentication Testing
- [ ] Can access `/signup` page
- [ ] Can access `/login` page

#### Email/Password Signup:
- [ ] Can create account with email/password
- [ ] Receives success message
- [ ] Redirects to dashboard
- [ ] Can log out
- [ ] Can log back in with same credentials

#### Google Sign-In:
- [ ] "Continue with Google" button works
- [ ] Google account selection popup appears
- [ ] After selecting account, redirects to dashboard
- [ ] User data saved in MongoDB
- [ ] Can log out
- [ ] Can log back in with Google

### 3. Resume Analysis (Core Features)
- [ ] Can upload resume (PDF/DOC/DOCX)
- [ ] Upload progress shows
- [ ] Analysis completes successfully
- [ ] Results page displays:
  - [ ] Match percentage
  - [ ] ATS score
  - [ ] Skills found
  - [ ] Missing skills
- [ ] Can view learning roadmap
- [ ] Resources display correctly

### 4. Error Handling
- [ ] Invalid login shows error message
- [ ] Network errors display properly
- [ ] 404 page works
- [ ] Error boundaries catch errors

---

## ✅ Debugging (if issues occur)

### Check Vercel Function Logs
Go to: Vercel Dashboard → Deployments → Latest → Functions

- [ ] Checked `/api/auth/login` logs
- [ ] Checked `/api/auth/google` logs
- [ ] Checked `/api/resume/analyze` logs
- [ ] No error messages present

### Check Browser Console
Open: DevTools (F12) → Console tab

- [ ] No JavaScript errors
- [ ] No Firebase errors
- [ ] No network request failures
- [ ] No CORS errors

### Common Error Fixes:
| Error | Solution |
|-------|----------|
| "Firebase Admin SDK initialization failed" | Set `FIREBASE_ADMIN_*` env vars |
| "Invalid Firebase token" | Check auth domain, add Vercel domain to authorized domains |
| "MongoNetworkError" | Whitelist `0.0.0.0/0` in MongoDB Network Access |
| "Invalid email or password" | Create account first, verify credentials |
| Google login popup blocked | Enable popups for your domain |
| CORS error | Add Vercel domain to Firebase + Google OAuth |

---

## ✅ Security Checklist

Before going to production:

- [ ] `JWT_SECRET` is a strong random string (30+ characters)
- [ ] MongoDB user has minimal required permissions
- [ ] Firebase Admin private key is kept secret
- [ ] All API keys are environment variables (not hardcoded)
- [ ] CORS is properly configured
- [ ] No sensitive data in client-side code
- [ ] Rate limiting configured (if applicable)
- [ ] Input validation on all forms

---

## ✅ Performance Optimization

- [ ] Images optimized and using Next.js Image component
- [ ] Code splitting configured
- [ ] API routes optimized
- [ ] Database queries indexed
- [ ] Caching strategy implemented
- [ ] Bundle size reasonable (<300KB initial)

---

## ✅ Final Production Checklist

- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Analytics configured (optional)
- [ ] Error monitoring setup (optional: Sentry)
- [ ] Backup strategy for MongoDB
- [ ] Documentation updated
- [ ] README.md includes deployment instructions
- [ ] Team members have access to services

---

## 🆘 Need Help?

1. **Read**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions
2. **Check**: Vercel function logs for specific error messages
3. **Verify**: All environment variables are correctly set
4. **Test**: Each feature individually to isolate issues
5. **Debug**: Enable debug logging if needed

---

## 📊 Status

Deployment Date: ________________

Deployed By: ________________

Vercel URL: ________________

Status: ⬜ In Progress  ⬜ Deployed  ⬜ Live

Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
