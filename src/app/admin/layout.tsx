
// @ts-nocheck
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user && !user.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the Imperial Command Center.",
          variant: "destructive",
        });
        router.push('/');
      }
    }
  }, [user, authLoading, router, toast]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Verifying Imperial Admin Clearance...</p>
      </div>
    );
  }

  if (!user || (user && !user.isAdmin)) {
    // This case should ideally be handled by the redirect,
    // but as a fallback, show a message or a loader again.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-orbitron text-primary">Access Denied</p>
        <p className="text-muted-foreground">Redirecting to Holonet homepage...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
