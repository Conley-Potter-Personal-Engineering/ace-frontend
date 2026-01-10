import { http, HttpResponse } from 'msw'

import { aceFetch } from '../../lib/api'
import { server } from '../mocks/server'

const BASE_URL = 'http://localhost'

describe('aceFetch', () => {
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

  it('makes GET requests and includes required headers', async () => {
    let requestMethod = ''
    let apiKeyHeader = ''

    server.use(
      http.get('/api/health', ({ request }) => {
        requestMethod = request.method
        apiKeyHeader = request.headers.get('x-api-key') ?? ''
        return HttpResponse.json({ success: true, data: { status: 'ok' } })
      })
    )

    const data = await aceFetch<{ status: string }>('/api/health')

    expect(data).toEqual({ status: 'ok' })
    expect(requestMethod).toBe('GET')
    expect(apiKeyHeader).toBe('test-key')
  })

  it('makes POST requests with a JSON body', async () => {
    let receivedBody: unknown = null

    server.use(
      http.post('/api/submit', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ success: true, data: { saved: true } })
      })
    )

    const payload = { name: 'ACE', priority: 'high' }
    const data = await aceFetch<{ saved: boolean }>('/api/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    expect(receivedBody).toEqual(payload)
    expect(data).toEqual({ saved: true })
  })

  it('throws on non-200 responses', async () => {
    server.use(
      http.get('/api/fail', () => {
        return HttpResponse.json({ success: false, error: 'Boom' }, { status: 500 })
      })
    )

    await expect(aceFetch('/api/fail')).rejects.toThrow(
      'API request failed with status 500'
    )
  })

  it('throws when the response envelope reports failure', async () => {
    server.use(
      http.get('/api/envelope-error', () => {
        return HttpResponse.json({ success: false, error: 'Not allowed' })
      })
    )

    await expect(aceFetch('/api/envelope-error')).rejects.toThrow('Not allowed')
  })

  it('surfaces network errors', async () => {
    server.use(
      http.get('/api/network-error', () => {
        return HttpResponse.error()
      })
    )

    await expect(aceFetch('/api/network-error')).rejects.toThrow()
  })
})
