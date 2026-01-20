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

import type { User } from '@/src/lib/authApi'
import {
  finishPasskeyAuthentication,
  finishPasskeyRegistration,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession as refreshSessionRequest,
  startPasskeyAuthentication,
  startPasskeyRegistration,
} from '@/src/lib/authApi'
import {
  getWebAuthnErrorMessage,
  startPasskeyAuthentication as createPasskeyAssertion,
  startPasskeyRegistration as createPasskeyAttestation,
} from '@/src/lib/webauthn'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ requiresTwoFactor: boolean }>
  authenticateWithPasskey: () => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  registerPasskey?: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const refreshIntervalMs = 10 * 60 * 1000

const normalizeAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (
      message.includes('invalid') ||
      message.includes('credential') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('401') ||
      message.includes('403')
    ) {
      return 'Invalid email or password.'
    }

    if (message.includes('rate')) {
      return 'Too many attempts. Please wait and try again.'
    }

    if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
      return 'Unable to reach the server. Please try again.'
    }

    if (error.message) {
      return error.message
    }
  }

  return 'Unable to sign in. Please try again.'
}

const normalizePasskeyError = (error: unknown): string => {
  return getWebAuthnErrorMessage(error)
}

const shouldClearSession = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('expired') ||
    message.includes('session') ||
    message.includes('401') ||
    message.includes('403')
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const authEpochRef = useRef(0)

  const { mutateAsync: runCheckAuth, isPending: isCheckingAuth } = useMutation({
    mutationFn: getCurrentUser,
    retry: false,
  })

  const { mutateAsync: runLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: loginRequest,
    retry: false,
  })

  const { mutateAsync: runLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutRequest,
    retry: false,
  })

  const { mutateAsync: runPasskeyAuth, isPending: isAuthenticating } = useMutation({
    mutationFn: async () => {
      const { publicKey } = await startPasskeyAuthentication()
      const assertion = await createPasskeyAssertion(publicKey)
      const { user: nextUser } = await finishPasskeyAuthentication(assertion)
      return nextUser
    },
    retry: false,
  })

  const { mutateAsync: runPasskeyRegistration, isPending: isRegistering } = useMutation({
    mutationFn: async () => {
      const { publicKey } = await startPasskeyRegistration()
      const attestation = await createPasskeyAttestation(publicKey)
      const { user: nextUser } = await finishPasskeyRegistration(attestation)
      return nextUser ?? null
    },
    retry: false,
  })

  const { mutateAsync: runRefresh, isPending: isRefreshing } = useMutation({
    mutationFn: refreshSessionRequest,
    retry: false,
  })

  const checkAuth = useCallback(async () => {
    const requestId = authEpochRef.current

    try {
      const data = await runCheckAuth()

      if (authEpochRef.current !== requestId) return false

      setUser(data.user)
      return true
    } catch (error) {
      if (authEpochRef.current !== requestId) return false

      console.error('[auth] session check failed', error)

      if (shouldClearSession(error)) {
        setUser(null)
      }
      return false
    } finally {
      if (authEpochRef.current === requestId) {
        setHasCheckedAuth(true)
      }
    }
  }, [runCheckAuth])

  const login = useCallback(
    async (email: string, password: string) => {
      authEpochRef.current += 1

      try {
        const response = await runLogin({ email, password })

        return { requiresTwoFactor: response.requiresTwoFactor }
      } catch (error) {
        console.error('[auth] login failed', error)

        if (shouldClearSession(error)) {
          setUser(null)
        }

        throw new Error(normalizeAuthError(error))
      }
    },
    [runLogin]
  )

  const authenticateWithPasskey = useCallback(async () => {
    authEpochRef.current += 1
    const requestId = authEpochRef.current

    try {
      const nextUser = await runPasskeyAuth()

      if (authEpochRef.current !== requestId) return

      setUser(nextUser)
    } catch (error) {
      if (authEpochRef.current !== requestId) return

      console.error('[auth] passkey authentication failed', error)
      setUser(null)
      throw new Error(normalizePasskeyError(error))
    }
  }, [runPasskeyAuth])

  const registerPasskey = useCallback(async () => {
    authEpochRef.current += 1
    const requestId = authEpochRef.current

    try {
      const nextUser = await runPasskeyRegistration()

      if (authEpochRef.current !== requestId) return

      if (nextUser) {
        setUser(nextUser)
      }
    } catch (error) {
      if (authEpochRef.current !== requestId) return

      console.error('[auth] passkey registration failed', error)
      throw new Error(normalizePasskeyError(error))
    }
  }, [runPasskeyRegistration])

  const refreshSession = useCallback(async () => {
    const requestId = authEpochRef.current

    try {
      const data = await runRefresh()

      if (authEpochRef.current !== requestId) return

      if (data.user) {
        setUser(data.user)
      }
    } catch (error) {
      if (authEpochRef.current !== requestId) return

      console.error('[auth] session refresh failed', error)

      if (shouldClearSession(error)) {
        setUser(null)
      }
    }
  }, [runRefresh])

  const logout = useCallback(async () => {
    authEpochRef.current += 1

    try {
      await runLogout()
    } catch (error) {
      console.error('[auth] logout failed', error)
    } finally {
      setUser(null)
    }
  }, [runLogout])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!user) return

    const interval = window.setInterval(() => {
      void refreshSession()
    }, refreshIntervalMs)

    return () => window.clearInterval(interval)
  }, [user, refreshSession])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading:
        !hasCheckedAuth ||
        isCheckingAuth ||
        isLoggingIn ||
        isAuthenticating ||
        isRegistering ||
        isRefreshing ||
        isLoggingOut,
      login,
      authenticateWithPasskey,
      logout,
      checkAuth,
      registerPasskey,
    }),
    [
      user,
      hasCheckedAuth,
      isCheckingAuth,
      isLoggingIn,
      isAuthenticating,
      isRegistering,
      isRefreshing,
      isLoggingOut,
      login,
      authenticateWithPasskey,
      logout,
      checkAuth,
      registerPasskey,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
