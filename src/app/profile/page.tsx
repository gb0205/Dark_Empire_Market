"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Loader2, User, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Placeholder for fetching user orders if this page were to include it directly.
// For now, order history is a separate page link.

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying Imperial Credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-4xl font-orbitron font-bold text-primary mb-4 sm:mb-0">Your Imperial Dossier</h1>
        <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
          Log Out of Terminal
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Officer Details
          </TabsTrigger>
          <TabsTrigger value="orders" asChild>
            <Link href="/profile/orders" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <History className="h-4 w-4" /> Acquisition History
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm user={user} />
        </TabsContent>
        {/* The content for "orders" tab is now handled by navigating to /profile/orders */}
         <TabsContent value="orders">
            <p className="text-center p-4 text-muted-foreground">
                Navigating to Acquisition History...
            </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
