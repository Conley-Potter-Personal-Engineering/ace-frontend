# ACE Frontend — Command Center (v2 API-Integrated)

The **ACE Frontend** (Command Center) is the interactive and visual layer of the Autonomous Content Engine (ACE).  
It now fully integrates with the **ACE Backend API**, replacing all direct Supabase queries with standardized API calls.

---

## 🚀 Purpose

The Command Center turns ACE’s automation backbone into an **operational intelligence dashboard** — enabling real-time visibility, control, and feedback.

You can:
- View agent and workflow performance
- Trigger workflows manually
- Explore artifacts and creative outputs
- Submit feedback that informs ACE’s optimization loop

---

## 🧠 Key Concepts

### Agents
Interactive modules representing backend agents (Scriptwriter, Editor, Publisher, etc.).  
Each module shows live status, event logs, and manual controls.

### Workflows
Visual and interactive orchestration of ACE workflows.  
Workflows are fetched via the backend `/api/workflows` endpoint.

### Artifacts
Creative assets — scripts, video prompts, or rendered media — retrieved via `/api/artifacts`.

### Feedback
Human feedback drives the OptimizationAgent. Feedback is submitted via `/api/feedback`.

---

## ⚙️ Architecture Overview

**Stack**
| Layer | Technology | Description |
|-------|-------------|-------------|
| Framework | Next.js 15 | App Router, SSR |
| Language | TypeScript | Typed components and models |
| Styling | Tailwind CSS + shadcn/ui | Design primitives |
| State | React Query | Data caching and mutations |
| Data | ACE Backend API | All reads/writes via `/api/**` |
| Realtime | System Events API | `/api/system-events` endpoint |
| Visualization | Recharts / D3.js | Data visualizations |
| Storage | Supabase Storage (via backend) | Media delivery only |

---

## 🔄 Data Flow

```
User Action → Frontend API Client (lib/api.ts)
  ↓
ACE Backend API (/api/**)
  ↓
Repository Layer (Supabase)
  ↓
System Events logged → /api/system-events
  ↓
Frontend renders progress + results
```

---

## 🧱 Core Views

- **Dashboard** — Global status, metrics, and event feeds  
- **Agents Console** — Monitor and trigger agent runs  
- **Artifact Hub** — Browse creative outputs and media  
- **Feedback View** — Rate and annotate results  

---

## 🔧 Development

### Environment Variables
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_API_KEY=dev
```

### Commands
```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
```

### Deployment
Deploy to Vercel or Railway.  
The frontend connects to the backend API using the `NEXT_PUBLIC_API_BASE_URL` variable.

---

## 📈 Future Roadmap
- Add websocket streaming for `/api/system-events`
- Implement agent comparison dashboards
- Enhance feedback analytics and trend visualizations

---
