# ACE Frontend UI Flows

This document defines the major interaction flows inside the Command Center.

---

### 1. Workflow Trigger Flow
**Purpose:** Allow users (or AI operators) to start workflows manually.

```
User clicks [Run Content Cycle]
  ↓
POST /api/workflows/content-cycle → Orchestrator
  ↓
Supabase logs `workflow.start`
  ↓
Realtime event → UI progress bar updates
  ↓
Agents emit `agent.success` / `agent.error`
  ↓
Workflow ends → results stored → summary visible
```

UI Components:
* `<WorkflowTriggerButton />`
* `<LiveStatusFeed />`
* `<WorkflowSummaryCard />`

---

### 2. Agent Console Flow
**Purpose:** Observe and control individual ACE agents.

```
[Agents → Scriptwriter]
  ↓
GET /api/agents/scriptwriter/status
  ↓
Supabase: fetch last 10 system_events
  ↓
Render activity timeline + test results
  ↓
User clicks [Run Agent] → POST /api/agents/scriptwriter/run
  ↓
Realtime updates stream into console view
```

UI Components:
* `<AgentCard />`
* `<AgentLogViewer />`
* `<AgentRunButton />`

---

### 3. Artifact Viewing Flow
**Purpose:** Display creative artifacts (scripts, experiments, editor outputs, media).

```
User navigates to [Artifacts]
  ↓
Supabase query: select * from artifacts where type='video_prompt'
  ↓
Render grid of cards with metadata + thumbnail
  ↓
User clicks one → `/artifacts/[id]`
  ↓
Fetch structured data from editorChainOutputSchema
  ↓
Tabs: [Prompt] [Structure] [Media] [Metadata]
```

UI Components:
* `<ArtifactGrid />`
* `<ArtifactDetailView />`
* `<PromptViewer />`
* `<MediaPreview />`
* `<MetadataPanel />`

---

### 4. Feedback Submission Flow
**Purpose:** Collect human evaluation of outputs to improve OptimizationAgent.

```
User views artifact → clicks [Rate Output]
  ↓
Modal opens → selects stars, enters comment
  ↓
POST /api/feedback { artifact_id, rating, comment }
  ↓
Supabase.insert('feedback')
  ↓
analytics.event: feedback.create.success
```

UI Components:
* `<FeedbackModal />`
* `<RatingStars />`
* `<FeedbackFeed />`
