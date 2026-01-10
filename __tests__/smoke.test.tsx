import { render, screen, waitFor } from './utils/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from './mocks/server'
import React from 'react'

// Simple test component
function TestComponent() {
  const [data, setData] = React.useState<{ message: string } | null>(null)

  React.useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then(setData)
  }, [])

  return <div>{data ? data.message : 'Loading...'}</div>
}

describe('Test Infrastructure Smoke Test', () => {
  it('should render components with providers', () => {
    render(<div>Hello World</div>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it.skip('should mock API calls with MSW', async () => {
    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json({ message: 'Test successful' })
      })
    )

    render(<TestComponent />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Test successful')).toBeInTheDocument()
    })
  })
})
