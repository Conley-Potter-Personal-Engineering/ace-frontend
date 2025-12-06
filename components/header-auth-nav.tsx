'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button, buttonVariants } from './ui/button';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function HeaderAuthNav(): JSX.Element {
  const { user, logout, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsSigningOut(true);
    try {
      await logout();
    } catch (error) {
      console.info('[agent]', 'error: logout failed', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-end gap-3 text-right sm:flex-row sm:items-center sm:gap-4">
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Signed in</p>
          <p className="text-base font-semibold">{user.email ?? 'Authenticated user'}</p>
        </div>
        <Button
          type="button"
          aria-label="Log out of ACE"
          variant="outline"
          size="sm"
          className="shadow-soft hover:bg-primary/10"
          onClick={() => {
            void handleLogout();
          }}
          disabled={isSigningOut || isLoading}
        >
          {isSigningOut ? 'Signing out…' : 'Logout'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
      <Link
        href="/login"
        aria-label="Go to login"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'text-foreground hover:bg-primary/10'
        )}
      >
        Login
      </Link>
      <Link
        href="/signup"
        aria-label="Create an ACE account"
        className={cn(
          buttonVariants({ variant: 'default', size: 'sm' }),
          'shadow-soft hover:shadow-md'
        )}
      >
        Sign Up
      </Link>
    </div>
  );
}
