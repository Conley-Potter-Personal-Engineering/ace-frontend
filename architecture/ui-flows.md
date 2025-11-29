# ACE Frontend UI Flows (v2 Backend Integration)

This document defines updated user and data flows for the ACE Command Center.

---

## 1. Workflow Trigger Flow
```
User clicks [Run Content Cycle]
  ↓
POST /api/workflows/[id]/start via aceFetch()
  ↓
Backend triggers agents and logs `workflow.start`
  ↓
GET /api/system-events → display progress
  ↓
Workflow completes → UI summary updates
```

Components:
* `<WorkflowTriggerButton />`
* `<WorkflowProgress />`
* `<WorkflowSummaryCard />`

---

## 2. Agent Console Flow
```
User selects agent → useAgents()
  ↓
GET /api/agents
  ↓
Render list and statuses
  ↓
User clicks [Run Agent]
  ↓
POST /api/agents/[name]/run
  ↓
Monitor /api/system-events for updates
```

Components:
* `<AgentCard />`
* `<AgentLogViewer />`
* `<AgentRunButton />`

---

## 3. Artifact Viewing Flow
```
User navigates to Artifacts Hub
  ↓
GET /api/artifacts
  ↓
Display cards with metadata
  ↓
User selects artifact → /artifacts/[id]
  ↓
GET /api/artifacts/[id]
  ↓
Render prompt, structure, media, metadata
```

Components:
* `<ArtifactGrid />`
* `<ArtifactDetailView />`
* `<PromptViewer />`
* `<MediaPreview />`

---

## 4. Feedback Flow
```
User clicks [Rate Output]
  ↓
Modal opens → selects rating and comment
  ↓
POST /api/feedback
  ↓
Backend logs feedback and returns success
  ↓
GET /api/system-events updates UI
```

Components:
* `<FeedbackModal />`
* `<RatingStars />`
* `<FeedbackFeed />`
