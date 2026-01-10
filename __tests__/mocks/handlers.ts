import { http, HttpResponse } from 'msw'
import { createMockScript, createMockSystemEvent } from '../utils/mock-data'

export const handlers = [
  http.get('/api/artifacts/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: createMockScript({ id: params.id as string }),
    })
  }),

  http.get('/api/system-events', () => {
    return HttpResponse.json({
      success: true,
      data: [createMockSystemEvent(), createMockSystemEvent(), createMockSystemEvent()],
    })
  }),

  // Error scenario
  http.get('/api/artifacts/error-test', () => {
    return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }),
]
