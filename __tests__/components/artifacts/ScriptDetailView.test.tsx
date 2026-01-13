import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { ScriptDetailView, type ScriptArtifact } from '../../../components/artifacts/ScriptDetailView'
import { render, screen, waitFor } from '../../utils/test-utils'
import { server } from '../../mocks/server'
import { createMockScript } from '../../utils/mock-data'

const BASE_URL = 'http://localhost'

jest.mock('next/navigation', () => {
  const push = jest.fn()
  return {
    __esModule: true,
    useRouter: () => ({
      push,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    __mockPush: push,
  }
})

interface ExperimentRecord {
  id: string
  asset_id?: string | null
  asset_url?: string | null
  published?: boolean | null
  status?: string | null
  performance_score?: number | null
}

function mockScriptDetail(script: ScriptArtifact, experiments: ExperimentRecord[] = []) {
  // Centralize MSW handlers so each test only declares its data needs.
  server.use(
    http.get(`/api/artifacts/${script.id}`, () => {
      return HttpResponse.json({ success: true, data: script })
    }),
    http.get('/api/experiments', ({ request }) => {
      const scriptId = new URL(request.url).searchParams.get('script_id')
      const data = scriptId === script.id ? experiments : []
      return HttpResponse.json({ success: true, data })
    })
  )
}

describe('ScriptDetailView', () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const originalApiKey = process.env.NEXT_PUBLIC_API_KEY
  const { __mockPush } = jest.requireMock('next/navigation') as { __mockPush: jest.Mock }

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = BASE_URL
    process.env.NEXT_PUBLIC_API_KEY = 'test-key'
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalBaseUrl
    process.env.NEXT_PUBLIC_API_KEY = originalApiKey
  })

  beforeEach(() => {
    __mockPush.mockClear()
  })

  it('shows loading skeleton while fetching', () => {
    const script = createMockScript({ id: 'loading-script' }) as ScriptArtifact

    server.use(
      http.get('/api/artifacts/loading-script', () => {
        return HttpResponse.json({ success: true, data: script })
      })
    )

    const { container } = render(<ScriptDetailView scriptId="loading-script" />)

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('renders an error state when the fetch fails', async () => {
    server.use(
      http.get('/api/artifacts/error-script', () => {
        return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      })
    )

    render(<ScriptDetailView scriptId="error-script" />)

    await waitFor(() => {
      expect(screen.getByText('Unable to load script')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    expect(screen.getByText(/status 404/i)).toBeInTheDocument()
  })

  it('renders script data, metadata, and related experiments', async () => {
    const script = {
      ...createMockScript({
        id: 'script-123',
        hook: 'Amazing hook',
        script_text: 'Full script text',
        title: 'Launch Script',
      }),
      call_to_action: 'Shop now',
      product: {
        product_id: 'prod-1',
        name: 'ACE Widget',
      },
      creative_variables: { tone: 'bold', angle: 'demo' },
      agent_notes: [
        { content: 'Refine the opening line', timestamp: '2024-01-01T12:00:00.000Z' },
      ],
      trend_snapshots: [
        {
          snapshot_id: 'snap-1',
          platform: 'tiktok',
          snapshot_time: '2024-01-02T09:00:00.000Z',
        },
      ],
      pattern_ids: ['pattern-42'],
    } as ScriptArtifact

    const experiments: ExperimentRecord[] = [
      {
        id: 'exp-12345678',
        asset_id: 'asset-777',
        published: true,
        performance_score: 0.87,
      },
    ]

    mockScriptDetail(script, experiments)

    render(<ScriptDetailView scriptId={script.id} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Launch Script' })).toBeInTheDocument()
    })

    expect(screen.getByText('Hook')).toBeInTheDocument()
    expect(screen.getByText('Amazing hook')).toBeInTheDocument()
    expect(screen.getByText('Script Body')).toBeInTheDocument()
    expect(screen.getByText('Full script text')).toBeInTheDocument()
    expect(screen.getByText('Metadata')).toBeInTheDocument()
    expect(screen.getByText('ACE Widget')).toBeInTheDocument()
    expect(screen.getByText('Related Experiments')).toBeInTheDocument()
    expect(
      await screen.findByLabelText('View experiment exp-1234')
    ).toBeInTheDocument()
    expect(screen.getByText('Published')).toBeInTheDocument()
  })

  it('creates an asset and navigates on success', async () => {
    const script = createMockScript({ id: 'script-create', title: 'Create Script' }) as ScriptArtifact
    let receivedScriptId = ''

    mockScriptDetail(script)

    server.use(
      http.post('/api/agents/EditorAgent/run', async ({ request }) => {
        const body = (await request.json()) as { scriptId?: string }
        receivedScriptId = body.scriptId ?? ''
        return HttpResponse.json({ success: true, data: { asset_id: 'asset-99' } })
      })
    )

    const user = userEvent.setup()

    render(<ScriptDetailView scriptId={script.id} />)

    const createButton = await screen.findByRole('button', { name: /create asset/i })
    await user.click(createButton)

    await waitFor(() => {
      expect(__mockPush).toHaveBeenCalledWith('/artifacts/videos/asset-99')
    })

    expect(receivedScriptId).toBe(script.id)
  })

  it('confirms delete and navigates back to artifacts', async () => {
    const script = createMockScript({ id: 'script-delete', title: 'Delete Script' }) as ScriptArtifact

    mockScriptDetail(script)

    server.use(
      http.delete(`/api/artifacts/${script.id}`, () => {
        return HttpResponse.json({ success: true, data: null })
      })
    )

    const user = userEvent.setup()

    render(<ScriptDetailView scriptId={script.id} />)

    const deleteButton = await screen.findByRole('button', { name: /delete script/i })
    await user.click(deleteButton)

    const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(__mockPush).toHaveBeenCalledWith('/artifacts')
    })
  })
})
