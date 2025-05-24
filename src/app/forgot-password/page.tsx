
"use client";

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ForgotPasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // If user is somehow logged in and lands here, redirect them away
      router.push('/profile'); 
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
          <p>Loading...</p>
      </div>
    )
  }
  
  // Unlike login/register, we don't redirect if user is logged in,
  // because they might want to reset password even if a session exists (though unlikely scenario for this page directly)
  // However, if they ARE logged in, it's better to send them to profile.

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <ForgotPasswordForm />
    </div>
  );
}
