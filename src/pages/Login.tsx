'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/src/hooks/useAuth'

const credentialsSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to sign in. Please try again.'
}

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams?.get('redirect') ?? ''

  const redirectTarget = useMemo(() => {
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam
    }

    return '/'
  }, [redirectParam])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    router.replace(redirectTarget)
  }, [isLoading, isAuthenticated, redirectTarget, router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

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
      await login(validation.data.email, validation.data.password)
      router.replace(redirectTarget)
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md bg-card/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Access the ACE Command Center.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit} aria-busy={isLoading || isSubmitting}>
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

            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
