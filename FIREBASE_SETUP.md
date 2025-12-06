# Firebase Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google** authentication (optional but recommended):
   - Click on "Google"
   - Toggle "Enable"
   - Enter your project support email
   - Click "Save"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "NOVA Web")
5. Copy the Firebase configuration object

## Step 4: Add Configuration to Your .env File

Create a `.env` file in the root of your project (if it doesn't exist) and add:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

Replace the values with your actual Firebase configuration values.

## Step 5: Configure Authorized Domains (for Google Sign-In)

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your development domain (e.g., `localhost`)
3. For production, add your production domain

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Test Authentication

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Try signing up with email/password
3. Try signing in with Google (if enabled)

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

- Make sure you've added your domain to Authorized domains in Firebase Console

### "Firebase: Error (auth/api-key-not-valid)"

- Double-check your `VITE_FIREBASE_API_KEY` in the `.env` file
- Make sure the `.env` file is in the root directory
- Restart your dev server after changing `.env`

### Google Sign-In Popup Blocked

- Check browser popup settings
- Make sure the domain is authorized in Firebase Console

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Firebase API keys in the frontend are safe to expose (they're public keys)
- The real security comes from Firebase Security Rules (for Firestore, Storage, etc.)
