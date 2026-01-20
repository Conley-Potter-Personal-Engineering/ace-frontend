'use client'

import { useEffect, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useAuth } from '@/src/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/sign-in' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.toString() ?? ''

  const redirectPath = useMemo(() => {
    if (!pathname) return '/'
    return search ? `${pathname}?${search}` : pathname
  }, [pathname, search])

  useEffect(() => {
    if (isLoading || isAuthenticated) return

    const separator = redirectTo.includes('?') ? '&' : '?'
    const target = `${redirectTo}${separator}redirect=${encodeURIComponent(redirectPath)}`
    router.replace(target)
  }, [isLoading, isAuthenticated, redirectPath, redirectTo, router])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void checkAuth()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = window.setInterval(() => {
      void checkAuth()
    }, 5 * 60 * 1000)

    return () => window.clearInterval(interval)
  }, [isAuthenticated, checkAuth])

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status" aria-live="polite">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
            aria-hidden="true"
          />
          <span>Checking session...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
