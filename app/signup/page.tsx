'use client';

import { useState, type FormEvent, type ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { aceFetch } from '@/lib/api';

function SignupContent(): ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const signupMutation = useMutation<unknown, Error, { email: string; password: string }>({
    mutationFn: (payload) =>
      aceFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      setSuccessMessage('Account created! Check your email for verification.');
      setError(null);
    },
    onError: (err) => {
      console.info('[agent]', 'error:', err);
      setSuccessMessage(null);
      setError(err.message || 'Unable to create an account right now.');
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await signupMutation.mutateAsync({ email, password });
    } catch {
      // Error state handled in onError
    }
  };

  const isSubmitting = signupMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(237,197,49,0.15),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(146,108,21,0.12),transparent_34%)] px-6 py-10">
      <Card className="w-full max-w-xl border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Create your ACE account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {successMessage && (
            <div
              role="status"
              className="rounded-md border border-green-400/60 bg-green-500/10 px-4 py-3 text-sm text-green-100"
            >
              {successMessage}{' '}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => router.push('/login')}
              >
                Go to login
              </button>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !email || !password || !confirmPassword}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignupPage(): ReactElement {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SignupContent />
    </QueryClientProvider>
  );
}
