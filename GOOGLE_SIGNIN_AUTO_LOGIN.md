# 🔐 Google Sign-In Auto-Login Configuration

## ✅ Current Configuration

Your Google Sign-In is now configured for **automatic account selection** with optimal user experience.

---

## 🎯 How It Works

### Default Behavior (Current Setup)

**No `prompt` parameter = Smart auto-selection**

```javascript
googleProvider.setCustomParameters({
  // No 'prompt' parameter - uses browser's active account
});
```

**User Experience:**

| Scenario | Behavior |
|----------|----------|
| **1 Google account signed in** | ✅ Auto-selects immediately (no prompt) |
| **Multiple Google accounts signed in** | ✅ Shows account chooser |
| **No Google account signed in** | ✅ Shows Google login page |
| **User previously denied consent** | ✅ Shows consent screen again |

This is the **recommended configuration** for best UX!

---

## 🔄 Alternative Configurations

### Option 1: Force Account Selection (Current: OFF)

```javascript
googleProvider.setCustomParameters({
  prompt: 'select_account',  // Always show account chooser
});
```

**When to use:**
- Multi-user systems (shared computers)
- Testing with different accounts
- Apps where users frequently switch accounts

**User Experience:**
- ❌ Always shows account selection screen
- ❌ User must click their account every time

---

### Option 2: Force Consent (Rare Use Case)

```javascript
googleProvider.setCustomParameters({
  prompt: 'consent',  // Always show consent screen
});
```

**When to use:**
- When requesting sensitive scopes
- Testing OAuth consent flow

**User Experience:**
- ❌ Shows consent screen every time
- ❌ Poor UX for regular use

---

### Option 3: Silent Sign-In (Advanced)

```javascript
googleProvider.setCustomParameters({
  prompt: 'none',  // Try to sign in silently
});
```

**When to use:**
- Background re-authentication
- Check if user is already signed in

**Behavior:**
- ✅ Silent if already consented
- ❌ Fails if not authenticated (handle error)

---

## 🔧 Session Persistence (Already Configured)

Your app already has session persistence enabled:

```javascript
// In lib/firebase.js
setPersistence(auth, browserLocalPersistence)
```

**What this does:**
- ✅ User stays logged in after closing browser
- ✅ Auth state persists across page refreshes
- ✅ Token stored in browser's IndexedDB
- ✅ Works offline (cached credentials)

**Storage Location:**
- **Browser:** IndexedDB → `firebaseLocalStorage`
- **Your Backend:** localStorage → `token` + `user`

---

## 🎨 Sign-In Flow Diagram

```
User clicks "Continue with Google"
           ↓
    Check browser's Google accounts
           ↓
    ┌──────────────────────────────┐
    │                              │
    ▼                              ▼
ONE ACCOUNT                  MULTIPLE ACCOUNTS
    ↓                              ↓
✅ Auto-select               Show account chooser
    ↓                              ↓
Get Firebase token           User selects account
    ↓                              ↓
    └──────────────────────────────┘
                   ↓
         Send token to backend
                   ↓
         Verify with Firebase Admin
                   ↓
         Create/update user in DB
                   ↓
         Generate backend JWT
                   ↓
         Store in localStorage
                   ↓
         Redirect to dashboard
                   ↓
         ✅ USER LOGGED IN
```

---

## 🔒 Google Cloud Console Configuration

### Required Settings

#### 1. OAuth Consent Screen
```
Go to: Google Cloud Console → APIs & Services → OAuth consent screen

✅ User Type: External (or Internal for workspace)
✅ App name: IMPETUS (or your app name)
✅ User support email: your-email@example.com
✅ Developer contact: your-email@example.com
✅ Scopes: email, profile, openid (automatically added)
```

#### 2. OAuth 2.0 Client ID
```
Go to: APIs & Services → Credentials → OAuth 2.0 Client IDs

✅ Application type: Web application
✅ Name: IMPETUS Web Client

Authorized JavaScript origins:
  ✅ http://localhost:3000
  ✅ https://your-app.vercel.app
  ✅ https://your-custom-domain.com

Authorized redirect URIs:
  ✅ http://localhost:3000
  ✅ https://your-app.vercel.app
  ✅ https://your-custom-domain.com
  ✅ https://loginandsignup-7e85e.firebaseapp.com/__/auth/handler
```

**⚠️ CRITICAL:** The Firebase redirect URI must be included!

#### 3. Enable APIs
```
Go to: APIs & Services → Library

✅ Google+ API (for profile data)
✅ Google Identity Toolkit API (for Firebase Auth)
```

---

## 🧪 Testing Different Scenarios

### Test 1: Single Google Account
```
1. Sign out of all Google accounts in browser
2. Sign into ONE Google account
3. Go to your app
4. Click "Continue with Google"
5. Expected: Auto-selects account, no prompt ✅
```

### Test 2: Multiple Google Accounts
```
1. Sign into 2+ Google accounts in browser
2. Go to your app
3. Click "Continue with Google"
4. Expected: Shows account chooser ✅
```

### Test 3: No Google Account
```
1. Sign out of all Google accounts
2. Go to your app
3. Click "Continue with Google"
4. Expected: Shows Google login page ✅
```

### Test 4: Session Persistence
```
1. Sign in with Google
2. Refresh the page
3. Expected: Still logged in ✅
4. Close browser and reopen
5. Expected: Still logged in ✅
```

---

## 🐛 Troubleshooting

### Issue: Still Prompting for Password Every Time

**Possible Causes:**

1. **Browser not signed into Google**
   - Solution: Sign into Google account in browser first
   - Check: Click profile icon in top-right of browser

2. **Cookies/Storage Cleared**
   - Solution: Don't clear site data between sessions
   - Check: Browser settings → Privacy → Cookies

3. **Incognito/Private Mode**
   - Solution: Use normal browser window
   - Incognito mode doesn't persist auth state

4. **Third-party Cookies Blocked**
   - Solution: Allow cookies for Google domains
   - Check: Browser settings → Privacy → Cookies → Allow

5. **OAuth Consent Not Saved**
   - Solution: Check "Remember this decision" on consent screen
   - First login requires consent approval

---

### Issue: Account Chooser Shows Every Time

**Cause:** You have `prompt: 'select_account'` set

**Solution:** Remove it (already done in current config)

```javascript
// ❌ BAD - forces account selection
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// ✅ GOOD - uses active account
googleProvider.setCustomParameters({
  // No prompt parameter
});
```

---

### Issue: "Invalid Redirect URI" Error

**Cause:** Your domain not in Google Cloud Console

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your domain to Authorized JavaScript origins
4. Add your domain to Authorized redirect URIs
5. Add Firebase redirect URI: `https://your-project.firebaseapp.com/__/auth/handler`

---

## 📱 Mobile Browser Behavior

**iOS Safari:**
- ✅ Auto-selects if signed into Google in Safari
- ⚠️ May prompt if using different browser (Chrome, Firefox)

**Android Chrome:**
- ✅ Auto-selects if signed into Google in Chrome
- ✅ Uses Google account from Android system

**Desktop Browsers:**
- ✅ Chrome: Uses signed-in Google account
- ✅ Firefox: Uses signed-in Google account
- ✅ Safari: Uses signed-in Google account
- ✅ Edge: Uses signed-in Google account

---

## 🔑 Environment Variables Checklist

Ensure these are set in your `.env.local`:

```env
# Client-side Firebase (for popup)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc...

# Server-side Firebase Admin (for token verification)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## ✅ Current Configuration Summary

**Your app is configured for:**
- ✅ Auto-select active Google account (no prompt)
- ✅ Show chooser if multiple accounts
- ✅ Session persistence across refreshes
- ✅ Secure token verification on backend
- ✅ Proper CSP headers for Firebase

**User Experience:**
1. First time: User sees Google account (or chooser)
2. Subsequent times: Instantly uses same account
3. No password prompts (if already signed into Google)
4. Stays logged in after refresh

---

## 🎯 Best Practices

### ✅ DO:
- Use no `prompt` parameter (default behavior)
- Enable session persistence
- Add all domains to Google Cloud Console
- Test with multiple scenarios
- Clear error messages for users

### ❌ DON'T:
- Use `prompt: 'select_account'` unless necessary
- Use `prompt: 'consent'` for regular sign-in
- Block third-party cookies
- Clear browser data during testing
- Forget to add Firebase redirect URI

---

## 📝 Quick Reference

### To Use Active Account Automatically:
```javascript
googleProvider.setCustomParameters({
  // Leave empty or omit setCustomParameters entirely
});
```

### To Force Account Selection:
```javascript
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
```

### To Restrict to Domain:
```javascript
googleProvider.setCustomParameters({
  hd: 'yourdomain.com',  // Only allow yourdomain.com emails
});
```

---

## 🚀 Ready to Test!

Your Google Sign-In should now:
1. ✅ Automatically use browser's logged-in Google account
2. ✅ Skip credential prompts when possible
3. ✅ Show account chooser only when multiple accounts exist
4. ✅ Persist session across page refreshes
5. ✅ Work on all major browsers

**Test it now:**
1. Make sure you're signed into Google in your browser
2. Refresh your app
3. Click "Continue with Google"
4. Should auto-select your account without prompting! 🎉

---

**Last Updated:** December 23, 2025
