# Deploying to GitHub Pages

## ⚠️ Important: Backend Must Be Deployed Separately

GitHub Pages **only serves static files** - it cannot run Node.js servers.

**You MUST deploy the backend separately:**

- Backend (`server.js`) → Deploy to Railway, Render, or similar
- Frontend (built files) → Deploy to GitHub Pages

---

## 🚀 Step-by-Step Deployment

### Step 1: Deploy Backend First

1. **Deploy backend to Railway/Render:**
   - Go to [railway.app](https://railway.app) or [render.com](https://render.com)
   - Deploy `server.js` with `GEMINI_API_KEY` environment variable
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 2: Configure GitHub Pages

1. **Enable GitHub Pages:**

   - Go to your repo → Settings → Pages
   - Source: **GitHub Actions** (not "Deploy from a branch")
   - Save

2. **Add GitHub Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_API_URL` (your backend URL from Step 1)

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Step 4: Wait for Deployment

- Go to Actions tab in GitHub
- Wait for the workflow to complete
- Your site will be at: `https://mrsanyi123.github.io/lisan/`

---

## 🔧 Configuration Details

### Base Path

The app is configured for `/lisan/` base path. If you want to deploy to root:

1. Update `vite.config.ts`:

   ```typescript
   const base = "/"; // instead of "/lisan/"
   ```

2. Update `.github/workflows/deploy.yml`:
   ```yaml
   env:
     GITHUB_PAGES: "false" # or remove this line
   ```

### File Paths

All paths are already configured correctly:

- ✅ JS files use `.js` extension (Vite handles this)
- ✅ Script tags use relative paths (`./index.tsx` → compiled to `./assets/index-xxx.js`)
- ✅ CSS paths are relative
- ✅ No raw.githubusercontent.com URLs

---

## ✅ Verification Checklist

After deployment:

- [ ] Site loads at `https://mrsanyi123.github.io/lisan/`
- [ ] No 404 errors in console
- [ ] Firebase auth works
- [ ] Chat connects to backend (check `VITE_API_URL`)
- [ ] All assets load correctly

---

## 🐛 Troubleshooting

### Issue: Blank page or 404 errors

**Solution:**

- Check browser console for errors
- Verify base path is `/lisan/` in vite.config.ts
- Make sure GitHub Actions workflow completed successfully

### Issue: API calls failing

**Solution:**

- Verify `VITE_API_URL` secret is set correctly
- Check backend is running and accessible
- Check CORS settings in `server.js`

### Issue: Firebase auth not working

**Solution:**

- Add `https://mrsanyi123.github.io` to Firebase authorized domains
- Verify all Firebase secrets are set correctly

---

## 📝 Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Build locally:**

   ```bash
   GITHUB_PAGES=true npm run build
   ```

2. **Deploy `dist/` folder:**
   - Use `gh-pages` branch, or
   - Use GitHub Actions (recommended)

---

## 🔗 Your Site URL

After deployment, your site will be available at:
**https://mrsanyi123.github.io/lisan/**

Make sure to update Firebase authorized domains with this URL!
