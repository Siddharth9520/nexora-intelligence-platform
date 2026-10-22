# NEXORA Design System: Tactical Intelligence Workstation

> **Version:** 2.0 (Phase 2 Deliverable)  
> **Tagline:** *Every Connection Reveals a Clue.*  
> **Stitch Project ID:** `7941793408295788763`  
> **Stitch Design System Asset:** `assets/868f587ffb7e49feb279c49fde995149`

---

## 1. Design Philosophy & Aesthetic Identity

NEXORA is an evidence-first investigative intelligence platform engineered for security analysts, forensic investigators, and intelligence researchers. The visual language conveys rigorous authority, mathematical precision, and audit-grade certainty.

### Core Visual Posture:
- **Restrained Dark Tactical Aesthetic:** Deep oceanic obsidians minimize optical fatigue during prolonged analytical sessions in low-light operations centers.
- **Precision-Machined Geometry:** Structural divisions rely on razor-thin 1px low-contrast boundaries (`rgba(148, 175, 214, 0.12)`) and calibrated tonal stacking rather than heavy dropshadows or theatrical blurs.
- **Zero Decorative Frivolity:** No speculative pulsing neon glows, fake biometric animations, or ungrounded statistics. Every visual cue communicates an epistemological reality.
- **Information-Dense yet Scannable:** Tightly calibrated typographic hierarchy and data tokens allow analysts to parse complex multi-source incidents without cognitive overwhelm.

---

## 2. Color Palette & Elevation Stacking

### 2.1 Spatial Surfaces & Canvas Stacking

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `surface-canvas` | `#070B14` | Deep viewport backdrop, terminal underlay, empty canvas base |
| `surface-lowest` | `#070E1E` | Inset code containers, deep canvas regions |
| `app-background` | `#0C1323` | Main application background |
| `surface-low` | `#141B2C` | Docked sidebars, top navigation chrome, context inspector |
| `surface-panel` | `#181F30` | Analytical workspaces, dossiers, evidence tables, graph canvases |
| `surface-raised` | `#232A3B` | Interactive tiles, raised cards, data rows, active buttons |
| `surface-highest` | `#2E3446` | Floating controls, popovers, dropdown menus |
| `surface-overlay` | `#1B2638` | Modals, triage dialogs, Command Palette (`Cmd+K`) container |
| `border-hairline` | `rgba(148, 175, 214, 0.12)` | Standard 1px divider and structural frame boundary |
| `border-elevated` | `rgba(148, 175, 214, 0.24)` | High-contrast borders on modals and selected cards |

---

### 2.2 Typographic Content Contrast

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `text-primary` | `#DCE2F9` | Primary headings, entity titles, verified data values |
| `text-secondary` | `#C8C4D7` | Analytical descriptions, dossier prose, supporting labels |
| `text-muted` | `#928EA0` | Timestamps, secondary metadata, table column headers |
| `text-subtle` | `#5F7391` | Keyboard shortcut badges, non-essential chrome, disabled labels |

---

### 2.3 Epistemological Semantic Color System

NEXORA enforces strict semantic color mapping to represent evidence provenance, analytical reasoning, and user control. **Color alone never communicates verification; every semantic cue is paired with explicit text and icons.**

| Classification | Primary Hex | Accent Dim | Semantic Role & Strict Guardrail |
| :--- | :--- | :--- | :--- |
| **Documented Fact** | `#5DE6FF` / `#22D3EE` | `rgba(34, 211, 238, 0.12)` | **Direct Source-Backed Evidence.** Cryptographic proofs, signed logs, CCTV frame captures, verified sensor readouts. Marked with cyan verification badge and SHA-256 seal. |
| **Analytical Result** | `#A5D8FF` | `rgba(165, 216, 255, 0.08)` | **Reproducible Analytical Method.** Signal waterfall transforms, RF propagation models, graph neighborhood traversals, degree centrality scores. |
| **AI Investigative Lead** | `#FFB957` / `#F5A524` | `rgba(245, 165, 36, 0.12)` | **AI Suggestions & Uncertainty.** Gemma 4 E4B inferences, biometric facial matches, OCR text extractions. **Must always carry explicit confidence rating (e.g., `CONF: 85%`) and unverified disclaimer.** |
| **User Interaction** | `#8C80FF` / `#7C6CFF` | `#C6BFFF` | **Commands & User Focus.** Active navigation items, selected graph nodes, primary action buttons, active tab indicators. |
| **Successful Operation** | `#35C98A` | `rgba(53, 201, 138, 0.12)` | **Verified System Success.** Genuine operational completions (e.g., successful hash verification, database transaction committed). Never displayed for mocked responses. |
| **Threat / Critical Warning** | `#FF647C` / `#FFB4AB` | `rgba(255, 100, 124, 0.15)` | **Perimeter Breaches & Integrity Violations.** Active intrusion alarms, tamper alerts, destructive action triggers, invalid hash warnings. |
| **Neutral / Unknown** | `#474554` / `#5F7391` | `rgba(95, 115, 145, 0.1)` | **Missing or Unverified Data.** Evidentiary voids, unavailable sensors, unconfigured providers. |

---

## 3. Typography Scale & Font Architecture

NEXORA employs a three-tier typographic hierarchy strictly separating display authority, analytical narrative, and technical metadata.

```
Space Grotesk (Headings & Display Authority)
├── Geist (Body, Analytical Prose & Interface Navigation)
└── JetBrains Mono (Technical Data, Hashes, Coordinates & Telemetry)
```

### 3.1 Type Scale

| Level | Font Family | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Space Grotesk | 36px (2.25rem) | 700 | 44px (2.75rem) | `-0.03em` | Command Center hero, case codename |
| `headline-lg` | Space Grotesk | 24px (1.5rem) | 600 | 32px (2rem) | `-0.02em` | Workspace module titles, dossier headers |
| `headline-md` | Space Grotesk | 20px (1.25rem) | 600 | 28px (1.75rem) | `-0.01em` | Section headings, modal titles, ACH columns |
| `headline-sm` | Space Grotesk | 18px (1.125rem) | 500 | 24px (1.5rem) | `0em` | Card titles, inspector object names |
| `body-lg` | Geist | 16px (1rem) | 400 | 24px (1.5rem) | `-0.01em` | Primary analytical briefings, copilot answers |
| `body-md` | Geist | 14px (0.875rem) | 400 | 22px (1.375rem) | `-0.005em` | Standard interface text, table cells, form labels |
| `body-sm` | Geist | 12px (0.75rem) | 400 | 18px (1.125rem) | `0em` | Supporting captions, helper text |
| `data-mono` | JetBrains Mono | 12px (0.75rem) | 400 | 16px (1rem) | `+0.01em` | Coordinates, SHA-256 hashes, timestamps |
| `label-md` | JetBrains Mono | 13px (0.8125rem) | 500 | 18px (1.125rem) | `+0.02em` | Filter pills, status badges, confidence meters |
| `label-sm` | JetBrains Mono | 11px (0.6875rem) | 500 | 16px (1rem) | `+0.04em` | Category eyebrows, table column headers |

---

## 4. Spacing, Geometry & Component Tokens

### 4.1 Base Units & Spacing
- **Base Grid Unit:** `4px`
- **Spacing Scale:**
  - `space-xs`: `4px` (0.25rem) — micro-gap between icons and badges
  - `space-sm`: `8px` (0.5rem) — button internal padding, table cell vertical padding
  - `space-md`: `12px` (0.75rem) — card internal margins, form element spacing
  - `space-lg`: `16px` (1rem) — panel padding, standard column gutters
  - `space-xl`: `24px` (1.5rem) — section separation, hero section gaps
  - `space-2xl`: `32px` (2rem) — major workspace module dividers

### 4.2 Corner Radii
- `rounded-sm`: `4px` (0.25rem) — chips, monospace badges, checkbox boxes, input focus rings
- `rounded-md`: `8px` (0.5rem) — standard buttons, text inputs, dropdown triggers
- `rounded-lg`: `10px–12px` (0.75rem) — workspace panels, cards, data dossiers
- `rounded-xl`: `14px` (0.875rem) — modals, triage dialogs, Command Palette container
- `rounded-full`: `9999px` — status indicators, geospatial waypoints, graph nodes

---

## 5. Component Library Standards

### 5.1 Primary Navigation Sidebar
- **Expanded Width:** `240px–250px`
- **Collapsed Width:** `64px`
- **Sections:**
  - `ANALYZE`: Command Center, Cases, Knowledge Graph, Map
  - `EVIDENCE`: Evidence Vault, Timeline
  - `REASON`: AI Copilot, Hypotheses
  - `PREFERENCES`: Settings, Help
- **Active State:** Solid `#7C6CFF` / `#8C80FF` border highlight, tinted background (`rgba(124, 108, 255, 0.1)`), glowing status dot.

### 5.2 Top Command Bar
- **Height:** `52px–56px`
- **Components:** Interactive breadcrumb trail, Global Command Search (`Cmd+K`), real-time Backend status badge (`:8000`), Model Engine badge, and User clearance avatar.

### 5.3 Context Inspector Panel
- **Width:** `380px` (Desktop docked), `320px` (Tablet slide-out), Bottom Sheet (Mobile 70% height).
- **Default (No Selection):**
  - Title: *"No selection"*
  - Description: *"Select a case, entity, graph node, event, or evidence item to inspect its details."*
- **Populated State:** Direct metadata, cryptographic provenance hashes, linked entity registers, related timeline events, and actionable cross-module triggers (*"Trace In Graph"*, *"View In Vault"*).

### 5.4 Evidentiary Badges & Chips
- **Documented Fact:** Monospace `JetBrains Mono`, 11px uppercase, border `rgba(34, 211, 238, 0.3)`, bg `rgba(34, 211, 238, 0.08)`, text `#22D3EE`. Prepended with lock or verified shield icon.
- **AI Investigative Lead:** Monospace `JetBrains Mono`, 11px uppercase, border `rgba(245, 165, 36, 0.3)`, bg `rgba(245, 165, 36, 0.08)`, text `#F5A524`. Must display explicit confidence (e.g., `CONF: 85%`).

### 5.5 Buttons & Form Controls
- **Primary Button:** `#7C6CFF` background, `#FFFFFF` text, 8px radius, height 36px (desktop) / 44px (mobile/tablet). Hover: `#6A58FB`.
- **Tactical Secondary:** `#141C2F` surface, 1px border `rgba(148, 175, 214, 0.12)`, text `#E6EDF7`. Hover: `#1B2638`.
- **Destructive:** `#141C2F` surface, 1px border `rgba(255, 100, 124, 0.3)`, text `#FF647C`.

---

## 6. Interaction & Motion Principles

1. **Micro-Transitions:** 150ms–220ms ease-out transitions for hover, focus rings, and modal fade-ins.
2. **Reduced Motion Support:** Respects `prefers-reduced-motion` by replacing position shifts with instant opacity fades.
3. **No Decorative Animations:** Backgrounds remain completely static; graph nodes do not bounce or pulse constantly. Focus rings on selected objects pulse only once upon initial selection.
