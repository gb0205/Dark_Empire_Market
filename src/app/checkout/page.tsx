
"use client";

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react'; // Added ChangeEvent for type safety
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CreditCard, ShieldCheck, Send } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe.js with your publishable key
// Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is in your .env.local
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
let stripePromise: ReturnType<typeof loadStripe> | null = null;

if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey);
} else {
  console.error("Stripe Publishable Key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) is not set. Stripe Elements will not load.");
}


// Updated Zod schema: Card details will be handled by Stripe Elements
const checkoutShippingSchema = z.object({
  fullName: z.string().min(3, "Full designation is required."),
  address: z.string().min(5, "A valid Imperial sector address is required."),
  city: z.string().min(2, "City or outpost name is required."),
  postalCode: z.string().min(3, "Sector postal code is required."),
  country: z.string().min(2, "Planet or system name is required."),
  // paymentMethod can be removed if Stripe is the only option, or kept for UI logic
});

type CheckoutShippingFormValues = z.infer<typeof checkoutShippingSchema>;

const CheckoutForm = () => {
  const { user } = useAuth(); // Auth loading handled by parent
  const { items, totalPrice, clearCart } = useCart(); // Removed itemCount as it's not used here
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutShippingFormValues>({
    resolver: zodResolver(checkoutShippingSchema),
    defaultValues: {
      fullName: user?.name || '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    }
  });

  const onSubmit: SubmitHandler<CheckoutShippingFormValues> = async (shippingData) => {
    if (!stripe || !elements) {
      toast({ title: "Payment System Error", description: "Stripe is not fully loaded yet. Please wait a moment and try again.", variant: "destructive" });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({ title: "Payment Error", description: "Card details component is missing or invalid.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    console.log("Checkout - Shipping Data:", shippingData);
    console.log("Checkout - Attempting to create PaymentIntent with amount:", totalPrice * 100); // Stripe expects amount in cents

    try {
      // 1. Create a PaymentIntent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalPrice * 100) }), // Send amount in cents
      });

      const paymentIntentData = await response.json();

      if (!response.ok || !paymentIntentData.clientSecret) {
        console.error("Failed to create PaymentIntent response:", response);
        console.error("PaymentIntent data from server:", paymentIntentData);
        throw new Error(paymentIntentData.error || 'Failed to initialize payment. Please try again.');
      }
      
      console.log("Checkout - PaymentIntent created. Client Secret:", paymentIntentData.clientSecret);

      // 2. Confirm the card payment with Stripe
      const { error: stripeError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingData.fullName,
              email: user?.email || undefined, 
            },
          },
        }
      );

      if (stripeError) {
        console.error("Stripe Payment Error:", stripeError);
        toast({
          title: "Payment Failed",
          description: stripeError.message || "An error occurred during payment processing.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (confirmedPaymentIntent?.status === 'succeeded') {
        console.log("Checkout - Payment Succeeded:", confirmedPaymentIntent);
        const orderId = `EMP-${Date.now().toString().slice(-6)}`;
        toast({
          title: "Payment Successful & Order Confirmed!",
          description: `Your requisition #${orderId} has been dispatched and is already on its way to your sector!`,
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push('/profile/orders')}>
              View Orders
            </Button>
          ),
        });
        clearCart();
        router.push('/profile/orders');
      } else {
        console.log("Checkout - Payment not succeeded. Status:", confirmedPaymentIntent?.status);
        toast({
          title: "Payment Incomplete",
          description: `Payment status: ${confirmedPaymentIntent?.status || 'Unknown'}. Please try again or contact support.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Checkout - Generic Error during payment process:", error);
      toast({
        title: "Order Processing Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user) {
      setValue('fullName', user.name || '');
    }
  }, [user, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron">Shipping Details</CardTitle>
          <CardDescription>Provide the destination for your acquired goods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Designation</Label>
            <Input id="fullName" {...register('fullName')} placeholder="e.g., Grand Moff Tarkin" />
            {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">Sector Address</Label>
            <Input id="address" {...register('address')} placeholder="Death Star, Command Sector" />
            {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City/Outpost</Label>
              <Input id="city" {...register('city')} placeholder="Imperial City" />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="postalCode">Sector Postal Code</Label>
              <Input id="postalCode" {...register('postalCode')} placeholder="ISC-001" />
              {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="country">Planet/System</Label>
            <Input id="country" {...register('country')} placeholder="Coruscant" />
            {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron">Payment Details (Imperial Credits via Stripe)</CardTitle>
          <CardDescription>Secure your transaction. The Empire values prompt payment. Card details are handled securely by Stripe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="card-element">Credit Chit Details</Label>
            <div className="p-3 border border-input rounded-md bg-background">
                <CardElement id="card-element" options={{
                    style: {
                        base: {
                            color: 'hsl(var(--foreground))', 
                            fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                            fontSize: '16px',
                            '::placeholder': {
                                color: 'hsl(var(--muted-foreground))',
                            },
                        },
                        invalid: {
                            color: 'hsl(var(--destructive))',
                            iconColor: 'hsl(var(--destructive))',
                        },
                    },
                }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isProcessing || !stripe || !elements}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Processing Requisition...</span>
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            <span>Submit Requisition</span>
          </>
        )}
      </Button>
    </form>
  );
}


export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice, itemCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
    if (!authLoading && user && itemCount === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before proceeding to checkout.",
        variant: "destructive"
      });
      router.push('/cart');
    }
  }, [user, authLoading, router, itemCount, toast]);

  if (!stripePromise) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Initializing Payment System...</p>
        <p className="text-sm text-destructive mt-2">Stripe Publishable Key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) is not configured. Check your .env.local file and restart the server.</p>
      </div>
    );
  }

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Securing Connection to Imperial Treasury...</p>
      </div>
    );
  }

  if (itemCount === 0 && !authLoading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-orbitron mb-2">No Items to Requisition</h1>
        <p className="text-muted-foreground mb-6">Your cart is empty. Add items before proceeding.</p>
        <Button onClick={() => router.push('/products')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Browse Wares
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-orbitron font-bold mb-8 text-center text-primary">Imperial Requisition Form</h1>
      
      <Elements stripe={stripePromise}>
        <div className="grid md:grid-cols-3 gap-8">
            <CheckoutForm />
            <div className="md:col-span-1">
              <Card className="sticky top-20 bg-card">
                <CardHeader>
                  <CardTitle className="text-xl font-orbitron">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/40 my-2"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-6 w-6 text-green-500 mb-2" />
                  <p>Transactions secured by Imperial Encryption Protocols (and Stripe).</p>
                </CardFooter>
              </Card>
            </div>
        </div>
      </Elements>
    </div>
  );
}

