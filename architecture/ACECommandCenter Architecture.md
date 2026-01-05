# ACE Command Center Information Architecture

Created by: Conley Potter
Created time: January 5, 2026 7:24 AM
Category: Core Documentation
Last edited by: Conley Potter
Last updated time: January 5, 2026 7:26 AM
GPT Author: Notion AI

This document defines the navigation structure, screen inventory, and user mental model for the **ACE Command Center** frontend.

The information architecture reflects how users conceptualize ACE: as a **multi-agent system with workflows, artifacts, and observable telemetry**.

**References:**

- [ACE Frontend Interaction Model](https://www.notion.so/ACE-Frontend-Interaction-Model-2c8be295a73e816caad9e5a0754deddd?pvs=21) (architecture and data flows)
- [ACE UI Design System](https://www.notion.so/ACE-UI-Design-System-44caea0828934c3997c7c0b349f929a7?pvs=21) (visual language)
- [ACE Workflows Overview](https://www.notion.so/ACE-Workflows-Overview-2c8be295a73e815da34ee5bff7080f61?pvs=21) (workflow concepts)
- [ACE Agent HTTP API Reference](https://www.notion.so/ACE-Agent-HTTP-API-Reference-d2c70d7bf65a44e3a52caa02a226b0bc?pvs=21) (agent capabilities)

---

## 1. User Mental Model

### 1.1 Core Concepts

Users understand ACE through these primary abstractions:

**Agents**

- Specialized AI workers (ScriptwriterAgent, EditorAgent, PublisherAgent, etc.)
- Each has a clear job and can be run individually
- Emit events and leave traces in the system

**Workflows**

- Coordinated sequences of agent actions
- Orchestrated by n8n (Content Cycle, Analytics Ingestion, Optimization Cycle, etc.)
- Have inputs, outputs, and lifecycle events

**Artifacts**

- Creative outputs (scripts, video assets, published posts)
- Linked together through experiments
- Trackable through performance metrics

**Telemetry**

- System events showing what happened and when
- Agent notes explaining decisions
- Performance metrics from published content

**Experiments**

- The link between product, script, asset, and post
- Allow ACE to learn what works
- Foundation for optimization

### 1.2 User Goals

The Command Center supports three primary use cases:

**Monitor** (most frequent)

- Check system health and recent activity
- View agent and workflow status
- Surface errors or alerts

**Control** (frequent)

- Trigger agents manually
- Start workflows
- Provide feedback on content

**Investigate** (as needed)

- Explore artifacts and experiments
- Trace events and correlations
- Analyze performance patterns

---

## 2. Navigation Structure

### 2.1 Primary Navigation

The sidebar provides top-level access to all major sections:

```
┌─────────────────────────┐
│  ACE Command Center     │  ← Logo / Home
├─────────────────────────┤
│  🏠 Dashboard           │  ← Default view
│  🤖 Agents              │
│  🔄 Workflows           │
│  📦 Artifacts           │
│  📊 Experiments         │
│  📈 Analytics           │
│  📡 System Events       │
├─────────────────────────┤
│  ⚙️ Settings            │  ← Secondary
│  📚 Docs                │
└─────────────────────────┘
```

**Navigation Behavior:**

- Fixed sidebar on desktop (240px width)
- Collapses to icon-only on tablet
- Drawer/overlay on mobile
- Active state highlighted with Bright Cyan accent
- Icon + label for clarity

### 2.2 Secondary Navigation

Within each section, use tabs or sub-navigation where needed:

**Example: Artifacts Section**

- "Scripts" tab
- "Video Assets" tab
- "Published Posts" tab

**Example: Analytics Section**

- "Performance" tab
- "Trends" tab
- "Optimization" tab

### 2.3 Breadcrumbs

Use breadcrumbs for deep navigation (detail views, nested contexts):

```
Home > Artifacts > Scripts > Script Detail (uuid)
```

---

## 3. Screen Inventory

### 3.1 Dashboard (Home)

**Route:** `/`

**Purpose:** High-level operational overview and quick access to recent activity

**Primary Content Zones:**

**1. System Status (top)**

- Overall health indicator (green/yellow/red)
- Active workflows count
- Recent errors count (last 24h)
- Quick action: "View All Events"

**2. Recent Activity Feed (left, scrollable)**

- Last 20-30 system events
- Filterable by severity (debug, info, warning, error)
- Each event shows:
    - Timestamp (relative: "2 min ago")
    - Event type icon
    - Agent name (if applicable)
    - Brief message
    - Click to expand details

**3. Quick Stats (right top)**

- KPI cards:
    - Scripts generated (today/week)
    - Assets rendered (today/week)
    - Posts published (today/week)
    - Avg performance score
- Each with sparkline mini-trend

**4. Quick Actions (right bottom)**

- "Run Agent" dropdown (select agent, trigger)
- "Start Workflow" dropdown (select workflow, start)
- "View Latest Artifacts" link

**Data Sources:**

- `GET /api/system-events` (with filters)
- `GET /api/metrics/summary`
- `GET /api/agents` (for status)
- `GET /api/workflows` (for active count)

---

### 3.2 Agents Console

**Route:** `/agents`

**Purpose:** View all available agents, their status, and trigger manual runs

**Layout:** Card grid (responsive: 1/2/3 columns)

**Agent Card Contents:**

- Agent icon (from design system)
- Agent name (e.g., "ScriptwriterAgent")
- Status badge (Idle, Active, Success, Error)
- Last run timestamp
- Brief description
- "Run Agent" button (primary)
- "View History" link (secondary)

**Agent Detail Panel (modal or slide-over):**

- Full description
- Input schema (what parameters it accepts)
- Recent runs (last 10)
    - Timestamp
    - Status
    - Correlation ID
    - Link to system events
- "Run Agent" form:
    - Input fields based on schema
    - Validation feedback
    - Submit button

**Data Sources:**

- `GET /api/agents`
- `POST /api/agents/[name]/run`
- `GET /api/system-events?agent_name=[name]`

---

### 3.3 Workflows Panel

**Route:** `/workflows`

**Purpose:** View available workflows, start new runs, monitor in-progress workflows

**Primary View: Workflow Library (tabs)**

**Tab 1: All Workflows**

- Table or card grid
- Each workflow shows:
    - Name (e.g., "Content Cycle")
    - Description
    - Status: Idle / Running (with count)
    - Last run timestamp
    - Success rate (last 10 runs)
    - "Start Workflow" button

**Tab 2: Active Runs**

- Table of currently running workflows
- Columns:
    - Workflow name
    - Started at
    - Current step/stage
    - Progress indicator (if determinable)
    - Correlation ID
    - Actions: "View Events", "Cancel" (if supported)

**Tab 3: Recent Runs**

- Table of completed workflow runs (last 50)
- Columns:
    - Workflow name
    - Started at
    - Duration
    - Status (success/error)
    - Correlation ID
    - Action: "View Details"

**Workflow Detail View:**

- Workflow name and description
- Timeline of steps/stages
- Event log for this workflow run
- Artifacts created (links to scripts, assets, posts)
- Error details (if failed)

**Data Sources:**

- `GET /api/workflows`
- `POST /api/workflows/[id]/start`
- `GET /api/system-events?workflow_id=[id]`

---

### 3.4 Artifacts Hub

**Route:** `/artifacts`

**Purpose:** Browse and view all creative outputs from ACE

**Primary View: Tabbed Interface**

**Tab 1: Scripts**

- Table view (default) or card grid (toggle)
- Columns:
    - Title
    - Hook (truncated)
    - Product (linked)
    - Created at
    - Used in experiments (count)
    - Actions: "View", "Use in Workflow"
- Filters:
    - Date range
    - Product
    - Has experiments (yes/no)
- Sort: created_at (desc), title (asc)

**Script Detail View (modal or dedicated page `/artifacts/scripts/[id]`):**

- Full script text (formatted)
- Metadata:
    - Title, hook, CTA, outline
    - Product reference
    - Creative variables used
    - Agent notes (rationale)
    - Trend snapshots referenced
    - Pattern IDs used
- Related experiments (list)
- Actions: "Create Asset", "Edit", "Delete"

**Tab 2: Video Assets**

- Table or card grid (cards show thumbnail if available)
- Columns/fields:
    - Thumbnail or icon
    - Script title (linked)
    - Duration
    - Tone / Layout
    - Storage URL
    - Created at
    - Used in posts (count)
    - Actions: "View", "Download", "Publish"

**Asset Detail View:**

- Video player (if playable) or download link
- Script reference (linked)
- Composition metadata (duration, tone, layout, style tags)
- Related experiments and posts
- Actions: "Re-render", "Publish", "Delete"

**Tab 3: Published Posts**

- Table view
- Columns:
    - Platform icon
    - Experiment ID (linked)
    - Published at
    - External post ID (linked to platform)
    - Performance summary (views, engagement)
    - Actions: "View on Platform", "View Metrics"

**Post Detail View:**

- Experiment reference (linked)
- Platform and external ID
- Published timestamp
- Performance metrics (table):
    - Metric name
    - Value
    - Collected at
- Actions: "Refresh Metrics", "View Full Experiment"

**Data Sources:**

- `GET /api/artifacts?type=script`
- `GET /api/artifacts?type=video`
- `GET /api/artifacts?type=post`
- `GET /api/artifacts/[id]`

---

### 3.5 Experiments

**Route:** `/experiments`

**Purpose:** View experiments that link products, scripts, assets, posts, and performance

**Primary View: Table**

**Columns:**

- Experiment ID (short UUID or auto-increment)
- Product name (linked)
- Script title (linked)
- Asset reference (linked)
- Published (yes/no, count if multiple)
- Avg performance score
- Created at
- Actions: "View Details"

**Filters:**

- Date range
- Product
- Has performance data (yes/no)
- Performance score range

**Sort:**

- Created at (desc default)
- Performance score (desc/asc)

**Experiment Detail View:**

- Experiment ID and created timestamp
- Product (linked with details)
- Script (linked, show hook)
- Asset (linked, show thumbnail or play)
- Published posts (table):
    - Platform
    - Published at
    - External ID
    - Link to metrics
- Performance summary (aggregated across posts)
- Creative variables and patterns used
- Agent notes related to this experiment
- Actions: "Republish", "Create Similar", "Mark as Baseline"

**Data Sources:**

- `GET /api/experiments`
- `GET /api/experiments/[id]`

---

### 3.6 Analytics

**Route:** `/analytics`

**Purpose:** View performance metrics, trends, and optimization insights

**Primary View: Tabbed Interface**

**Tab 1: Performance**

- Date range selector (default: last 7 days)
- KPI Summary (cards):
    - Total views
    - Total engagement
    - Avg watch time
    - Top performing post (link)
- Performance over time (line chart)
    - X: date
    - Y: views / engagement
    - Series per platform (optional)
- Top experiments table (by performance score)
    - Experiment ID
    - Product
    - Platform
    - Score
    - Link to details

**Tab 2: Trends**

- Most recent trend snapshots (table or cards)
- Columns:
    - Platform
    - Trend topic/theme
    - Captured at
    - Raw videos count
    - Actions: "View Raw Videos", "Use in Script"
- Trend over time chart (if historical data exists)

**Tab 3: Optimization**

- Creative patterns table
    - Pattern name
    - Description
    - Used in experiments (count)
    - Avg performance when used
    - Last updated
    - Actions: "View", "Edit"
- Recent optimization notes (agent notes from OptimizationAgent)
    - Timestamp
    - Summary
    - Link to related experiments

**Data Sources:**

- `GET /api/performance-metrics`
- `GET /api/trend-snapshots`
- `GET /api/creative-patterns`
- `GET /api/agent-notes?agent_name=OptimizationAgent`

---

### 3.7 System Events

**Route:** `/events`

**Purpose:** Deep telemetry view for debugging and observability

**Primary View: Filterable Event Log**

**Filters (top bar):**

- Severity: All / Debug / Info / Warning / Error / Critical
- Agent: All / [agent names]
- Event type: All / [event type namespaces]
- Date range: Last hour / 24 hours / 7 days / Custom
- Workflow ID: [input field]
- Correlation ID: [input field]
- Search: [free text search in payload]

**Event Table:**

- Columns:
    - Severity icon (colored)
    - Timestamp (precise)
    - Event type (monospace)
    - Agent name
    - Message (truncated)
    - Correlation ID (monospace, copyable)
    - Workflow ID (monospace, copyable)
    - Actions: "Expand"

**Event Detail (expandable row or modal):**

- Full event payload (formatted JSON)
- Related events (same correlation ID or workflow ID)
- Actions: "Copy JSON", "Filter to This Workflow", "Filter to This Agent"

**Data Sources:**

- `GET /api/system-events` (with extensive query params)

---

### 3.8 Settings

**Route:** `/settings`

**Purpose:** User preferences and system configuration

**Sections (tabbed or single scrollable page):**

**1. Profile**

- User info (if multi-user future)
- API key management

**2. Notifications**

- Email alerts for errors (toggle)
- Webhook configuration for external monitoring

**3. Display**

- Theme: Dark / Light / System
- Event log refresh rate
- Date/time format

**4. Advanced**

- API base URL (for local dev vs production)
- Debug mode toggle
- Clear cache

---

### 3.9 Documentation

**Route:** `/docs`

**Purpose:** Embedded help and reference

**Content:**

- Link to Notion engineering docs
- Quick start guide
- Agent reference (descriptions, input schemas)
- Workflow reference (descriptions, triggers)
- FAQ

---

## 4. URL Structure

### 4.1 Route Patterns

**Top-level sections:**

- `/` - Dashboard
- `/agents` - Agents console
- `/workflows` - Workflows panel
- `/artifacts` - Artifacts hub
- `/experiments` - Experiments list
- `/analytics` - Analytics dashboard
- `/events` - System events log
- `/settings` - Settings
- `/docs` - Documentation

**Detail views:**

- `/agents/[name]` - Agent detail (e.g., `/agents/scriptwriter`)
- `/workflows/[id]` - Workflow run detail
- `/artifacts/scripts/[id]` - Script detail
- `/artifacts/videos/[id]` - Video asset detail
- `/artifacts/posts/[id]` - Published post detail
- `/experiments/[id]` - Experiment detail

**Query parameters (for filtering and state):**

- `/events?severity=error&agent=scriptwriter`
- `/artifacts?type=script&product_id=[uuid]`
- `/analytics?start_date=2026-01-01&end_date=2026-01-05`

### 4.2 URL Persistence

Where useful for shareability and bookmarking:

- Persist filters in URL query params
- Persist sort order and pagination
- Persist tab selection (e.g., `/artifacts?tab=scripts`)

---

## 5. Navigation Patterns

### 5.1 Entry Points

**Dashboard is the default landing page**

- Most users start here
- Quick access to recent activity
- Jump-off to other sections

**Deep links work everywhere**

- Every detail view has a stable URL
- Correlation IDs and workflow IDs link to filtered event views
- Experiments link to their artifacts

### 5.2 Common Flows

**Flow 1: Monitor system health**

1. Land on Dashboard
2. Scan system status and recent events
3. Click on error event → expands to show details
4. Click "View All Events" → Events page with error filter applied

**Flow 2: Manually trigger agent**

1. Navigate to Agents console
2. Find desired agent card
3. Click "Run Agent"
4. Fill in parameters in modal/slide-over
5. Submit → see confirmation toast
6. Redirected to Events page with correlation_id filter to watch progress

**Flow 3: Start workflow**

1. Navigate to Workflows panel
2. Find desired workflow
3. Click "Start Workflow"
4. Provide inputs (if required)
5. Submit → workflow starts
6. Redirected to Workflows > Active Runs to monitor

**Flow 4: Review recent content**

1. Navigate to Artifacts hub
2. Select "Published Posts" tab
3. Browse recent posts
4. Click post → see detail with performance metrics
5. Click experiment link → see full experiment context
6. Click script or asset links → view creative inputs

**Flow 5: Investigate anomaly**

1. Dashboard shows high error count
2. Click through to Events page
3. Filter to errors in last 24 hours
4. Identify repeated event type
5. Click to expand payload
6. Copy correlation_id
7. Filter events to that correlation_id to see full workflow trace
8. Identify failing agent
9. Navigate to agent detail → see recent history
10. Decide whether to re-run or investigate code

---

## 6. User Terminology

### 6.1 ACE-Specific Terms

Use consistent language throughout the UI:

**Agents** (not "workers" or "services")

- ScriptwriterAgent, EditorAgent, PublisherAgent, etc.
- Always use full agent name in UI, not abbreviations

**Workflows** (not "pipelines" or "jobs")

- Content Cycle, Analytics Ingestion, Optimization Cycle, etc.
- Capitalize workflow names

**Experiments** (not "tests" or "trials")

- Each experiment links product → script → asset → post → metrics

**Artifacts** (not "outputs" or "files")

- Scripts, video assets, published posts

**System Events** (not "logs" or "audit trail")

- Structured telemetry emitted by agents and workflows

**Correlation ID** (not "trace ID" or "request ID")

- Links related events across agents and workflows

**Workflow ID** (not "execution ID" or "run ID")

- Identifies a specific workflow run (n8n execution ID)

### 6.2 Status Language

**Agent States:**

- Idle (available, not running)
- Active (currently executing)
- Success (completed successfully)
- Error (failed)

**Workflow States:**

- Idle (not running)
- Running (in progress)
- Completed (finished successfully)
- Failed (encountered error)

**Event Severity:**

- Debug (technical detail, usually hidden)
- Info (informational, normal operation)
- Warning (attention needed, not critical)
- Error (failure, needs investigation)
- Critical (severe failure, immediate attention)

---

## 7. Empty States and Onboarding

### 7.1 Empty State Messages

Each section should have a helpful empty state when no data exists:

**Artifacts > Scripts (empty):**

- Icon: 📝
- Heading: "No scripts yet"
- Description: "Scripts are generated by the ScriptwriterAgent. Start creating content by running the agent or starting a workflow."
- Action: "Run ScriptwriterAgent" button

**Workflows > Active Runs (empty):**

- Icon: 🔄
- Heading: "No workflows running"
- Description: "Start a workflow from the All Workflows tab to see it here."
- Action: Link to "All Workflows" tab

**Analytics > Performance (empty):**

- Icon: 📈
- Heading: "No performance data yet"
- Description: "Performance metrics will appear here once you publish content and analytics ingestion runs."
- No action (system will populate automatically)

### 7.2 First-Time Experience

For new users (detected by empty database or first login):

**Dashboard shows guided card:**

- "Welcome to ACE Command Center"
- Brief description: "Monitor and control your autonomous content engine"
- Checklist:
    - ✅ Connect to backend API
    - ☐ Run your first agent
    - ☐ Start your first workflow
    - ☐ View your first artifact
- Link: "Learn more in Docs"

---

## 8. Search and Global Actions

### 8.1 Global Search (future enhancement)

**Trigger:** Cmd/Ctrl + K or search icon in header

**Search scope:**

- Agents (by name)
- Workflows (by name)
- Scripts (by title or text)
- Experiments (by ID)
- Events (by type or message)

**Results:** Grouped by type, click to navigate to detail view

### 8.2 Quick Actions (future enhancement)

**Trigger:** Cmd/Ctrl + Shift + K or "Actions" button in header

**Actions:**

- "Run agent..."
- "Start workflow..."
- "View recent errors"
- "Create experiment"
- "Go to..."

---

## 9. Responsive Behavior

### 9.1 Breakpoint Adaptations

**Desktop (1280px+):**

- Full sidebar visible
- Multi-column layouts for cards and grids
- Tables with all columns visible

**Tablet (768px - 1280px):**

- Sidebar collapses to icon-only
- 2-column card grids
- Tables may hide less critical columns (responsive tables)

**Mobile (< 768px):**

- Sidebar becomes drawer (hamburger menu)
- Single-column layouts
- Tables convert to stacked cards
- Filters collapse into dropdown or modal

### 9.2 Priority Content

On smaller screens, prioritize:

- System status (health indicator)
- Recent errors (most critical events)
- Quick actions (run agent, start workflow)
- Latest artifacts (most recent items)

Hide or collapse:

- Debug-level events
- Extended metadata fields
- Low-priority KPIs

---

## 10. Implementation Notes

### 10.1 Routing Library

Use **React Router** (or Next.js App Router if using Next.js):

- Define routes in central config
- Use layout components for consistent shell (header, sidebar, main)
- Lazy load route components for performance

### 10.2 State Management

For navigation state:

- **URL state:** filters, sort, pagination, tab selection
- **Local state:** sidebar collapsed/expanded, modal open/closed
- **Global state:** user preferences (theme, notification settings)

Use React Query for server state (already in use per Frontend Interaction Model).

### 10.3 Navigation Components

Build reusable navigation components:

- `<Sidebar>` with `<NavItem>` children
- `<Tabs>` for tabbed interfaces
- `<Breadcrumbs>` for deep navigation
- `<PageHeader>` with consistent title + action button layout

---

## 11. Evolution and Testing

### 11.1 Validating Information Architecture

**During development:**

- Test navigation flows with real scenarios
- Verify all screens are reachable within 3 clicks from Dashboard
- Ensure every detail view has a "back" path

**With users (when applicable):**

- Card sorting to validate groupings
- Tree testing to validate navigation labels
- Task-based usability testing for common flows

### 11.2 Adding New Screens

When adding new screens:

1. Determine if it's a top-level section or detail view
2. Define route pattern and URL structure
3. Add to navigation (sidebar or secondary nav)
4. Create empty state
5. Define data sources and loading states
6. Document in this IA guide

---

**Last Updated:** 2026-01-05

**Maintainer:** ACE Engineering Team

**Related:**

- [ACE Frontend Interaction Model](https://www.notion.so/ACE-Frontend-Interaction-Model-2c8be295a73e816caad9e5a0754deddd?pvs=21)
- [ACE UI Design System](https://www.notion.so/ACE-UI-Design-System-44caea0828934c3997c7c0b349f929a7?pvs=21)