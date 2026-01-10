interface Script {
  id: string
  type: 'script'
  created_at: string
  hook: string
  script_text: string
  title?: string
  product_id?: string
}

interface SystemEvent {
  id: string
  event_type: string
  created_at: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  payload: Record<string, any>
}

export function createMockScript(overrides?: Partial<Script>): Script {
  return {
    id: 'script-' + Math.random().toString(36).substr(2, 9),
    type: 'script',
    created_at: new Date().toISOString(),
    hook: 'Test hook',
    script_text: 'Test script text',
    ...overrides,
  }
}

export function createMockSystemEvent(
  overrides?: Partial<SystemEvent>
): SystemEvent {
  return {
    id: 'event-' + Math.random().toString(36).substr(2, 9),
    event_type: 'agent.start',
    created_at: new Date().toISOString(),
    severity: 'info',
    payload: {},
    ...overrides,
  }
}
