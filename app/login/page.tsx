'use client';

import { type FormEvent, type ReactElement, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthProvider, useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

function LoginCard(): ReactElement {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClasses = useMemo(
    () =>
      cn(
        'w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm text-foreground shadow-soft',
        'transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
        'placeholder:text-muted-foreground'
      ),
    []
  );

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      const message =
        err instanceof Error && err.message ? err.message : 'Unable to sign in right now.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center">
      <Card className="w-full max-w-xl border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Sign in to ACE</CardTitle>
          <CardDescription>
            Use your ACE credentials to access the dashboard. Tokens are stored locally for fast
            reconnects.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClasses}
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClasses}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading || !email || !password}
            >
              {isSubmitting ? 'Signing in…' : isLoading ? 'Checking session…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage(): ReactElement {
  return (
    <AuthProvider>
      <div className="flex min-h-[60vh] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(237,197,49,0.15),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(146,108,21,0.12),transparent_34%)] px-6 py-10">
        <LoginCard />
      </div>
    </AuthProvider>
  );
}
