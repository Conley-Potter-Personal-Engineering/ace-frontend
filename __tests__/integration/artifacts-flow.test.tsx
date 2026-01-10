import React from 'react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import ArtifactsPage from '../../app/artifacts/page'
import { ScriptDetailView } from '../../components/artifacts/ScriptDetailView'
import { render, screen, waitFor } from '../utils/test-utils'
import { server } from '../mocks/server'
import { createMockScript } from '../utils/mock-data'

const BASE_URL = 'http://localhost'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, onClick, children, ...props }: any) => {
    const resolvedHref =
      typeof href === 'string' ? href : href?.pathname ?? href?.toString?.() ?? ''
    return (
      <a
        href={resolvedHref}
        onClick={(event) => {
          event.preventDefault()
          onClick?.(event)
          // Simulate app-router navigation for integration tests.
          const navigate = (window as any).__TEST_NAVIGATE__
          if (typeof navigate === 'function') {
            navigate(resolvedHref)
          }
        }}
        {...props}
      >
        {children}
      </a>
    )
  },
}))

function ArtifactsFlowHarness() {
  const [route, setRoute] = React.useState('/artifacts')

  React.useEffect(() => {
    // Allow Link mock to update route state without a real router.
    ;(window as any).__TEST_NAVIGATE__ = setRoute
    return () => {
      delete (window as any).__TEST_NAVIGATE__
    }
  }, [])

  if (route.startsWith('/artifacts/scripts/')) {
    const scriptId = route.split('/').pop() ?? ''
    return <ScriptDetailView scriptId={scriptId} />
  }

  return <ArtifactsPage />
}

describe('Artifacts Flow', () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const originalApiKey = process.env.NEXT_PUBLIC_API_KEY

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = BASE_URL
    process.env.NEXT_PUBLIC_API_KEY = 'test-key'
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl
    process.env.NEXT_PUBLIC_API_KEY = originalApiKey
  })

  it('navigates from the artifacts list to the script detail view', async () => {
    const user = userEvent.setup()
    const scripts = [
      createMockScript({ id: 'script-1', title: 'Script 1' }),
      createMockScript({ id: 'script-2', title: 'Script 2' }),
    ]

    server.use(
      http.get('/api/artifacts', () => {
        return HttpResponse.json({ success: true, data: scripts })
      }),
      http.get('/api/artifacts/script-1', () => {
        return HttpResponse.json({ success: true, data: scripts[0] })
      }),
      http.get('/api/experiments', () => {
        return HttpResponse.json({ success: true, data: [] })
      })
    )

    render(<ArtifactsFlowHarness />)

    await waitFor(() => {
      expect(screen.getByText('Script 1')).toBeInTheDocument()
    })

    const viewLinks = screen.getAllByRole('link', { name: /view/i })
    expect(viewLinks[0]).toHaveAttribute('href', '/artifacts/scripts/script-1')

    await user.click(viewLinks[0])

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Script 1' })
      ).toBeInTheDocument()
    })

    expect(screen.getByText('Script Body')).toBeInTheDocument()
    expect(screen.getByText('Test script text')).toBeInTheDocument()
  })
})
