# ACE Frontend AGENTS.md — Updated API Integration Rules

This file defines the conventions AI coding agents (e.g., Codex, Copilot, GPT Engineer) must follow in the **ACE Frontend (v2)**.

---

## 1. Purpose

The frontend now uses the **ACE Backend API** as its sole data source.  
Agents should never query Supabase directly — all communication occurs via the backend endpoints.

---

## 2. Core Directives

1. **Do not use Supabase client.**
2. **All data must be fetched through `/lib/api.ts`.**
3. **Each fetch must include `x-api-key` header.**
4. **Use React Query hooks for all data access.**
5. **Handle `{ success, data, error }` response patterns.**
6. **Never manipulate DOM directly.**
7. **Preserve UI style consistency (Tailwind + shadcn).**

---

## 3. API Endpoints Map

| Purpose | Method | Endpoint | Hook |
|----------|---------|----------|------|
| List agents | GET | `/api/agents` | `useAgents()` |
| Run agent | POST | `/api/agents/[name]/run` | `useRunAgent()` |
| List workflows | GET | `/api/workflows` | `useWorkflows()` |
| Start workflow | POST | `/api/workflows/[id]/start` | `useStartWorkflow()` |
| List artifacts | GET | `/api/artifacts` | `useArtifacts()` |
| Get artifact detail | GET | `/api/artifacts/[id]` | `useArtifact(id)` |
| Submit feedback | POST | `/api/feedback` | `useSubmitFeedback()` |
| Get system events | GET | `/api/system-events` | `useSystemEvents()` |

---

## 4. lib/api.ts Example

```ts
export async function aceFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? 'dev',
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API Error');
  return json.data;
}
```

---

## 5. Hook Example

```ts
import { useQuery } from '@tanstack/react-query';
import { aceFetch } from '@/lib/api';

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => aceFetch('/api/agents'),
  });
}
```

---

## 6. Error Handling

- Always wrap UI async logic in `try/catch`.
- Display user-friendly fallback messages.
- Log `console.info('[agent]', 'error: ...')` for visibility.

---

## 7. Telemetry

Emit frontend telemetry mirroring backend `system_events`, e.g.:
```
ui.workflow.trigger
ui.agent.run
ui.feedback.submit
ui.artifact.view
```

---

## 8. Summary

Frontend AI agents must route all operations through backend API layers to ensure safety, observability, and consistency with the ACE architecture.
