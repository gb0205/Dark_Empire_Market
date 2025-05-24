
"use client";

import type { User as AppUserType } from '@/types'; // Renamed to avoid conflict
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  type AuthProvider as FirebaseAuthProvider, 
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@empire.com"; // Define the admin email address

interface AuthContextType {
  user: AppUserType | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateCurrentFirebaseUser: (details: { displayName?: string | null; photoURL?: string | null }) => Promise<void>;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUserType | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      console.error("AuthContext: Firebase auth is not initialized. User state will not be managed.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatarUrl: firebaseUser.photoURL || undefined,
          isAdmin: firebaseUser.email === ADMIN_EMAIL, // Set isAdmin flag
          joinDate: firebaseUser.metadata.creationTime,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const handleAuthError = (err: any, defaultMessage: string) => {
    console.error("Firebase Auth Error:", err);
    let message = defaultMessage;
    if (err.code === 'auth/account-exists-with-different-credential') {
      message = 'An account already exists with the same email address but different sign-in credentials. Try signing in using a different method.';
    } else if (err.code === 'auth/popup-closed-by-user') {
      message = 'Sign-in process was cancelled. The pop-up was closed.';
    } else if (err.code === 'auth/cancelled-popup-request') {
      message = 'Multiple sign-in pop-ups were opened. Please try again.';
    }
     else if (err.code) {
      message = err.message;
    }
    setError(message);
    toast({
      title: "Authentication Failed",
      description: message,
      variant: "destructive",
    });
  };

  const socialSignIn = async (provider: FirebaseAuthProvider, providerName: string) => {
    setLoading(true);
    setError(null);
    if (!auth) {
        handleAuthError({code: 'auth/no-auth-instance', message: 'Firebase Auth not initialized'}, 'Firebase Auth is not ready.');
        setLoading(false);
        return;
    }
    try {
      const userCredential = await signInWithPopup(auth, provider);
      if (userCredential.user) {
         // onAuthStateChanged will handle setting the user state.
         // It's good to show an immediate toast for better UX.
        toast({
          title: `${providerName} Sign-In Successful`,
          description: `Welcome to the Dark Empire Market! You're now signed in with ${providerName}.`,
        });
      }
    } catch (err: any) {
      handleAuthError(err, `Failed to sign in with ${providerName}.`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await socialSignIn(provider, "Google");
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
     if (!auth) {
        handleAuthError({code: 'auth/no-auth-instance', message: 'Firebase Auth not initialized'}, 'Firebase Auth is not ready.');
        setLoading(false);
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user state including isAdmin
      toast({
        title: "Login Successful",
        description: "Welcome back to the Dark Empire Market!",
      });
    } catch (err: any) {
      handleAuthError(err, "Failed to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name?: string) => {
    setLoading(true);
    setError(null);
    if (!auth) {
        handleAuthError({code: 'auth/no-auth-instance', message: 'Firebase Auth not initialized'}, 'Firebase Auth is not ready.');
        setLoading(false);
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        const displayName = name || email.split('@')[0] || 'User';
        await updateProfile(userCredential.user, { displayName });
        // onAuthStateChanged will update the user state.
        // For immediate feedback, you could also call setUser here.
        setUser({ 
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: displayName,
          avatarUrl: userCredential.user.photoURL || undefined,
          isAdmin: userCredential.user.email === ADMIN_EMAIL,
          joinDate: userCredential.user.metadata.creationTime,
        });
      }
      toast({
        title: "Registration Successful",
        description: "Welcome to the Empire! Your account has been created.",
      });
    } catch (err: any) {
      handleAuthError(err, "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    if (!auth) {
        handleAuthError({code: 'auth/no-auth-instance', message: 'Firebase Auth not initialized'}, 'Firebase Auth is not ready.');
        setLoading(false);
        return;
    }
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null
      toast({
        title: "Logged Out",
        description: "You have successfully logged out of the Imperial network.",
      });
    } catch (err: any) {
      handleAuthError(err, "Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    if (!auth) {
        handleAuthError({code: 'auth/no-auth-instance', message: 'Firebase Auth not initialized'}, 'Firebase Auth is not ready.');
        setLoading(false);
        return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a password reset link has been sent.",
      });
    } catch (err: any)
     {
      handleAuthError(err, "Could not send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentFirebaseUser = async (details: { displayName?: string | null; photoURL?: string | null }) => {
    setLoading(true);
    setError(null);
    if (!auth || !auth.currentUser) {
      handleAuthError({ code: 'auth/no-current-user', message: 'No user is currently signed in or Auth is not initialized.' }, 'User not found.');
      setLoading(false);
      return;
    }
    try {
      await updateProfile(auth.currentUser, details);
      // Update local user state for immediate UI feedback, preserving isAdmin and joinDate
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUserDetails: Partial<AppUserType> = {};
        if (details.displayName !== undefined && details.displayName !== null) updatedUserDetails.name = details.displayName;
        if (details.photoURL !== undefined && details.photoURL !== null) updatedUserDetails.avatarUrl = details.photoURL;
        
        return { 
          ...prevUser, 
          ...updatedUserDetails, 
          name: details.displayName ?? prevUser.name, // Ensure name is updated correctly
          avatarUrl: details.photoURL ?? prevUser.avatarUrl, // Ensure avatarUrl is updated correctly
          isAdmin: prevUser.email === ADMIN_EMAIL, // Re-assert isAdmin based on email
        };
      });
      toast({
        title: "Profile Updated",
        description: "Your Imperial records have been successfully updated.",
      });
    } catch (err: any) {
      handleAuthError(err, "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, resetPassword, signInWithGoogle, updateCurrentFirebaseUser, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
