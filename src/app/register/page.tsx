
"use client";

import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HyperspaceBackground } from '@/components/effects/HyperspaceBackground';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/profile'); // Redirect if already logged in
    }
  }, [user, loading, router]);
  
  // onRegisterSuccess is implicitly handled by useEffect above reacting to `user` state change.

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 relative overflow-hidden">
            <HyperspaceBackground />
            <p className="text-foreground z-10">Loading authentication status...</p>
        </div>
     )
  }
  if (user && !loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 relative overflow-hidden">
            <HyperspaceBackground />
            <p className="text-foreground z-10">Redirecting...</p>
        </div>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 relative overflow-hidden">
      <HyperspaceBackground />
      <div className="z-10 w-full max-w-md"> {/* Ensure form is above background */}
        <RegisterForm />
      </div>
    </div>
  );
}
