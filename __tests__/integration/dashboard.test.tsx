import { useEffect } from 'react'
import { http, HttpResponse } from 'msw'

import { render, screen, waitFor, act } from '../utils/test-utils'
import { server } from '../mocks/server'
import { createMockSystemEvent } from '../utils/mock-data'
import { useSystemEvents } from '../../lib/hooks/useSystemEvents'

const BASE_URL = 'http://localhost'

interface SystemEventRecord {
  id?: string
  event_id?: string
  event_type?: string
}

function DashboardHarness() {
  const { data, isLoading, error, refetch } = useSystemEvents()

  // Simple polling pattern that mirrors dashboard refresh behavior.
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch()
    }, 30000)
    return () => clearInterval(intervalId)
  }, [refetch])

  if (isLoading) {
    return <p>Loading events...</p>
  }

  if (error) {
    return <p role="alert">Failed to load events</p>
  }

  const events = (data as SystemEventRecord[] | undefined) ?? []

  return (
    <section>
      <h1>Recent System Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id ?? event.event_id}>{event.event_type ?? 'Unknown event'}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

describe('Dashboard Polling', () => {
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

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('polls for new events and renders updates', async () => {
    let callCount = 0
    const initialEvents = [createMockSystemEvent({ id: 'event-1', event_type: 'agent.start' })]
    const updatedEvents = [
      createMockSystemEvent({ id: 'event-1', event_type: 'agent.start' }),
      createMockSystemEvent({ id: 'event-2', event_type: 'agent.complete' }),
    ]

    server.use(
      http.get('/api/system-events', () => {
        callCount += 1
        const data = callCount === 1 ? initialEvents : updatedEvents
        return HttpResponse.json({ success: true, data })
      })
    )

    render(<DashboardHarness />)

    await waitFor(() => {
      expect(screen.getByText('agent.start')).toBeInTheDocument()
    })

    act(() => {
      jest.advanceTimersByTime(30000)
    })

    await waitFor(() => {
      expect(screen.getByText('agent.complete')).toBeInTheDocument()
    })
  })

  it('shows an error message when the dashboard fails to load', async () => {
    server.use(
      http.get('/api/system-events', () => {
        return HttpResponse.json({ success: false, error: 'Downstream error' })
      })
    )

    render(<DashboardHarness />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load events')
    })
  })
})
