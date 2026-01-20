'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/src/hooks/useAuth'
import { isWebAuthnSupported } from '@/src/lib/webauthn'

const credentialsSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

type AuthStep = 'credentials' | 'passkey'

export function SignInPage() {
  const { login, authenticateWithPasskey, checkAuth, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams?.get('redirect') ?? ''

  const redirectTarget = useMemo(() => {
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam
    }

    return '/'
  }, [redirectParam])

  const [step, setStep] = useState<AuthStep>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [passkeyError, setPasskeyError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasskeyPending, setIsPasskeyPending] = useState(false)
  const [passkeySupported, setPasskeySupported] = useState(true)
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isToastVisible, setIsToastVisible] = useState(false)
  const passkeyButtonRef = useRef<HTMLButtonElement>(null)
  const toastTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  useEffect(() => {
    setPasskeySupported(isWebAuthnSupported())
  }, [])

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    router.replace(redirectTarget)
  }, [isLoading, isAuthenticated, redirectTarget, router])

  useEffect(() => {
    if (step === 'passkey') {
      passkeyButtonRef.current?.focus()
    }
  }, [step])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    setIsToastVisible(true)

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setIsToastVisible(false)
    }, 4000)
  }, [])

  const handlePasskey = useCallback(async () => {
    if (!passkeySupported) {
      setPasskeyError('Passkeys are not supported in this browser.')
      return
    }

    setPasskeyError(null)
    setIsPasskeyPending(true)

    try {
      await authenticateWithPasskey()
      router.replace(redirectTarget)
    } catch (error) {
      setPasskeyError(getErrorMessage(error, 'Unable to authenticate with passkey.'))
    } finally {
      setIsPasskeyPending(false)
    }
  }, [authenticateWithPasskey, passkeySupported, redirectTarget, router])

  useEffect(() => {
    if (step !== 'passkey' || !passkeySupported || hasAutoPrompted) return

    setHasAutoPrompted(true)
    void handlePasskey()
  }, [handlePasskey, hasAutoPrompted, passkeySupported, step])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setPasskeyError(null)

    const validation = credentialsSchema.safeParse({ email, password })

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await login(validation.data.email, validation.data.password)

      if (response.requiresTwoFactor) {
        setStep('passkey')
        setHasAutoPrompted(false)
        return
      }

      const confirmed = await checkAuth()

      if (!confirmed) {
        const message = 'Unable to confirm your session. Please try again.'
        setFormError(message)
        showToast(message)
        return
      }

      router.replace(redirectTarget)
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to sign in. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToCredentials = () => {
    setStep('credentials')
    setFormError(null)
    setPasskeyError(null)
  }

  const isBusy = isLoading || isSubmitting || isPasskeyPending

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      {isToastVisible ? (
        <div className="fixed inset-x-4 top-6 z-50 mx-auto flex max-w-md justify-center">
          <div
            className="pointer-events-auto w-full rounded-md border border-border/70 bg-card/95 px-4 py-3 text-sm text-foreground shadow-soft backdrop-blur"
            role="status"
            aria-live="polite"
          >
            {toastMessage}
          </div>
        </div>
      ) : null}
      <Card className="w-full max-w-md bg-card/80 shadow-soft">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Access the ACE Command Center.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'credentials' ? (
            <form className="space-y-4" onSubmit={handleSubmit} aria-busy={isBusy}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  disabled={isBusy}
                  required
                />
                {fieldErrors.email ? (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  disabled={isBusy}
                  required
                />
                {fieldErrors.password ? (
                  <p id="password-error" className="text-sm text-destructive" role="alert">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              {formError ? (
                <div
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  {formError}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={isBusy}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4" aria-busy={isBusy}>
              <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-3 text-sm text-foreground">
                Authenticate with your passkey to finish signing in.
              </div>

              {!passkeySupported ? (
                <div
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  Passkeys are not supported in this browser.
                </div>
              ) : null}

              {passkeyError ? (
                <div
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  {passkeyError}
                </div>
              ) : null}

              <Button
                ref={passkeyButtonRef}
                type="button"
                className="w-full"
                onClick={handlePasskey}
                disabled={!passkeySupported || isBusy}
              >
                {isPasskeyPending ? 'Waiting for passkey...' : 'Authenticate with passkey'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBackToCredentials}
                disabled={isBusy}
              >
                Use a different account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
