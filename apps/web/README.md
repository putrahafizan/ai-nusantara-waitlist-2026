# AI NUSANTARA - Web App

## Landing Page (Phase 1: Validation)

This is the initial landing page for market validation. It's designed to:
- Explain the 3 core features clearly
- Collect email signups for waitlist
- Show pricing preview
- Professional academic look & feel

## Quick Start

### Option 1: Open Directly
Simply open `landing.html` in your browser:
```bash
# On Windows
start landing.html

# On Mac/Linux
open landing.html
```

### Option 2: Local Server (Recommended)
For better testing of form submissions:

```bash
# Using Python 3
cd apps/web
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit: http://localhost:8000/landing.html

### Option 3: Deploy to Production

#### Netlify (Free & Fastest)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd apps/web
netlify deploy --prod
```

Or simply drag & drop the `apps/web` folder to Netlify dashboard.

#### Vercel (Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel --prod
```

#### GitHub Pages (Free)
1. Push to GitHub repository
2. Go to Settings > Pages
3. Select `apps/web` folder as source
4. Your site will be live at `https://username.github.io/repo-name`

## Features

### Landing Page Sections
1. **Hero Section** - Clear value proposition + CTA
2. **Features** - 3 core features explained
3. **For Who** - Target users (dosen & mahasiswa)
4. **Pricing** - Free, Pro (Rp 200K), Researcher (Rp 500K)
5. **Waitlist Form** - Email collection
6. **Footer** - Links & information

### Form Handling
Currently, form submissions are:
- Logged to console (for testing)
- Stored in browser's localStorage (demo)
- Ready for backend integration

**To Connect to Backend:**
Replace the form handler in `landing.html`:
```javascript
// Current (demo)
localStorage.setItem('waitlist', JSON.stringify(waitlist));

// Production
fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
});
```

## Customization

### Change Colors
Edit the CSS variables in `landing.html`:
```css
:root {
    --primary: #2563eb;      /* Main blue color */
    --primary-dark: #1e40af; /* Darker blue for hover */
    --success: #10b981;      /* Green for success/checks */
}
```

### Change Content
All text is in plain HTML - just edit the text directly:
```html
<h1>Asisten Penelitian Akademik</h1>
<p>Your new headline here</p>
```

### Add Analytics
Add your tracking scripts before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

## Deployment Checklist

Before deploying to production:
- [ ] Update all placeholder links
- [ ] Add Google Analytics or PostHog
- [ ] Connect waitlist form to backend API
- [ ] Test on mobile devices
- [ ] Test form submission
- [ ] Add meta tags for SEO
- [ ] Set up custom domain (optional)
- [ ] Configure SSL (automatic on Netlify/Vercel)

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling (no framework dependencies)
- **Vanilla JavaScript** - No framework dependencies
- **Google Fonts** - Inter font family

## Next Steps (Phase 2)

Once validation is complete, we'll build:
1. Next.js 14 application
2. User authentication
3. Dashboard interface
4. API integration
5. Database connection

## Support

For questions or issues, contact:
- GitHub: [Create Issue]
- Email: support@ai-nusantara.id

---

**Status:** 🟢 Ready for Deployment
**Last Updated:** 2026-03-03
