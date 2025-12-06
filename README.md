# NOVA - Language Learning App

A modern language learning platform for Ethiopian languages (Amharic, Afaan Oromo, Tigrinya) with AI-powered tutoring.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- A Firebase project (for authentication) - [Get started here](https://console.firebase.google.com/)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory and add your configuration:

**Backend (Gemini API):**

```
GEMINI_API_KEY=your_api_key_here
PORT=3001
VITE_API_URL=http://localhost:3001
```

**Frontend (Firebase Auth):**

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. **Set up Firebase Authentication:**
   - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions
   - Enable Email/Password and Google authentication in Firebase Console
   - Add your Firebase config to `.env`

### Running the Application

#### Option 1: Run both frontend and backend together

```bash
npm run dev:all
```

#### Option 2: Run separately

**Terminal 1 - Backend Server:**

```bash
npm run dev:server
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`  
The backend API will be available at `http://localhost:3001`

## 📁 Project Structure

```
lisan/
├── server.js              # Express backend server (API proxy)
├── index.tsx              # React app entry point
├── App.tsx                # Main app component
├── config/                # Configuration files
│   └── firebase.ts        # Firebase initialization
├── hooks/                 # Custom React hooks
│   └── useAuth.ts         # Firebase authentication hook
├── components/            # Reusable UI components
├── screens/               # Screen components
├── services/              # API service (calls backend)
└── public/                # Static assets
```

## 🔒 Security

- **API keys are kept secure on the backend server** - never exposed to the frontend
- The frontend communicates with the backend proxy, which handles all Gemini API calls
- **Firebase Authentication** handles user authentication securely
- Never commit your `.env` file to version control

## 🛠️ Development

- Frontend: React + TypeScript + Vite
- Backend: Express.js + Node.js
- Authentication: Firebase Auth (Email/Password + Google)
- AI: Google Gemini API (via backend proxy)

## 📚 Additional Resources

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Detailed instructions for setting up Firebase Authentication
- [Deployment Guide](./DEPLOYMENT.md) - Complete guide for deploying to production
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Solutions for common issues

## 📝 License

MIT
