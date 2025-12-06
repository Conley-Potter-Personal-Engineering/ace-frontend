'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ACE_AUTH_TOKEN_KEY, ACE_AUTH_USER_KEY, aceFetch } from './api';

type AuthUser = {
  id: string;
  email?: string | null;
  [key: string]: unknown;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseStoredUser(value: string | null): AuthUser | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch (error) {
    console.info('[agent]', 'error: failed to parse stored user', error);
    return null;
  }
}

function readStoredSession(): { token: string | null; user: AuthUser | null } {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { token: null, user: null };
  }
  return {
    token: localStorage.getItem(ACE_AUTH_TOKEN_KEY),
    user: parseStoredUser(localStorage.getItem(ACE_AUTH_USER_KEY)),
  };
}

function persistSession(token: string, user: AuthUser): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.setItem(ACE_AUTH_TOKEN_KEY, token);
  localStorage.setItem(ACE_AUTH_USER_KEY, JSON.stringify(user));
}

function clearStoredSession(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.removeItem(ACE_AUTH_TOKEN_KEY);
  localStorage.removeItem(ACE_AUTH_USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from localStorage on mount and listen for cross-tab changes.
  useEffect(() => {
    const { token, user: storedUser } = readStoredSession();
    if (token && storedUser) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
    setIsLoading(false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACE_AUTH_TOKEN_KEY || event.key === ACE_AUTH_USER_KEY) {
        const { token: nextToken, user: nextUser } = readStoredSession();
        setUser(nextToken && nextUser ? nextUser : null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { token, user: nextUser } = await aceFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      persistSession(token, nextUser);
      setUser(nextUser);
    } catch (error) {
      console.info('[agent]', 'error: login failed', error);
      clearStoredSession();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await aceFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.info('[agent]', 'error: logout failed', error);
    } finally {
      clearStoredSession();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
