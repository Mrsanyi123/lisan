# How to Add Your Firebase Configuration

## Step 1: Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the **gear icon** ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** → **Web** (`</>` icon)
6. Copy the configuration object

## Step 2: Update `config/firebase.ts`

Open `lisan/config/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...", // ← Replace with your API key
  authDomain: "my-app.firebaseapp.com", // ← Replace with your auth domain
  projectId: "my-app-12345", // ← Replace with your project ID
  storageBucket: "my-app-12345.appspot.com", // ← Replace with your storage bucket
  messagingSenderId: "123456789012", // ← Replace with your sender ID
  appId: "1:123456789012:web:abc123def456", // ← Replace with your app ID
};
```

## Step 3: Enable Authentication

1. In Firebase Console → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google** (optional):
   - Click "Google"
   - Toggle "Enable"
   - Enter support email
   - Click "Save"

## Step 4: Add Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add:
   - `localhost` (for local development)
   - `mrsanyi123.github.io` (for GitHub Pages)
   - Your custom domain (if you have one)

## ✅ Done!

Your Firebase config is now hardcoded in the code. No need for environment variables!

**Note:** Firebase API keys are safe to expose in frontend code - they're public keys. The real security comes from Firebase Security Rules.
