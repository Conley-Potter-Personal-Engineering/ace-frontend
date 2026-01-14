'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { aceFetchValidated } from '@/lib/api'
import { authStorage } from '@/src/lib/authStorage'

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
})

const loginResponseSchema = z.object({
  token: z.string().optional(),
  user: userSchema,
})

const meResponseSchema = z.object({
  user: userSchema,
})

const logoutResponseSchema = z.union([z.object({}), z.null()]).optional()

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const normalizeAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('invalid') || message.includes('credential')) {
      return 'Invalid email or password.'
    }

    if (message.includes('unauthorized')) {
      return 'Your session is no longer valid. Please sign in again.'
    }

    if (message.includes('fetch') || message.includes('network')) {
      return 'Unable to reach the server. Please try again.'
    }
  }

  return 'Unable to sign in. Please try again.'
}

const buildAuthHeaders = (token: string | null): HeadersInit => {
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const authActionRef = useRef(0)

  const { mutateAsync: runCheckAuth, isPending: isCheckingAuth } = useMutation({
    mutationFn: async () => {
      const token = authStorage.getToken()

      return aceFetchValidated('/api/auth/me', meResponseSchema, {
        method: 'GET',
        headers: buildAuthHeaders(token),
        credentials: 'include',
      })
    },
    retry: false,
  })

  const { mutateAsync: runLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      return aceFetchValidated('/api/auth/login', loginResponseSchema, {
        method: 'POST',
        body: JSON.stringify(payload),
        credentials: 'include',
      })
    },
    retry: false,
  })

  const { mutateAsync: runLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      return aceFetchValidated('/api/auth/logout', logoutResponseSchema, {
        method: 'POST',
        credentials: 'include',
      })
    },
    retry: false,
  })

  const checkAuth = useCallback(async () => {
    const actionId = authActionRef.current

    try {
      const data = await runCheckAuth()

      if (authActionRef.current !== actionId) return

      setUser(data.user)
    } catch (error) {
      if (authActionRef.current !== actionId) return

      console.error('[auth] session check failed', error)
      authStorage.clearToken()
      setUser(null)
    }
  }, [runCheckAuth])

  const login = useCallback(
    async (email: string, password: string) => {
      authActionRef.current += 1

      try {
        const data = await runLogin({ email, password })

        if (data.token) {
          authStorage.setToken(data.token)
        }

        setUser(data.user)
      } catch (error) {
        console.error('[auth] login failed', error)
        authStorage.clearToken()
        setUser(null)
        throw new Error(normalizeAuthError(error))
      }
    },
    [runLogin]
  )

  const logout = useCallback(async () => {
    authActionRef.current += 1

    try {
      await runLogout()
    } catch (error) {
      console.error('[auth] logout failed', error)
    } finally {
      authStorage.clearToken()
      setUser(null)
    }
  }, [runLogout])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isCheckingAuth || isLoggingIn || isLoggingOut,
      login,
      logout,
      checkAuth,
    }),
    [user, isCheckingAuth, isLoggingIn, isLoggingOut, login, logout, checkAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
