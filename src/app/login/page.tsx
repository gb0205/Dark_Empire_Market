
"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { HyperspaceBackground } from '@/components/effects/HyperspaceBackground';

// Componente interno que usa useSearchParams
function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath); 
    }
  }, [user, loading, router, redirectPath]);

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
        <LoginForm />
      </div>
    </div>
  );
}

// Componente principal que envolve com Suspense
export default function LoginPage() {

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen py-12 relative overflow-hidden">
        <HyperspaceBackground />
        <p className="text-foreground z-10">Loading...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
