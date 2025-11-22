# ACE Frontend — Command Center

The **ACE Frontend** (also known as the **Command Center**) is the interactive and visual layer of the Autonomous Content Engine (ACE).
It provides a unified interface for observing agent performance, triggering workflows, viewing creative artifacts, and managing the feedback loop that fuels ACE’s learning and optimization.

---

## 🚀 Purpose

The ACE Frontend transforms ACE from a backend automation engine into an **operational intelligence platform**.

It allows you to:

* View live system and agent performance
* Inspect and compare generated outputs (scripts, video prompts, media)
* Trigger workflows manually or on demand
* Stream logs and test results in real time
* Submit qualitative feedback that improves ACE’s creative models

---

## 🧠 Key Concepts

### Agents

The UI represents each ACE backend agent (e.g., Scriptwriter, Editor, Publisher) as an interactive module.  Each module shows status, logs, test results, and provides controls to trigger agent runs.

### Workflows

The frontend exposes workflow orchestration in real time. You can view stages, dependencies, and runtime results, and manually start workflows like **ContentCycle**, **TrendRefresh**, or **OptimizationCycle**.

### Artifacts

All creative outputs are accessible through the **Artifact Hub**:

* **Scripts** — from ScriptwriterAgent
* **Editor Outputs** — video prompt data + generated video previews
* **Experiments & Notes** — contextual creative intelligence
* **Visual Assets** — images, thumbnails, and rendered clips

### Feedback

Feedback is a key human-in-the-loop element. The Command Center includes interfaces to:

* Rate generated artifacts
* Annotate failures or creative misalignments
* Feed structured feedback into ACE’s OptimizationAgent

---

## 🧩 Architecture Overview

**Stack:**

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **State:** React Query + Supabase Realtime
* **Data:** Supabase (events, artifacts, feedback)
* **Visualization:** Recharts / D3.js
* **Media:** Supabase Storage / S3-compatible bucket

**Structure:**

```
src/
  components/       — Reusable UI modules (cards, tables, viewers)
  pages/            — Next.js routes
  hooks/            — Data fetching, mutations, realtime subscriptions
  lib/              — API clients, event logging, Supabase integration
  styles/           — Tailwind + design tokens
architecture/
  overview.md       — Architectural summary
  ui-flows.md       — User interaction patterns
AGENTS.md           — Rules for AI coding agents in this repo
README.md           — This file
```

---

## 🔄 Data Flow

```
User Action → Frontend API (Next.js route)
  ↓
Orchestrator executes workflow or agent
  ↓
Agent writes to Supabase (system_events, artifacts)
  ↓
Supabase Realtime pushes updates to UI
  ↓
Frontend renders progress and outputs
```

---

## 🎨 Core Views

### Dashboard

* Global system status
* Workflow and agent activity graphs
* Test suite summaries

### Agents Console

* Live agent logs and performance states
* Manual triggers for agent runs
* Status and event stream

### Artifact Hub

* Display scripts, experiments, editor prompts, videos, and images
* Explore structured metadata and media assets
* Preview creative outputs in multiple formats

### Feedback View

* Rate outputs and add notes
* Visualize collective feedback over time

---

## 🧱 Design Principles

1. **Transparency** — Make agent behavior visible and traceable.
2. **Interactivity** — Enable human-initiated exploration and testing.
3. **Scalability** — Support new artifact types and agents with minimal config.
4. **Composability** — Build reusable UI components across modules.
5. **Reliability** — Mirror backend state accurately in real time.

---

## ⚙️ Development

### Setup

```
npm install
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=
```

### Build & Test

```
npm run build
npm run lint
npm run test
```

### Deploy

Deploy via Vercel or Railway. The app connects to Supabase for data and event streaming.

---

## 🤖 AI Coding Agents

Autonomous AI contributors (e.g., Codex, Copilot) should follow `AGENTS.md`.
That file defines safe conventions for writing UI logic, integrating APIs, and maintaining code quality.

---

## 📈 Future Extensions

* Cross-agent comparison dashboards
* Multi-product creative timelines
* Interactive visual editing of agent prompts
* Integrated media rendering (via video generation models)

---

### Summary

The ACE Frontend is the **control surface** of the Autonomous Content Engine — the bridge between machine creativity and human judgment.
Its design emphasizes **visibility, interactivity, and creative insight**, turning ACE into a transparent, explorable, and adaptive system.
