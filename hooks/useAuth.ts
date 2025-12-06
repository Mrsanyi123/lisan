import { useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/user-not-found"
          ? "No account found with this email"
          : error.code === "auth/wrong-password"
          ? "Incorrect password"
          : error.code === "auth/invalid-email"
          ? "Invalid email address"
          : error.message || "Failed to sign in";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "An account with this email already exists"
          : error.code === "auth/weak-password"
          ? "Password should be at least 6 characters"
          : error.code === "auth/invalid-email"
          ? "Invalid email address"
          : error.message || "Failed to create account";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithPopup(auth, googleProvider);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/popup-closed-by-user"
          ? "Sign-in popup was closed"
          : error.message || "Failed to sign in with Google";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Failed to sign out",
      }));
      return { success: false, error: error.message };
    }
  };

  return {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    logout,
  };
};
