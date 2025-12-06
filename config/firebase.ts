import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration - Replace with your actual Firebase config values
// Get these from: https://console.firebase.google.com/ → Project Settings → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyCnbzTpaWAi3Kmgt2zSUrI37kynrUT893M",
  authDomain: "nova-26e05.firebaseapp.com",
  projectId: "nova-26e05",
  storageBucket: "nova-26e05.firebasestorage.app",
  messagingSenderId: "956176650134",
  appId: "1:956176650134:web:cc3ee429eff25ed4d717b7",
  measurementId: "G-LRFPNTK8K2",
};

// Example (replace with your actual values):
// const firebaseConfig = {
//   apiKey: "AIzaSyAbc123...",
//   authDomain: "my-app.firebaseapp.com",
//   projectId: "my-app-12345",
//   storageBucket: "my-app-12345.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:abc123def456",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
