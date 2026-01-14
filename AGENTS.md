# [AGENTS.md](http://AGENTS.md) — ACE Frontend

This file defines the conventions and context that AI coding agents must follow when working on the **ACE Command Center Frontend**.

---

## 1. Project Overview

**ACE Command Center** is an operational dashboard for monitoring and controlling an autonomous content engine (ACE). It is NOT a marketing site or content tool—it is an **operational interface** for system monitoring, agent control, and telemetry investigation.

**Tech Stack:**

- Next.js 13+ (App Router)
- TypeScript (strict mode)
- React 18+
- React Query (TanStack Query) for data fetching
- Tailwind CSS for styling
- shadcn/ui or Radix UI for component primitives

**Architecture Principles:**

1. **Backend API is the single source of truth** — never query Supabase directly
2. **All data via React Query hooks** wrapping the `aceFetch` helper
3. **Design system enforces operational, calm aesthetic** — clarity over decoration
4. **Accessibility is required** — WCAG AA minimum, keyboard nav, semantic HTML
5. **Test everything** — Jest, React Testing Library, MSW for API mocking

---

## 2. Design System

### 2.1 Design Principles

**Calm Authority**

- Favor clarity over decoration
- Use space and hierarchy to communicate importance
- Avoid visual noise that distracts from system state

**Operational Focus**

- Prioritize actionable information and clear status indicators
- Surface errors and alerts without alarm
- Make agent and workflow states immediately visible

**System Intelligence**

- Reflect the learning and evolution happening beneath the surface
- Show connections between agents, workflows, and artifacts

**Accessible Depth**

- Essential information at a glance
- Progressive disclosure for technical details
- Allow both high-level monitoring and deep investigation

### 2.2 Color Palette

**Primary Colors:**

- Deep Slate: `#1e293b` (primary backgrounds, headers)
- Bright Cyan: `#06b6d4` (primary actions, links, success states)
- Soft Lavender: `#a78bfa` (secondary accents, metadata)
- Warm Amber: `#f59e0b` (warnings, attention states)

**Neutrals:**

- Ink: `#0f172a` (darkest backgrounds)
- Charcoal: `#334155` (secondary backgrounds, borders)
- Slate: `#64748b` (secondary text, disabled states)
- Fog: `#cbd5e1` (dividers, subtle borders)
- Mist: `#f1f5f9` (light backgrounds, hover states)
- Snow: `#ffffff` (lightest backgrounds, cards)

**Semantic Colors (System State):**

- Success: `#10b981` (green) — completed operations, healthy states
- Warning: `#f59e0b` (amber) — attention needed, non-critical issues
- Error: `#ef4444` (red) — failures, critical alerts
- Info: `#3b82f6` (blue) — informational messages, neutral states
- Running: `#8b5cf6` (purple) — in-progress operations, active workflows

**Agent State Colors:**

- Idle: `#64748b` (slate) — agent available but not running
- Active: `#8b5cf6` (purple) — agent currently executing
- Success: `#10b981` (green) — agent completed successfully
- Error: `#ef4444` (red) — agent failed

**Event Severity Colors:**

- Debug: `#94a3b8` (light slate)
- Info: `#3b82f6` (blue)
- Warning: `#f59e0b` (amber)
- Error: `#ef4444` (red)
- Critical: `#dc2626` (dark red)

**Usage Guidelines:**

- Use **Bright Cyan** sparingly for primary actions only
- Reserve **semantic colors** exclusively for system state communication
- Maintain **4.5:1 contrast ratio** minimum for text (WCAG AA)
- Use **Fog** for subtle dividers; **Charcoal** for prominent borders

### 2.3 Typography

**Font Stacks:**

```css
/* UI Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Code, IDs, Technical Data */
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

**Type Scale:**

- Display: 32px / 700 weight / 1.2 line-height (page titles, dashboard headers)
- Heading 1: 24px / 600 / 1.3 (section headers)
- Heading 2: 20px / 600 / 1.4 (subsection headers, card titles)
- Heading 3: 16px / 600 / 1.5 (component headers, labels)
- Body Large: 16px / 400 / 1.6 (primary content, descriptions)
- Body: 14px / 400 / 1.5 (default body text, list items)
- Body Small: 13px / 400 / 1.5 (secondary text, metadata)
- Caption: 12px / 400 / 1.4 (timestamps, helper text, footnotes)
- Code: 14px / 400 / 1.5 (code blocks, UUIDs, technical identifiers)

**Font Weights:**

- 400 (Regular): default body text
- 500 (Medium): emphasis, labels, navigation
- 600 (Semibold): headings, buttons, important UI elements
- 700 (Bold): display text, alerts, critical information

### 2.4 Spacing System

**Base Unit:** 8px

**Spacing Tokens:**

- `xs`: 4px (tight spacing between related elements)
- `sm`: 8px (default gap between inline elements)
- `md`: 16px (standard component padding, gaps)
- `lg`: 24px (section spacing, card padding)
- `xl`: 32px (major section breaks)
- `2xl`: 48px (page-level spacing)
- `3xl`: 64px (large gutters, hero spacing)

**Layout Guidelines:**

- Card padding: `lg` (24px)
- Button padding: `md` horizontal (16px), `sm` vertical (8px) for standard
- Section spacing: `xl` (32px) between major sections
- List item spacing: `sm` (8px) between items
- Form field spacing: `md` (16px) between fields

### 2.5 Components

**Buttons:**

- Primary: Bright Cyan background, Snow text, 600 weight, 6px border-radius
- Secondary: transparent background, 1px Charcoal border, Bright Cyan text
- Danger: Error background, Snow text (for destructive actions)
- Ghost: transparent background, Slate text, Mist hover (for tertiary actions)

**Cards:**

- Standard: Snow/Deep Slate background, 1px Fog border, 8px border-radius, lg padding
- Interactive: add hover state with subtle lift and shadow increase
- Status: add 4px colored left border matching status, 5% opacity background tint

**Status Badges:**

- Small inline component for displaying state
- Background: status color at 20% opacity
- Text: status color (darkened for contrast)
- Border radius: 12px (fully rounded)
- Padding: 4px 10px
- Font size: Caption (12px), 500 weight

**Icons:**

- Use **Heroicons** or **Lucide Icons**
- Sizes: xs (12px), sm (16px), md (20px), lg (24px), xl (32px)
- Agent icons:
    - ScriptwriterAgent: ✍️ (pen/document)
    - EditorAgent: 🎬 (film/scissors)
    - PublisherAgent: 🚀 (upload/send)
    - ResearchAgent: 🔍 (chart/trend)
    - AnalystAgent: 📊 (bar-chart)
    - OptimizationAgent: ⚙️ (settings/tuning)

**Tables:**

- Header: Charcoal background, medium weight text
- Row: Snow background, alternating subtle Mist for zebra striping (optional)
- Border: 1px solid Fog between rows
- Padding: sm (8px) vertical, md (16px) horizontal
- Hover: Mist background

**Forms:**

- Input: Snow/Mist background, 1px Fog border, 6px border-radius, sm/md padding
- Focus: 2px Bright Cyan outline at 50% opacity
- Label: Body Small (13px), 500 weight, Charcoal color, xs margin-bottom
- Error: Error border color, Error helper text

---

## 3. Navigation & Information Architecture

### 3.1 User Mental Model

Users understand ACE through these primary abstractions:

**Agents:** Specialized AI workers (ScriptwriterAgent, EditorAgent, PublisherAgent, etc.) that can be run individually and emit events

**Workflows:** Coordinated sequences of agent actions orchestrated by n8n (Content Cycle, Analytics Ingestion, Optimization Cycle, etc.)

**Artifacts:** Creative outputs (scripts, video assets, published posts) linked through experiments

**Telemetry:** System events, agent notes, performance metrics showing what happened and when

**Experiments:** The link between product, script, asset, and post that allows ACE to learn what works

### 3.2 Primary Navigation

Sidebar (240px fixed on desktop, icon-only on tablet, drawer on mobile):

- 🏠 Dashboard (default view)
- 🤖 Agents
- 🔄 Workflows
- 📦 Artifacts
- 📊 Experiments
- 📈 Analytics
- 📡 System Events
- ⚙️ Settings
- 📚 Docs

Active state highlighted with Bright Cyan accent.

### 3.3 Route Structure

**Top-level sections:**

- `/` — Dashboard
- `/agents` — Agents console
- `/workflows` — Workflows panel
- `/artifacts` — Artifacts hub
- `/experiments` — Experiments list
- `/analytics` — Analytics dashboard
- `/events` — System events log
- `/settings` — Settings
- `/docs` — Documentation

**Detail views:**

- `/agents/[name]` — Agent detail (e.g., `/agents/scriptwriter`)
- `/workflows/[id]` — Workflow run detail
- `/artifacts/scripts/[id]` — Script detail
- `/artifacts/videos/[id]` — Video asset detail
- `/artifacts/posts/[id]` — Published post detail
- `/experiments/[id]` — Experiment detail

**Query parameters (for filtering and state):**

- `/events?severity=error&agent=scriptwriter`
- `/artifacts?type=script&product_id=[uuid]`
- `/analytics?start_date=2026-01-01&end_date=2026-01-05`
- `/artifacts?tab=scripts` (persist tab selection)

### 3.4 Layout Structure

**Dashboard Layout:**

```
┌────────────────────────────────────┐
│ Header (fixed)                     │
├──────┬─────────────────────────────┤
│ Side │ Main Content Area           │
│ Nav  │                             │
│ 240px│ (scrollable)                │
│      │ Max width: 1400px           │
└──────┴─────────────────────────────┘
```

**Responsive Breakpoints:**

- Desktop (1280px+): Full sidebar, multi-column layouts
- Tablet (768-1280px): Icon-only sidebar, 2-column layouts
- Mobile (<768px): Drawer sidebar, single-column layouts

---

## 4. API Integration

### 4.1 Core Directive

**All data must be fetched through `/lib/api.ts` using the `aceFetch` helper.**

**Never:**

- Query Supabase directly from frontend
- Make raw fetch calls without aceFetch
- Bypass React Query hooks

### 4.2 aceFetch Helper

Location: `src/lib/api.ts`

```tsx
export async function aceFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = [process.env.NEXT](http://process.env.NEXT)_PUBLIC_API_BASE_URL;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': [process.env.NEXT](http://process.env.NEXT)_PUBLIC_API_KEY ?? 'dev',
      ...options.headers,
    },
  });
  
  const json = await res.json();
  
  if (!json.success) {
    throw new Error(json.error?.message || json.error || 'API Error');
  }
  
  return [json.data](http://json.data);
}
```

**Required headers:**

- `Content-Type: application/json`
- `x-api-key: [API_KEY]`

**Optional headers for tracing:**

- `x-correlation-id: [uuid]`
- `x-workflow-id: [uuid]`

### 4.3 Standard Response Format

**Success:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

**Pagination (list endpoints):**

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

### 4.4 Complete API Endpoint Reference

### Agents API

**List Agent Statuses**

- `GET /api/agents`
- Response: `{success: true, data: [{name, status, lastRun, lastEvent}]}`

**Run Agent (Generic)**

- `POST /api/agents/[name]/run`
- Body: `{input: {...}}`
- Response: `{success: true, message, data: {...}}`

**Generate Script**

- `POST /api/agents/scriptwriter/generate`
- Body: `{product_id, creative_pattern_id, trend_snapshot_id, workflow_id?, correlation_id?}`

**Render Video**

- `POST /api/agents/editor/render`
- Body: `{scriptId, styleTemplateId?, composition: {duration, tone, layout}, renderBackend?, workflow_id?, correlation_id?}`

**Publish Post**

- `POST /api/agents/publisher/publish`
- Body: `{experiment_id, platform, workflow_id?, correlation_id?}`
- Platform: `instagram | tiktok | youtube`

### Workflows API

**List Workflow Statuses**

- `GET /api/workflows`
- Response: `{success: true, data: [{id, status, lastRun, lastEvent}]}`

**Start Workflow**

- `POST /api/workflows/[id]/start`
- Body: `{input?: {...}}`
- Response: `{success: true, workflow, status: "started"}`

### Artifacts API

**List Artifacts**

- `GET /api/artifacts`
- Query params: `type, limit, offset, product_id, start_date, end_date, has_experiments, sort`
- Type: `script | video | post`
- Sort: `created_at_desc | created_at_asc | title_asc`
- Limit: default 50, max 100

**Get Artifact Details**

- `GET /api/artifacts/[id]`
- Response: full artifact with metadata, related experiments, agent notes

**Get Scripts**

- `GET /api/artifacts/scripts`
- Same query params as List Artifacts plus `product_id`
- Response: scripts with full text, hook, CTA, outline, creative variables

**Get Video Assets**

- `GET /api/artifacts/videos`
- Response: videos with storage_url, thumbnail_url, duration, tone, layout, style_tags

**Get Published Posts**

- `GET /api/artifacts/posts`
- Query params: standard plus `platform`
- Response: posts with platform, external_post_id, published_at, performance_summary

### Experiments API

**List Experiments**

- `GET /api/experiments`
- Query params: `limit, offset, product_id, start_date, end_date, has_performance, min_score, max_score, sort`
- Sort: `created_at_desc | created_at_asc | score_desc | score_asc`

**Get Experiment Details**

- `GET /api/experiments/[id]`
- Response: full experiment with product, script, asset, published posts, performance summary, creative variables, agent notes

### Performance Metrics API

**Get Performance Metrics**

- `GET /api/performance-metrics`
- Query params: `start_date, end_date, platform, experiment_id, product_id, granularity`
- Granularity: `hour | day | week`
- Response: summary stats, time series, top experiments

**Get Post Metrics**

- `GET /api/performance-metrics/posts/[id]`
- Response: detailed metrics (views, likes, comments, shares, watch_time_avg) with timestamps

### Products API

**List Products**

- `GET /api/products`
- Query params: `limit, offset`

**Get Product Details**

- `GET /api/products/[id]`
- Response: full product with metadata, experiment count, recent experiments

### Trend Snapshots API

**List Trend Snapshots**

- `GET /api/trend-snapshots`
- Query params: `platform, limit, offset, start_date, end_date`

**Get Trend Snapshot Details**

- `GET /api/trend-snapshots/[id]`
- Response: trend with raw videos, analysis, used_in_scripts

### Creative Patterns API

**List Creative Patterns**

- `GET /api/creative-patterns`
- Query params: `limit, offset`

**Get Creative Pattern Details**

- `GET /api/creative-patterns/[id]`
- Response: pattern with structure, variables, usage count, experiments using pattern

### Agent Notes API

**List Agent Notes**

- `GET /api/agent-notes`
- Query params: `agent_name, entity_id, entity_type, start_date, end_date, limit, offset`
- Entity type: `script | asset | post | experiment`

### System API

**Health Check**

- `GET /api/health`
- Response: `{success: true, message: "ACE API alive", timestamp, version}`

**System Events**

- `GET /api/system-events`
- Query params: `severity, agent_name, event_type, workflow_id, correlation_id, start_date, end_date, search, limit, offset`
- Severity: `debug | info | warning | error | critical`
- Limit: default 100, max 500

**Get Event Details**

- `GET /api/system-events/[id]`
- Response: full event with payload, related events

**Get Metrics Summary**

- `GET /api/metrics/summary`
- Query params: `period` (`today | week | month`)
- Response: KPI summary for dashboard (scripts generated, assets rendered, posts published, avg performance score, system health, active workflows, recent errors)

**Record Feedback**

- `POST /api/feedback`
- Body: `{score, comment, entity_id?, entity_type?, feedback_type?}`
- Feedback type: `quality | accuracy | bug | feature_request`

### Authentication API

**Login**

- `POST /api/auth/login`
- Body: `{email, password}`

**Signup**

- `POST /api/auth/signup`
- Body: `{email, password}`

**Logout**

- `POST /api/auth/logout`
- Body: `{}`

### 4.5 Error Codes

- `UNAUTHORIZED` (401): Authentication required or invalid token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request parameters
- `INTERNAL_ERROR` (500): Server error
- `AGENT_ERROR` (500): Agent execution failure
- `WORKFLOW_ERROR` (500): Workflow execution failure

---

## 5. React Query Patterns

### 5.1 Hook Conventions

Location: `src/hooks/`

**Query Hook Example:**

```tsx
import { useQuery } from '@tanstack/react-query';
import { aceFetch } from '@/lib/api';

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => aceFetch('/api/agents'),
    refetchInterval: 30000, // Poll every 30s for dashboard
  });
}

export function useArtifact(id: string) {
  return useQuery({
    queryKey: ['artifacts', id],
    queryFn: () => aceFetch(`/api/artifacts/${id}`),
    enabled: !!id, // Don't fetch if id is empty
  });
}
```

**Mutation Hook Example:**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aceFetch } from '@/lib/api';

export function useRunAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: any }) =>
      aceFetch(`/api/agents/${name}/run`, {
        method: 'POST',
        body: JSON.stringify({ input }),
      }),
    onSuccess: () => {
      // Invalidate agents list to refetch
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
```

### 5.2 Query Key Structure

- Simple lists: `['agents']`, `['workflows']`, `['products']`
- Filtered lists: `['artifacts', { type: 'script', product_id: 'uuid' }]`
- Detail views: `['artifacts', id]`, `['experiments', id]`
- Parameterized: `['system-events', { severity: 'error', agent_name: 'scriptwriter' }]`

### 5.3 Cache Invalidation

After mutations, invalidate related queries:

```tsx
// After creating/updating artifact
queryClient.invalidateQueries({ queryKey: ['artifacts'] });

// After running agent
queryClient.invalidateQueries({ queryKey: ['agents'] });
queryClient.invalidateQueries({ queryKey: ['system-events'] });

// Invalidate specific item
queryClient.invalidateQueries({ queryKey: ['artifacts', id] });
```

### 5.4 Polling Configuration

For real-time monitoring (dashboard, active workflows):

```tsx
useQuery({
  queryKey: ['system-events'],
  queryFn: () => aceFetch('/api/system-events?limit=30'),
  refetchInterval: 30000, // Poll every 30 seconds
  refetchIntervalInBackground: false, // Pause when tab is not visible
});
```

### 5.5 Error Handling

```tsx
const { data, error, isLoading } = useAgents();

if (isLoading) return <SkeletonLoader />;
if (error) return <ErrorState message={error.message} />;

return <AgentsList agents={data} />;
```

---

## 6. File Structure

```
ace-frontend/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx          # Root layout with sidebar
│   │   ├── page.tsx            # Dashboard (/)
│   │   ├── agents/
│   │   │   ├── page.tsx        # Agents console
│   │   │   └── [name]/
│   │   │       └── page.tsx    # Agent detail
│   │   ├── workflows/
│   │   ├── artifacts/
│   │   │   ├── page.tsx        # Artifacts hub with tabs
│   │   │   ├── scripts/
│   │   │   │   └── [id]/
│   │   │   ├── videos/
│   │   │   │   └── [id]/
│   │   │   └── posts/
│   │   │       └── [id]/
│   │   ├── experiments/
│   │   ├── analytics/
│   │   ├── events/
│   │   ├── settings/
│   │   └── docs/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── agents/             # Agent-specific components
│   │   ├── artifacts/          # Artifact-specific components
│   │   ├── workflows/          # Workflow-specific components
│   │   ├── sidebar.tsx
│   │   └── ...
│   ├── hooks/                  # React Query hooks
│   │   ├── useAgents.ts
│   │   ├── useArtifact.ts
│   │   ├── useWorkflows.ts
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts              # aceFetch helper
│   │   ├── utils.ts            # Utility functions
│   │   └── ...
│   └── types/                  # TypeScript types
│       ├── agent.ts
│       ├── artifact.ts
│       ├── experiment.ts
│       └── ...
├── __tests__/
│   ├── utils/
│   │   ├── test-utils.tsx      # Custom render with providers
│   │   └── mock-data.ts        # Mock data factories
│   ├── mocks/
│   │   ├── handlers.ts         # MSW API handlers
│   │   └── server.ts           # MSW server setup
│   ├── hooks/
│   ├── components/
│   ├── integration/
│   └── smoke.test.tsx
├── public/
├── jest.config.js
├── jest.setup.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── [AGENTS.md](http://AGENTS.md)                   # This file
```

---

## 7. Accessibility Requirements

### 7.1 Color Contrast

- Maintain **4.5:1 minimum contrast** for normal text (WCAG AA)
- Maintain **3:1 minimum contrast** for large text (18px+)
- Never rely on color alone to communicate information

### 7.2 Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators (2px Bright Cyan outline at 50% opacity, 2px offset)
- Support Escape key to close modals/dropdowns
- Support Enter/Space to activate buttons

### 7.3 Screen Readers

- Use semantic HTML (`nav`, `main`, `article`, `aside`, `header`, `footer`)
- Provide `aria-label` for icon-only buttons
- Use `role` attributes when necessary
- Announce dynamic content changes with `aria-live`

### 7.4 Motion

- Respect `prefers-reduced-motion` media query
- Disable animations for users who prefer reduced motion

---

## 8. Testing

### 8.1 Test Infrastructure

All test infrastructure is established. Use it.

**Configuration:**

- Jest with Next.js support
- React Testing Library
- MSW for API mocking
- Custom render with React Query provider

**Test Utilities:**

- Custom render: `import { render, screen } from '@/__tests__/utils/test-utils'`
- Mock data factories: `import { createMockScript, createMockSystemEvent } from '@/__tests__/utils/mock-data'`
- MSW handlers: `import { server } from '@/__tests__/mocks/server'`

### 8.2 Testing Patterns

**Component Tests:**

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { Card } from '@/components/ui/Card';

test('renders children', () => {
  render(<Card>Test Content</Card>);
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});
```

**Hook Tests:**

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/__tests__/utils/test-utils';
import { useArtifact } from '@/hooks/useArtifact';
import { server } from '@/__tests__/mocks/server';
import { http, HttpResponse } from 'msw';
import { createMockScript } from '@/__tests__/utils/mock-data';

test('fetches artifact successfully', async () => {
  const mockScript = createMockScript({ id: 'test-id' });
  
  server.use(
    http.get('/api/artifacts/test-id', () => {
      return HttpResponse.json({ success: true, data: mockScript });
    })
  );
  
  const { result } = renderHook(() => useArtifact('test-id'), {
    wrapper: createWrapper()
  });
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  
  expect([result.current.data](http://result.current.data)).toEqual(mockScript);
});
```

**Testing Philosophy:**

- **Test user behavior, not implementation details**
- Use accessible queries (`getByRole`, `getByLabelText`) over test IDs
- Mock at the network boundary (MSW) rather than mocking React Query
- Write tests that would fail if the feature is broken

---

## 9. Terminology & Language

Use consistent language throughout the UI:

**Correct Terms:**

- **Agents** (not "workers" or "services")
- **Workflows** (not "pipelines" or "jobs")
- **Experiments** (not "tests" or "trials")
- **Artifacts** (not "outputs" or "files")
- **System Events** (not "logs" or "audit trail")
- **Correlation ID** (not "trace ID" or "request ID")
- **Workflow ID** (not "execution ID" or "run ID")

**Agent Names:**

- Always use full agent name: "ScriptwriterAgent", "EditorAgent", "PublisherAgent"
- Capitalize correctly

**Status Language:**

- Agent states: Idle, Active, Success, Error
- Workflow states: Idle, Running, Completed, Failed
- Event severity: Debug, Info, Warning, Error, Critical

---

## 10. Common Patterns & Examples

### 10.1 Fetching Data for a Page

```tsx
// app/agents/page.tsx
'use client';

import { useAgents } from '@/hooks/useAgents';
import { AgentCard } from '@/components/agents/AgentCard';
import { SkeletonLoader } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';

export default function AgentsPage() {
  const { data: agents, error, isLoading } = useAgents();
  
  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorState message={error.message} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[agents.map](http://agents.map)((agent) => (
        <AgentCard key={[agent.name](http://agent.name)} agent={agent} />
      ))}
    </div>
  );
}
```

### 10.2 Triggering a Mutation

```tsx
// components/agents/RunAgentButton.tsx
import { useRunAgent } from '@/hooks/useRunAgent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

export function RunAgentButton({ agentName, input }: Props) {
  const runAgent = useRunAgent();
  const { toast } = useToast();
  
  const handleRun = () => {
    runAgent.mutate(
      { name: agentName, input },
      {
        onSuccess: () => {
          toast({
            title: 'Agent started',
            description: `${agentName} is now running`,
            variant: 'success',
          });
        },
        onError: (error) => {
          toast({
            title: 'Failed to start agent',
            description: error.message,
            variant: 'error',
          });
        },
      }
    );
  };
  
  return (
    <Button onClick={handleRun} disabled={runAgent.isPending}>
      {runAgent.isPending ? 'Starting...' : 'Run Agent'}
    </Button>
  );
}
```

### 10.3 Creating a Status Badge

```tsx
// components/ui/status-badge.tsx
import { cn } from '@/lib/utils';

type Status = 'idle' | 'active' | 'success' | 'error';

const statusConfig = {
  idle: { bg: 'bg-slate-100', text: 'text-slate-700' },
  active: { bg: 'bg-purple-100', text: 'text-purple-700' },
  success: { bg: 'bg-green-100', text: 'text-green-700' },
  error: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        [config.bg](http://config.bg),
        config.text
      )}>      {status.charAt(0).toUpperCase() + status.slice(1)}</span>
  );
}
```

### 10.4 Handling Empty States

```tsx
// components/ui/empty-state.tsx
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
```

---

## 11. Environment Variables

**Required:**

- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (e.g., [`https://api.ace.example.com`](https://api.ace.example.com))
- `NEXT_PUBLIC_API_KEY`: API key for authentication

**Optional:**

- `NEXT_PUBLIC_ENV`: Environment identifier (`development`, `staging`, `production`)

---

## 12. Code Style

- **TypeScript strict mode** enabled
- **Single quotes** for strings
- **No semicolons** (Prettier enforces this)
- **Functional patterns** preferred over classes
- **Named exports** over default exports
- **Avoid `any` type** — use proper types or `unknown`
- **Use `const` over `let`** unless reassignment is necessary

---

## 13. Summary

This [AGENTS.md](http://AGENTS.md) file provides everything a coding agent needs to work effectively on the ACE Command Center frontend:

1. **Architecture:** Backend API via React Query, no direct Supabase access
2. **Design System:** Colors, typography, spacing, components for operational UI
3. **Navigation:** Routes, layouts, responsive behavior
4. **API Reference:** Complete endpoint catalog with request/response formats
5. **Testing:** Established infrastructure with patterns and examples
6. **Accessibility:** WCAG AA requirements, keyboard nav, semantic HTML
7. **Terminology:** Consistent language (Agents, Workflows, Artifacts, etc.)

**When in doubt:**

- Follow the design system
- Use React Query hooks wrapping aceFetch
- Test with Jest, RTL, and MSW
- Prioritize accessibility and clarity
- Ask for clarification rather than guessing