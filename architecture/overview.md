# ACE Frontend Architecture Overview (v2 API-Integrated)

The ACE Frontend (Command Center) visualizes, controls, and interprets the ACE Backend’s autonomous creative workflows.

---

## Purpose
* **Observability:** Real-time insight into workflows and agents.
* **Control:** Manual triggers and feedback input.
* **Visualization:** Charts and dashboards of system metrics.
* **Creativity:** Display of AI-generated artifacts.

---

## Stack Overview

| Layer | Technology | Description |
|--------|-------------|-------------|
| Framework | Next.js 15 (App Router) | Routing and SSR |
| Language | TypeScript | Type-safe components |
| Styling | Tailwind + shadcn/ui | Consistent UI primitives |
| Data Source | ACE Backend API | Unified access to backend |
| State | React Query | API data management |
| Visualization | Recharts / D3.js | Metric and workflow visualization |
| Storage | Supabase Storage (via backend) | Media assets |
| Auth | x-api-key (future: Clerk) | Internal protection |

---

## System Layout

```
+--------------------------------------------------+
| ACE Command Center                               |
|--------------------------------------------------|
| 🧭 Dashboard       → Global system metrics       |
| 🤖 Agents Console  → Trigger/monitor agents       |
| 🎨 Artifact Hub    → View creative outputs        |
| 🧠 Feedback View   → Rate and annotate results    |
| ⚙️ Settings        → Configure API base + keys    |
+--------------------------------------------------+
```

---

## Data Flow

1. **Frontend → Backend:** User triggers `/api/...` endpoint via `aceFetch()`.
2. **Backend → Supabase:** Handler calls repositories and logs events.
3. **Backend → Frontend:** API returns standardized response.
4. **Frontend → Display:** React Query renders updates in UI.

---

## Extensibility
- Add new hooks in `/hooks/` for new endpoints.
- Add agent UIs under `/components/agents/`.
- Extend Artifact Hub with `/components/artifacts/`.
- Maintain schema alignment with backend Zod models.

---
