# Deployment Guide for NOVA Language Learning App

This guide covers deploying both the frontend and backend to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are documented
- [ ] Firebase project is set up with production settings
- [ ] API keys are ready
- [ ] Domain name (optional but recommended)

## 🏗️ Architecture Overview

Your app has two parts:

1. **Frontend** (React + Vite) - Static files
2. **Backend** (Express + Node.js) - API server

You can deploy them separately or together.

---

## 🚀 Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is great for full-stack apps and supports both frontend and backend.

### Step 1: Prepare for Deployment

1. **Create `vercel.json` in the root:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

2. **Update `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "vite build"
  }
}
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Login:**

```bash
vercel login
```

3. **Deploy:**

```bash
vercel
```

4. **Set Environment Variables in Vercel Dashboard:**

   - Go to your project → Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `GEMINI_API_KEY`
     - `PORT` (optional, Vercel sets this)
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_API_URL` (set to your Vercel deployment URL)

5. **Redeploy after adding env vars:**

```bash
vercel --prod
```

---

## 🌐 Option 2: Deploy Frontend + Backend Separately

### Frontend: Deploy to Vercel/Netlify

#### Vercel (Frontend Only)

1. **Build the frontend:**

```bash
npm run build
```

2. **Deploy:**
   - Push to GitHub
   - Import project in Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variables (all `VITE_*` variables)

#### Netlify (Frontend Only)

1. **Create `netlify.toml`:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy:**
   - Push to GitHub
   - Import project in Netlify
   - Add environment variables in Netlify dashboard

### Backend: Deploy to Railway/Render

#### Railway (Recommended for Backend)

1. **Create `railway.json` (optional):**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Deploy:**

   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repository
   - Add environment variables:
     - `GEMINI_API_KEY`
     - `PORT` (Railway sets this automatically)
   - Railway will give you a URL like: `https://your-app.railway.app`

3. **Update Frontend:**
   - Set `VITE_API_URL` in frontend env vars to your Railway URL

#### Render (Alternative for Backend)

1. **Create `render.yaml`:**

```yaml
services:
  - type: web
    name: nova-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
```

2. **Deploy:**
   - Go to [render.com](https://render.com)
   - New Web Service
   - Connect GitHub repo
   - Set:
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Add environment variables
   - Deploy

---

## 🔥 Firebase Configuration for Production

### Step 1: Add Production Domain to Firebase

1. Go to Firebase Console → Authentication → Settings
2. Add your production domain to **Authorized domains**
3. Add `localhost` for local development

### Step 2: Update CORS in Backend (if needed)

If deploying separately, update `server.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.vercel.app",
      "https://your-production-domain.com",
    ],
    credentials: true,
  })
);
```

---

## 📝 Environment Variables Reference

### Frontend (VITE\_\* variables)

```env
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend

```env
GEMINI_API_KEY=...
PORT=3001  # Usually set by platform
NODE_ENV=production
```

---

## 🐳 Option 3: Deploy with Docker

### Create `Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY server.js ./
EXPOSE 3001
CMD ["node", "server.js"]
```

### Create `docker-compose.yml`

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
    env_file:
      - .env
```

### Deploy to Railway/Render with Docker

- Railway and Render both support Docker
- Just push your Dockerfile and they'll build it

---

## 🔧 Build Configuration

### Update `vite.config.ts` for Production

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    // ... existing config
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
    },
    // Use production API URL
    define: {
      "process.env.VITE_API_URL": JSON.stringify(
        mode === "production"
          ? env.VITE_API_URL || "https://your-backend-url.com"
          : "http://localhost:3001"
      ),
    },
  };
});
```

---

## ✅ Post-Deployment Checklist

- [ ] Test frontend loads correctly
- [ ] Test authentication (sign up/login)
- [ ] Test chat functionality
- [ ] Verify API calls work (check network tab)
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set up monitoring/error tracking (optional)

---

## 🚨 Common Deployment Issues

### Issue: CORS Errors

**Solution:** Update backend CORS to include your frontend domain

### Issue: Environment Variables Not Working

**Solution:**

- Make sure variables start with `VITE_` for frontend
- Restart/redeploy after adding env vars
- Check variable names match exactly

### Issue: API Calls Failing

**Solution:**

- Verify `VITE_API_URL` points to your backend
- Check backend logs
- Ensure backend is running

### Issue: Firebase Auth Not Working

**Solution:**

- Add production domain to Firebase authorized domains
- Verify Firebase env vars are set correctly

---

## 📊 Recommended Platforms Summary

| Component    | Platform | Why                      |
| ------------ | -------- | ------------------------ |
| **Frontend** | Vercel   | Easy, fast, great DX     |
| **Backend**  | Railway  | Simple, good free tier   |
| **Both**     | Vercel   | Can deploy both together |

---

## 🎯 Quick Start: Deploy Everything to Vercel

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Login:**

```bash
vercel login
```

3. **Create `vercel.json`** (see Option 1 above)

4. **Deploy:**

```bash
vercel
```

5. **Add environment variables in Vercel dashboard**

6. **Deploy to production:**

```bash
vercel --prod
```

Done! 🎉

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
