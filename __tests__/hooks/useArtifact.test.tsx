import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { http, HttpResponse } from 'msw'

import { useArtifact } from '../../lib/hooks/useArtifact'
import { server } from '../mocks/server'
import { createMockScript } from '../utils/mock-data'

const BASE_URL = 'http://localhost'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  })
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    // Provide a fresh QueryClient per test to avoid cache bleed.
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useArtifact', () => {
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

  it('fetches artifact data successfully', async () => {
    const script = createMockScript({ id: 'artifact-1', hook: 'Strong hook' })

    server.use(
      http.get('/api/artifacts/artifact-1', () => {
        return HttpResponse.json({ success: true, data: script })
      })
    )

    const queryClient = createQueryClient()
    const { result } = renderHook(() => useArtifact('artifact-1'), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(script)
  })

  it('reports loading state while fetching', async () => {
    const queryClient = createQueryClient()
    const { result } = renderHook(() => useArtifact('loading-id'), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isFetching).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('handles error state when API fails', async () => {
    server.use(
      http.get('/api/artifacts/error-case', () => {
        return HttpResponse.json({ success: false, error: 'Not found' })
      })
    )

    const queryClient = createQueryClient()
    const { result } = renderHook(() => useArtifact('error-case'), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('Not found')
  })

  it('uses the correct query key and endpoint', async () => {
    const script = createMockScript({ id: 'key-test' })
    let requestedPath = ''

    server.use(
      http.get('/api/artifacts/key-test', ({ request }) => {
        requestedPath = new URL(request.url).pathname
        return HttpResponse.json({ success: true, data: script })
      })
    )

    const queryClient = createQueryClient()
    const { result } = renderHook(() => useArtifact('key-test'), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(requestedPath).toBe('/api/artifacts/key-test')
    expect(queryClient.getQueryState(['artifact', 'key-test'])).toBeDefined()
  })

  it('does not fetch when id is empty', () => {
    const queryClient = createQueryClient()
    const fetchSpy = jest.spyOn(global, 'fetch')

    const { result } = renderHook(() => useArtifact(''), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current.isFetching).toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })

  it('refetches when id changes', async () => {
    const first = createMockScript({ id: 'first' })
    const second = createMockScript({ id: 'second' })

    server.use(
      http.get('/api/artifacts/first', () => {
        return HttpResponse.json({ success: true, data: first })
      }),
      http.get('/api/artifacts/second', () => {
        return HttpResponse.json({ success: true, data: second })
      })
    )

    const queryClient = createQueryClient()
    const { result, rerender } = renderHook(({ id }) => useArtifact(id), {
      initialProps: { id: 'first' },
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => {
      expect(result.current.data?.id).toBe('first')
    })

    rerender({ id: 'second' })

    await waitFor(() => {
      expect(result.current.data?.id).toBe('second')
    })
  })
})
