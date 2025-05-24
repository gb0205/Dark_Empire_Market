"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { mockOrders } from '@/lib/mock-data';
import { OrderHistoryItem } from '@/components/profile/OrderHistoryItem';
import { Loader2, ListOrdered, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Simulate fetching user orders
async function getUserOrders(userId: string): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter mock orders by userId. In a real app, this would be an API call.
      resolve(mockOrders.filter(order => order.userId === userId));
    }, 500);
  });
}

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile/orders');
    } else if (user) {
      getUserOrders(user.id).then(data => {
        setOrders(data);
        setOrdersLoading(false);
      });
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

  if (ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Retrieving Acquisition Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-orbitron font-bold text-primary">Acquisition History</h1>
        <Button variant="outline" asChild>
            <Link href="/profile">Back to Dossier</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center p-10 bg-card shadow-lg">
            <CardHeader>
                <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl font-orbitron">No Acquisitions Recorded</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    Your requisition history is currently empty. The Empire encourages proactive procurement.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/products">Browse Available Wares</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

// Minimal Card component needed if not importing from ui/card for some reason in this context
// Typically, you'd import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
const Card = ({className, children} : {className?: string, children: React.ReactNode}) => <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
const CardHeader = ({className, children} : {className?: string, children: React.ReactNode}) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
const CardTitle = ({className, children} : {className?: string, children: React.ReactNode}) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
const CardContent = ({className, children} : {className?: string, children: React.ReactNode}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

