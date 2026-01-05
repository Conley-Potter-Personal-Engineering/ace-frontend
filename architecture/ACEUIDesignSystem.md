# ACE UI Design System

Created by: Conley Potter
Created time: January 5, 2026 7:13 AM
Category: Core Documentation
Last edited by: Conley Potter
Last updated time: January 5, 2026 7:23 AM
GPT Author: Notion AI

This document defines the visual language, component patterns, and interaction principles for the **ACE Command Center** frontend.

The design system supports the primary goal: **present a clear operational view of ACE** while allowing safe control and surfacing artifacts, metrics, and events in a usable way.

**References:**

- [ACE Frontend Interaction Model](https://www.notion.so/ACE-Frontend-Interaction-Model-2c8be295a73e816caad9e5a0754deddd?pvs=21) (architecture)
- [ACE: What It Is, How It Works, and Why It Exists](https://www.notion.so/ACE-What-It-Is-How-It-Works-and-Why-It-Exists-2d5be295a73e80828aceeb0e079c1bcb?pvs=21) (brand essence)
- [Conley Potter — Brand Hub](https://www.notion.so/Conley-Potter-Brand-Hub-c2caa79f280a48bda10a1ca544a3864f?pvs=21) (visual inspiration)

---

## 1. Design Principles

The ACE Command Center is not a marketing site or content tool. It is an **operational interface** for monitoring and controlling an autonomous creative system.

### Core Principles

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
- Reveal patterns in telemetry and performance data

**Accessible Depth**

- Essential information at a glance
- Progressive disclosure for technical details
- Allow both high-level monitoring and deep investigation

---

## 2. Color Palette

### 2.1 Brand Colors

ACE's visual identity reflects **consolidation, signal, and calm leverage**.

**Primary Palette**

- **Deep Slate** `#1e293b` - primary backgrounds, headers
- **Bright Cyan** `#06b6d4` - primary actions, links, success states
- **Soft Lavender** `#a78bfa` - secondary accents, metadata
- **Warm Amber** `#f59e0b` - warnings, attention states

**Neutral Palette**

- **Ink** `#0f172a` - darkest backgrounds, text on light
- **Charcoal** `#334155` - secondary backgrounds, borders
- **Slate** `#64748b` - secondary text, disabled states
- **Fog** `#cbd5e1` - dividers, subtle borders
- **Mist** `#f1f5f9` - light backgrounds, hover states
- **Snow** `#ffffff` - lightest backgrounds, cards on dark

### 2.2 Semantic Colors

These colors communicate **system state** and should be used consistently across all components.

**Status Colors**

- **Success** `#10b981` (Green) - completed operations, healthy states
- **Warning** `#f59e0b` (Amber) - attention needed, non-critical issues
- **Error** `#ef4444` (Red) - failures, critical alerts
- **Info** `#3b82f6` (Blue) - informational messages, neutral states
- **Running** `#8b5cf6` (Purple) - in-progress operations, active workflows

**Agent State Colors**

- **Idle** `#64748b` (Slate) - agent available but not running
- **Active** `#8b5cf6` (Purple) - agent currently executing
- **Success** `#10b981` (Green) - agent completed successfully
- **Error** `#ef4444` (Red) - agent failed

**Event Severity Colors**

- **Debug** `#94a3b8` (Light Slate)
- **Info** `#3b82f6` (Blue)
- **Warning** `#f59e0b` (Amber)
- **Error** `#ef4444` (Red)
- **Critical** `#dc2626` (Dark Red)

### 2.3 Color Usage Guidelines

- Use **Deep Slate** or **Ink** for primary backgrounds
- Use **Snow** or **Mist** for card backgrounds and surfaces
- Use **Bright Cyan** sparingly for primary actions only
- Reserve **semantic colors** exclusively for system state communication
- Maintain **4.5:1 contrast ratio** minimum for text (WCAG AA)
- Use **Fog** for subtle dividers; **Charcoal** for prominent borders

---

## 3. Typography

### 3.1 Font Stack

**Primary (UI Text)**

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Monospace (Code, IDs, Technical Data)**

```css
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### 3.2 Type Scale

| **Name** | **Size** | **Line Height** | **Weight** | **Usage** |
| --- | --- | --- | --- | --- |
| Display | 32px | 1.2 | 700 | Page titles, dashboard headers |
| Heading 1 | 24px | 1.3 | 600 | Section headers |
| Heading 2 | 20px | 1.4 | 600 | Subsection headers, card titles |
| Heading 3 | 16px | 1.5 | 600 | Component headers, labels |
| Body Large | 16px | 1.6 | 400 | Primary content, descriptions |
| Body | 14px | 1.5 | 400 | Default body text, list items |
| Body Small | 13px | 1.5 | 400 | Secondary text, metadata |
| Caption | 12px | 1.4 | 400 | Timestamps, helper text, footnotes |
| Code | 14px | 1.5 | 400 | Code blocks, UUIDs, technical identifiers |

### 3.3 Font Weight Usage

- **400 (Regular)** - default body text
- **500 (Medium)** - emphasis, labels, navigation
- **600 (Semibold)** - headings, buttons, important UI elements
- **700 (Bold)** - display text, alerts, critical information

---

## 4. Spacing System

Use a consistent **8px base unit** for all spacing decisions.

### 4.1 Spacing Scale

| **Token** | **Value** | **Usage** |
| --- | --- | --- |
| xs | 4px | Tight spacing between related elements |
| sm | 8px | Default gap between inline elements |
| md | 16px | Standard component padding, gaps |
| lg | 24px | Section spacing, card padding |
| xl | 32px | Major section breaks |
| 2xl | 48px | Page-level spacing |
| 3xl | 64px | Large gutters, hero spacing |

### 4.2 Layout Guidelines

- **Card padding:** `lg` (24px)
- **Button padding:** `sm` horizontal (8px), `xs` vertical (4px) for compact; `md` horizontal (16px), `sm` vertical (8px) for standard
- **Section spacing:** `xl` (32px) between major sections
- **List item spacing:** `sm` (8px) between items
- **Form field spacing:** `md` (16px) between fields

---

## 5. Component Library

### 5.1 Buttons

**Primary Button**

- Background: `Bright Cyan` (#06b6d4)
- Text: `Snow` (#ffffff)
- Font weight: 600
- Border radius: 6px
- Padding: 12px 20px (md horizontal, sm vertical)
- Hover: darken background 10%
- Active: darken background 15%
- Disabled: `Slate` background, reduced opacity

**Secondary Button**

- Background: transparent
- Border: 1px solid `Charcoal` (#334155)
- Text: `Bright Cyan` (#06b6d4)
- Font weight: 600
- Same sizing as primary

**Danger Button**

- Background: `Error` (#ef4444)
- Text: `Snow`
- Use for destructive actions only

**Ghost Button**

- Background: transparent
- Text: `Slate` (#64748b)
- Hover: `Mist` background
- Use for tertiary actions

### 5.2 Cards

**Standard Card**

- Background: `Snow` on dark themes, `Deep Slate` on light themes
- Border: 1px solid `Fog` (#cbd5e1)
- Border radius: 8px
- Padding: `lg` (24px)
- Box shadow: subtle (0 1px 3px rgba(0,0,0,0.1))

**Interactive Card**

- Add hover state: subtle lift and shadow increase
- Cursor: pointer
- Transition: all 150ms ease

**Status Card**

- Add colored left border (4px) matching status
- Background tint using status color at 5% opacity

### 5.3 Badges & Pills

**Status Badge**

- Small, inline component for displaying state
- Background: status color at 20% opacity
- Text: status color (darkened for contrast)
- Border radius: 12px (fully rounded)
- Padding: 4px 10px
- Font size: Caption (12px)
- Font weight: 500

**Count Badge**

- Circular badge for counts (notifications, items)
- Background: `Error` (#ef4444) for alerts, `Info` (#3b82f6) for neutral
- Size: 20px diameter for single digit, expand for larger

### 5.4 Tables

**Data Table**

- Header: `Charcoal` background, medium weight text
- Row: `Snow` background, alternating subtle `Mist` for zebra striping (optional)
- Border: 1px solid `Fog` between rows
- Padding: `sm` (8px) vertical, `md` (16px) horizontal
- Hover: `Mist` background

**Compact Table**

- Reduce vertical padding to `xs` (4px)
- Font size: Body Small (13px)
- Use for high-density data

### 5.5 Forms

**Input Field**

- Background: `Snow` or `Mist`
- Border: 1px solid `Fog`, focus border `Bright Cyan`
- Border radius: 6px
- Padding: `sm` (8px) vertical, `md` (16px) horizontal
- Font size: Body (14px)
- Focus: 2px outline in `Bright Cyan` at 50% opacity

**Label**

- Font size: Body Small (13px)
- Font weight: 500
- Color: `Charcoal`
- Margin bottom: `xs` (4px)

**Error State**

- Border color: `Error`
- Helper text in `Error` color
- Icon (optional): warning triangle

### 5.6 Toasts & Notifications

**Toast**

- Fixed positioning (top-right or bottom-right)
- Card styling with elevated shadow
- Left border (4px) matching severity color
- Icon + message + dismiss button
- Auto-dismiss after 5 seconds (except errors)
- Animation: slide in from right, fade out

**Notification Types**

- Success: `Success` color, checkmark icon
- Warning: `Warning` color, alert icon
- Error: `Error` color, X icon
- Info: `Info` color, info icon

### 5.7 Loading States

**Spinner**

- Circular spinner using `Bright Cyan` or `Running` (purple)
- Size variants: sm (16px), md (24px), lg (32px)
- Animation: smooth rotation

**Skeleton Screens**

- Use for loading table rows, cards, text blocks
- Background: `Mist` with subtle shimmer animation
- Maintain layout dimensions

**Progress Bar**

- For determinate progress (uploads, renders)
- Track: `Fog` background
- Fill: `Bright Cyan` or `Running` (purple)
- Height: 4px for subtle, 8px for prominent

---

## 6. Icons

### 6.1 Icon Library

Use **Heroicons** (outline and solid variants) or **Lucide Icons** for consistency.

### 6.2 Icon Sizing

- **xs:** 12px (inline with caption text)
- **sm:** 16px (inline with body text)
- **md:** 20px (buttons, cards)
- **lg:** 24px (section headers)
- **xl:** 32px (empty states, illustrations)

### 6.3 Agent & Workflow Icons

Assign consistent icons to each agent for quick recognition:

- **ScriptwriterAgent:** ✍️ or pen/document icon
- **EditorAgent:** 🎬 or film/scissors icon
- **PublisherAgent:** 🚀 or upload/send icon
- **ResearchAgent:** 🔍 or chart/trend icon
- **AnalystAgent:** 📊 or bar-chart icon
- **OptimizationAgent:** ⚙️ or settings/tuning icon
- **MetaAgent:** 🧠 or network/brain icon
- **WatchdogAgent:** 👁️ or shield/alert icon

### 6.4 System Event Icons

- **agent.start:** play icon
- **agent.success:** checkmark
- **agent.error:** X or alert triangle
- **workflow.start:** workflow icon
- **workflow.end:** flag or checkered flag
- **publish.success:** upload complete
- **render.success:** film with checkmark

---

## 7. Layout & Grid

### 7.1 Grid System

Use a **12-column grid** with responsive breakpoints.

**Breakpoints:**

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

**Gutter:** `md` (16px) on mobile, `lg` (24px) on desktop

### 7.2 Dashboard Layout

**Structure:**

```
┌────────────────────────────────────┐
│ Header (fixed)                     │
├──────┬─────────────────────────────┤
│ Side │ Main Content Area           │
│ Nav  │                             │
│(固定)│ (scrollable)                │
│      │                             │
└──────┴─────────────────────────────┘
```

**Sidebar:**

- Width: 240px (desktop), collapsed to icon-only on tablet
- Background: `Deep Slate`
- Text: `Mist`

**Main Content:**

- Max width: 1400px (centered)
- Padding: `lg` (24px) on mobile, `2xl` (48px) on desktop

### 7.3 Card Grid

Use CSS Grid for responsive card layouts:

- **Mobile:** 1 column
- **Tablet:** 2 columns
- **Desktop:** 3-4 columns depending on content density
- Gap: `lg` (24px)

---

## 8. Data Visualization

### 8.1 Charts

For metrics and performance data, use **Chart.js** or **Recharts**.

**Color Palette for Charts:**

- Primary series: `Bright Cyan` (#06b6d4)
- Secondary series: `Soft Lavender` (#a78bfa)
- Tertiary series: `Warm Amber` (#f59e0b)
- Neutral series: `Slate` (#64748b)

**Chart Guidelines:**

- Use line charts for trends over time
- Use bar charts for comparisons across categories
- Use pie/donut charts sparingly (only for simple proportions)
- Always include axis labels and legends
- Use tooltips for detailed data on hover

### 8.2 Metrics Display

**Stat Card:**

- Large number (Display size, 32px)
- Label below (Body Small, 13px)
- Optional trend indicator (up/down arrow with percentage)
- Optional sparkline for mini trend visualization

**KPI Grid:**

- 2-4 stat cards in a row
- Equal width, responsive to single column on mobile

---

## 9. Interaction Patterns

### 9.1 Hover States

- **Links:** underline on hover
- **Buttons:** subtle background darken (10%)
- **Cards:** lift with shadow increase
- **Table rows:** background change to `Mist`
- **Icons:** opacity increase or color shift

Transition duration: **150ms** for most interactions, **300ms** for complex animations

### 9.2 Focus States

- **Keyboard focus:** 2px outline in `Bright Cyan` at 50% opacity, 2px offset
- Never remove focus indicators
- Ensure focus order follows logical tab sequence

### 9.3 Active States

- **Buttons:** background darken (15%), slight scale down (0.98)
- **Links:** color shift to darker variant

### 9.4 Disabled States

- Reduce opacity to 50%
- Cursor: not-allowed
- Remove hover/active interactions

---

## 10. Empty States

Empty states should be helpful, not just blank.

**Structure:**

- Icon (xl size, 32px)
- Heading ("No [items] yet")
- Description (brief explanation)
- Primary action button (when applicable)

**Example:**

```
┌──────────────────────────┐
│      📝                  │
│  No scripts generated    │
│  yet                     │
│                          │
│  Start creating content  │
│  by running the          │
│  ScriptwriterAgent.      │
│                          │
│  [ Run Agent ]           │
└──────────────────────────┘
```

---

## 11. Accessibility

### 11.1 Color Contrast

- Maintain **4.5:1 minimum contrast** for normal text (WCAG AA)
- Maintain **3:1 minimum contrast** for large text (18px+)
- Never rely on color alone to communicate information

### 11.2 Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Support Escape key to close modals/dropdowns
- Support Enter/Space to activate buttons

### 11.3 Screen Readers

- Use semantic HTML (nav, main, article, aside, header, footer)
- Provide `aria-label` for icon-only buttons
- Use `role` attributes when necessary
- Announce dynamic content changes with `aria-live`

### 11.4 Motion

- Respect `prefers-reduced-motion` media query
- Disable animations for users who prefer reduced motion

---

## 12. Dark Mode (Optional)

ACE Command Center defaults to a **dark theme** given its operational nature, but light mode can be supported.

**Dark Mode Palette:**

- Background: `Ink` (#0f172a)
- Surface: `Deep Slate` (#1e293b)
- Text primary: `Mist` (#f1f5f9)
- Text secondary: `Slate` (#64748b)

**Light Mode Palette:**

- Background: `Snow` (#ffffff)
- Surface: `Mist` (#f1f5f9)
- Text primary: `Ink` (#0f172a)
- Text secondary: `Charcoal` (#334155)

Semantic colors remain consistent across themes.

---

## 13. Implementation Notes

### 13.1 CSS Variables

Define all design tokens as CSS custom properties:

```css
:root {
  /* Colors */
  --color-primary: #06b6d4;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  
  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 16px;
}
```

### 13.2 Component Framework

If using React (recommended for ACE frontend):

- Build reusable components in `src/components/ui/`
- Use TypeScript for prop typing
- Use **shadcn/ui** or **Radix UI** as base primitives
- Customize with ACE design tokens

### 13.3 Testing

- Test all components in isolation (Storybook recommended)
- Test keyboard navigation
- Test screen reader compatibility
- Test responsive behavior at all breakpoints
- Test dark/light mode switching (if implemented)

---

## 14. Evolution

This design system is a living document.

**When adding new patterns:**

1. Document the new component or pattern here
2. Ensure consistency with existing principles
3. Test accessibility and responsiveness
4. Update relevant component library

**When modifying existing patterns:**

1. Note the change and rationale
2. Update all instances across the application
3. Verify no regressions in existing screens

---

**Last Updated:** 2026-01-05

**Maintainer:** ACE Engineering Team

**Related:** [ACE Frontend Interaction Model](https://www.notion.so/ACE-Frontend-Interaction-Model-2c8be295a73e816caad9e5a0754deddd?pvs=21)