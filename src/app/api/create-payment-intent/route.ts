
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

// Ensure your Stripe secret key is set in environment variables
// IMPORTANT: Never expose this key on the client side!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20', // Use the latest API version
  });
} else {
  console.error('Stripe secret key is not configured. PaymentIntent creation will fail.');
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    console.error('Stripe is not initialized because the secret key is missing.');
    return NextResponse.json({ error: 'Stripe is not configured on the server. Contact support.' }, { status: 500 });
  }

  try {
    const { amount, currency = 'usd' } = await request.json(); // Amount should be in the smallest currency unit (e.g., cents)

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating PaymentIntent:', error);
    // Log the type of error to help diagnose
    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      console.error('Stripe Authentication Error: This usually means your STRIPE_SECRET_KEY is incorrect or missing.');
    }
    return NextResponse.json({ error: error.message || 'Failed to create PaymentIntent.' }, { status: 500 });
  }
}
