# ACE Frontend AGENTS.md — Guidelines for Autonomous Coding Agents

This document defines how AI coding agents (e.g., OpenAI Codex, GitHub Copilot, GPT‑Engineer) should safely and effectively contribute to the **ACE Frontend** repository.

---

## 1. Purpose

This repo contains the **interactive UI layer** for ACE. Agents working here generate, modify, or maintain:
* React components
* API routes
* TypeScript models and hooks
* UI schemas for artifacts, workflows, and agents

AI agents must preserve design consistency, data integrity, and event traceability.

---

## 2. Core Principles

1. **Never bypass validation** — All API payloads and props must be type‑checked with Zod or TypeScript interfaces.
2. **Follow UI design tokens** — Colors, spacing, and typography are defined in `tailwind.config.js`.
3. **Log all actions** — Use `console.info('[agent]', message)` or telemetry events for important UI actions.
4. **Use modular composition** — Prefer small components with clear props.
5. **Keep code declarative** — Use functional React patterns; no manual DOM manipulation.
6. **Use Next.js conventions** — Page files in `/app` correspond to routes.
7. **Write tests** — Jest + React Testing Library for components and hooks.

---

## 3. Folder Structure

```
src/
  components/     → UI elements and cards
  hooks/          → Data logic (useQuery, useMutation)
  pages/          → Next.js routes
  lib/            → Supabase client, API wrappers
  styles/         → Tailwind + global styles
```

---

## 4. Coding Standards

### React Components
* Use `function` components with explicit return types.
* Type props via `interface`.
* Default export one component per file.
* Use Tailwind utility classes, not inline styles.

### Naming
* PascalCase for components.
* camelCase for variables and functions.
* snake_case only for Supabase tables.

### Example Component
```tsx
interface AgentCardProps {
  name: string;
  status: 'idle' | 'running' | 'error';
}

export function AgentCard({ name, status }: AgentCardProps) {
  return (
    <Card className="p-4 rounded-xl">
      <h2 className="font-semibold text-lg">{name}</h2>
      <span className={status === 'error' ? 'text-red-500' : 'text-green-500'}>
        {status}
      </span>
    </Card>
  );
}
```

---

## 5. Data and API Rules

1. Use `/lib/api.ts` to interact with ACE Orchestrator endpoints.
2. Use Supabase client from `/lib/supabase.ts` for querying stored data.
3. Never fetch directly from external URLs without validation.
4. All API routes return JSON with `success` and `data` fields.
5. Handle all async errors with `try/catch` and display graceful UI fallbacks.

---

## 6. Events and Telemetry

Frontend telemetry events mirror backend `system_events` types:
```
ui.agent.run
ui.workflow.trigger
ui.artifact.view
ui.feedback.submit
```

Emit these to Supabase or console for traceability.

---

## 7. Adding New Features

When creating new UI modules:
1. Create a component under `/components/<domain>/`.
2. Add a page route under `/app/` if navigable.
3. Define Zod schemas for props or responses.
4. Add mock data in `/__mocks__/` for testing.
5. Include events and feedback instrumentation.

---

## 8. When Uncertain

If an agent is unsure about:
* a missing type
* ambiguous API response
* undefined component contract
* unclear UX behavior

Then:
1. Stop execution.
2. Propose a plan.
3. Request clarification.
4. Resume only after confirmation.

---

## 9. Summary

This `AGENTS.md` equips autonomous coding agents with the conventions and boundaries for safely extending the ACE Frontend.  
Adherence ensures consistency across UI, predictable behavior, and reliable integration with the ACE backend.

