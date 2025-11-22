# ACE Frontend Architecture Overview

### Purpose
The ACE Frontend (also called the **Command Center**) is the visual and interactive layer of the Autonomous Content Engine. It provides:

* Observability — real-time visibility into ACE workflows and agents.
* Control — manual triggers for workflows, tests, and experiments.
* Insight — dashboards and data visualizations for analytics.
* Creativity — access to generative artifacts like scripts, video prompts, and media outputs.

The frontend transforms ACE from a backend engine into an **interactive, transparent, and creative control surface**.

---

### Core Stack

| Layer         |           Technology                |                   Description.                      |
|---------------|-------------------------------------|-----------------------------------------------------|
| Framework     | **Next.js 15 (App Router)**         | Core framework for routing and SSR/ISR              |
| Language      | **TypeScript**                      | Strong typing for component and data integrity      |
| Styling       | **Tailwind CSS + shadcn/ui**        | Rapid design with accessible component primitives   |
| Visualization | **Recharts / D3.js**                | Charts and visualizations for metrics and workflows |
| State & Data  | **React Query + Supabase Realtime** | Data fetching, caching, and live event streaming    |
| Storage       | **Supabase Storage + R2/S3**        | Asset and media access                              |
| Auth          | **Supabase Auth / Clerk**           | Restricted access for internal use                  |

---

### System Layout

```
+---------------------------------------------------------------+
| ACE Command Center                                            |
|---------------------------------------------------------------|
| 🧭 Dashboard        |  Global health, metrics, event stream  |
| 🤖 Agents Console   |  Per-agent views and manual triggers    |
| 🎨 Artifact Hub     |  Scripts, prompts, videos, images      |
| 🧠 Feedback View    |  Rate, annotate, and tag outputs       |
| ⚙️ Settings         |  Environment + configuration           |
+---------------------------------------------------------------+
```

---

### Data Flow

1. **Frontend → Orchestrator**: User triggers workflows or agents via API routes (REST/GraphQL).
2. **Orchestrator → Supabase**: Agents write `system_events` and results to database.
3. **Supabase → Frontend (Realtime)**: UI receives live updates on workflow progress.
4. **Frontend → Storage**: Media assets retrieved for display.

---

### Extensibility
* All views are modular React components.
* Every agent has a corresponding **UI module** in `/components/agents/`.
* New creative artifact types can be added under `/components/artifacts/`.
* Data-fetching hooks use standard patterns (`useQuery`, `useMutation`).
* Global design tokens define consistent visuals across modules.

---