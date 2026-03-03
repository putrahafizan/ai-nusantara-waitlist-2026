# 🔧 QUICK REFERENCE - Deployment Commands

## Essential Commands (Copy-Paste These)

---

## 1. Install Dependencies

```bash
cd ai-academic-platform/services/waitlist-api
npm install
```

---

## 2. Create .env File

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**Then EDIT `.env` and fill:**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@ai-nusantara.id
FROM_NAME=AI NUSANTARA
ALLOWED_ORIGINS=http://localhost:8000
API_KEY=generate-random-string-here
```

---

## 3. Test Locally

```bash
cd ai-academic-platform/services/waitlist-api
npm run dev
```

Then visit: http://localhost:3001/health

---

## 4. Deploy to Railway

```bash
# Install CLI (one time)
npm install -g @railway/cli

# Login
railway login

# Initialize
cd ai-academic-platform/services/waitlist-api
railway init

# Set variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set SUPABASE_URL=your-url
railway variables set SUPABASE_ANON_KEY=your-key
railway variables set RESEND_API_KEY=your-key
railway variables set FROM_EMAIL=noreply@ai-nusantara.id
railway variables set FROM_NAME=AI NUSANTARA
railway variables set API_KEY=your-secret-key
railway variables set ALLOWED_ORIGINS=https://your-netlify-url.netlify.app

# Deploy
railway up

# Get domain
railway domain
```

---

## 5. Deploy Landing Page

**Option A: Netlify Drop**
1. Open: https://app.netlify.com/drop
2. Drag & drop: `ai-academic-platform/apps/web`
3. Get URL

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
cd ai-academic-platform/apps/web
netlify deploy --prod
```

---

## 6. Update Landing Page API URL

**Edit:** `ai-academic-platform/apps/web/landing.html`

**Find (line ~806):**
```javascript
const API_URL = 'http://localhost:3001/api/waitlist';
```

**Replace with:**
```javascript
const API_URL = 'https://your-backend.up.railway.app/api/waitlist';
```

**Re-deploy landing page** (drag & drop ke Netlify lagi)

---

## 7. Test Everything

```bash
# Test backend health
curl https://your-backend.up.railway.app/health

# Test waitlist signup
curl -X POST https://your-backend.up.railway.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test stats (with API key)
curl -H "X-API-Key: your-api-key" \
  https://your-backend.up.railway.app/api/waitlist/stats
```

---

## 8. Verify in Supabase

1. Login ke Supabase dashboard
2. Go to: Table Editor → waitlist
3. Check for new entries
4. View data to verify

---

## 9. Check Railway Logs

```bash
# View logs
railway logs

# Or open Railway dashboard in browser
```

---

## 10. Update CORS (After Landing Page Deploy)

```bash
railway variables set ALLOWED_ORIGINS=https://your-actual-netlify-url.netlify.app
railway up
```

---

## 🚨 Common Issues & Fixes

### Issue: "Module not found"
```bash
# Fix: Install dependencies
cd ai-academic-platform/services/waitlist-api
npm install
```

### Issue: "EADDRINUSE : address already in use"
```bash
# Fix: Port 3001 already in use
# Windows:
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Issue: "Supabase connection error"
```bash
# Fix: Check credentials in .env
# Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
```

### Issue: "CORS error in browser"
```bash
# Fix: Update ALLOWED_ORIGINS with exact landing page URL
railway variables set ALLOWED_ORIGINS=https://exact-url.netlify.app
railway up
```

---

## 📱 Quick URLs After Deploy

| What | URL |
|------|-----|
| Landing Page | https://xxxxx.netlify.app |
| Backend Health | https://xxxxx.up.railway.app/health |
| Backend API | https://xxxxx.up.railway.app/api/waitlist |
| Supabase Dashboard | https://supabase.com/dashboard |
| Railway Dashboard | https://railway.app/project/xxxxx |
| Resend Dashboard | https://resend.com/dashboard |

---

## 🎯 One-Line Commands

```bash
# Full deploy (linux/mac)
cd ai-academic-platform/services/waitlist-api && npm install && railway init && railway variables set NODE_ENV=production && railway variables set PORT=3001 && railway up

# Quick test
curl https://your-backend.up.railway.app/health && echo "✅ Backend is live!"
```

---

**Last Updated:** 2026-03-03
**For:** Quick reference during deployment
