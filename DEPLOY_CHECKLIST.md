# Quick Deployment Checklist

## 🚀 Fastest Way: Deploy to Vercel (5 minutes)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
cd lisan
vercel
```

### Step 4: Add Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Add these variables:**

**Backend:**

- `GEMINI_API_KEY` = your Gemini API key
- `NODE_ENV` = `production`

**Frontend (VITE\_\*):**

- `VITE_FIREBASE_API_KEY` = your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` = your-project.firebaseapp.com
- `VITE_FIREBASE_PROJECT_ID` = your-project-id
- `VITE_FIREBASE_STORAGE_BUCKET` = your-project.appspot.com
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = your sender ID
- `VITE_FIREBASE_APP_ID` = your app ID
- `VITE_API_URL` = your Vercel deployment URL (e.g., https://your-app.vercel.app)

### Step 5: Redeploy

```bash
vercel --prod
```

### Step 6: Update Firebase

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to **Authorized domains**

### ✅ Done!

---

## 🔄 Alternative: Separate Frontend & Backend

### Frontend → Vercel/Netlify

1. Push to GitHub
2. Import in Vercel/Netlify
3. Add `VITE_*` environment variables
4. Deploy

### Backend → Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add `GEMINI_API_KEY` environment variable
4. Copy the Railway URL
5. Update `VITE_API_URL` in frontend to Railway URL

---

## 📋 Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] `.env` file is NOT committed (should be in `.gitignore`)
- [ ] Firebase project created
- [ ] Gemini API key obtained
- [ ] Tested locally (`npm run dev:all`)

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Can sign up/login
- [ ] Chat works (send a test message)
- [ ] No console errors
- [ ] Works on mobile
- [ ] Firebase domain added to authorized domains

---

## 🆘 Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
