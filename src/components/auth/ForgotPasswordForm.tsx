
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { MailQuestion, Loader2, ShieldAlert, Send } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid Holonet email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { resetPassword, loading: authLoading, error: authError, setError: setAuthError } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    setAuthError(null); // Clear any global auth errors when component mounts
  }, [setAuthError]);

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setAuthError(null);
    setMessage(null);
    await resetPassword(data.email);
    // The AuthContext's resetPassword function will show a toast on success/error
    // We can set a local message if needed, but toast might be enough.
    // If there's no authError from the context, it means the request was likely successful (or Firebase handled it)
    if (!authError) {
        setMessage("If an account with that email exists, a password reset link has been dispatched by Imperial Comms.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-2xl bg-card overflow-hidden">
        <CardHeader className="text-center items-center pt-8 pb-6 bg-muted/30">
          <MailQuestion className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-orbitron text-primary">Access Code Recovery</CardTitle>
          <CardDescription>Enter your Holonet email to receive recovery instructions.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-6">
            {message && !authError && (
              <Alert variant="default" className="border-green-500 bg-green-500/10">
                <Send className="h-4 w-4 text-green-500" />
                <AlertTitle>Instructions Sent</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {authError && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Recovery Failed</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Holonet Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="agent@empire.gov"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-6 bg-card-foreground/5">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base" disabled={authLoading}>
              {authLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              Send Recovery Link
            </Button>
            <p className="text-sm text-muted-foreground">
              Remembered your code?{' '}
              <Link href="/login" className="font-medium text-accent hover:underline">
                Return to Access Terminal
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}

