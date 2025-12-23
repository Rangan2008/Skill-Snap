# 📄 PDF.js Worker Configuration

## ✅ Current Setup

PDF.js worker is served **locally** from the public directory to avoid CDN/Turbopack issues.

---

## 🔧 Configuration

### Worker Location
```
public/pdfjs/pdf.worker.min.mjs
```

This file is copied from `node_modules/pdfjs-dist/build/pdf.worker.min.mjs`

### Code Configuration
```javascript
// lib/clientResumeParser.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
```

---

## 🔄 After Updating pdfjs-dist

When you update the `pdfjs-dist` package, you need to copy the new worker file:

```powershell
Copy-Item "node_modules\pdfjs-dist\build\pdf.worker.min.mjs" "public\pdfjs\pdf.worker.min.mjs"
```

Or on Linux/Mac:
```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdfjs/pdf.worker.min.mjs
```

---

## 🚀 Why Local Worker?

### ❌ CDN Issues (Previous Approach)
```javascript
// This caused errors in Next.js/Turbopack dev mode
workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js'
```

**Problems:**
- "Failed to fetch dynamically imported module" errors
- CORS issues in development
- CSP complications
- Unreliable in strict environments

### ✅ Local Worker (Current Approach)
```javascript
// Served from public directory - always works
workerSrc = '/pdfjs/pdf.worker.min.mjs'
```

**Benefits:**
- ✅ No CDN dependency
- ✅ No CORS issues
- ✅ Works in all environments (dev/prod)
- ✅ Faster loading (same origin)
- ✅ CSP-friendly (self-hosted)
- ✅ Works with Turbopack

---

## 📦 Vercel Deployment

The worker file is automatically deployed with your app since it's in the `public/` directory.

**No additional configuration needed!**

---

## 🐛 Troubleshooting

### Error: "Setting up fake worker failed"

**Cause:** Worker file missing or incorrect path

**Solution:**
1. Check if file exists: `public/pdfjs/pdf.worker.min.mjs`
2. Re-copy from node_modules (see command above)
3. Restart dev server

### Error: "PDF.js worker not found"

**Cause:** Wrong worker path in code

**Solution:**
Verify the path in `lib/clientResumeParser.js`:
```javascript
workerSrc = '/pdfjs/pdf.worker.min.mjs'  // ✅ Correct
workerSrc = 'pdfjs/pdf.worker.min.mjs'   // ❌ Missing leading slash
```

---

## 📝 Version History

| Date | pdfjs-dist Version | Worker File |
|------|-------------------|-------------|
| Dec 23, 2025 | 4.10.38 | pdf.worker.min.mjs |

---

## 🔒 Security Notes

- Worker runs in a Web Worker context (sandboxed)
- No access to DOM or localStorage
- Only processes PDF data
- CSP allows 'self' for scripts (includes workers)

---

**Current Status:** ✅ Configured and working
