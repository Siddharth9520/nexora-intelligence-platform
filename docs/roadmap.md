# NEXORA Phased Engineering Roadmap

> **Tagline:** *Every Connection Reveals a Clue.*  
> **Methodology:** Evidence-first, incremental delivery with continuous verification and zero unvalidated claims.

---

## Roadmap Overview

```mermaid
gantt
    title NEXORA Multi-Phase Implementation Roadmap
    dateFormat  YYYY-MM
    section Core Foundation
    Phase 1: Project Foundation & Engineering Blueprint :done, p1, 2026-03, 1M
    Phase 2: Case Explorer & Canonical Store            :active, p2, 2026-04, 1M
    section Analytical Canvases
    Phase 3: Intelligence Knowledge Graph               :p3, 2026-05, 1M
    Phase 4: Geospatial Intelligence & Density Maps     :p4, 2026-06, 1M
    Phase 5: Modus Operandi Similarity Engine           :p5, 2026-07, 1M
    Phase 6: Temporal Reconstruction & Timeline         :p6, 2026-08, 1M
    section Evidence & AI
    Phase 7: Evidence Vault & Provenance Tracking       :p7, 2026-09, 1M
    Phase 8: Local Intelligence Copilot (Gemma 4 E4B)   :p8, 2026-10, 1M
    Phase 9: Competing Hypotheses Workbench (ACH)       :p9, 2026-11, 1M
    section Fusion & Production
    Phase 10: Coordinated Intelligence Fusion Studio    :p10, 2026-12, 1M
    Phase 11: Source-Linked Analytical Reporting        :p11, 2027-01, 1M
    Phase 12: Data Quality, Integrity & Audit Workspace :p12, 2027-02, 1M
```

---

## Detailed Phase Breakdown

### Phase 1: Project Foundation & Engineering Blueprint *(Current Phase)*
- **Objective:** Establish monorepo structure, API contracts, foundational Pydantic schemas, initial Next.js application shell, and development verification pipelines.
- **Deliverables:**
  - Standardized root monorepo layout (`frontend/`, `backend/`, `shared/`, `docs/`).
  - FastAPI application with `/api/v1/health` and OpenAPI specification.
  - Next.js workspace with dark analytical UI, sidebar navigation, and live API connectivity indicator.
  - Core domain schemas: `Case`, `Entity`, `Incident`, `Evidence`, `Relationship`.
  - Pytest suite and frontend build verification.

### Phase 2: Case Explorer & Canonical Synthetic Dataset
- **Objective:** Build the case management and dossier navigation workspace.
- **Deliverables:**
  - Rich synthetic investigation datasets (Operation Vanguard Horizon, Cyber-Physical Grid Incident, Synthetic Asset Theft).
  - Search, filter, and dossier detail views with associated incident, entity, and evidence rosters.
  - Referential integrity check runner.

### Phase 3: Intelligence Knowledge Graph
- **Objective:** Interactive link analysis and relationship visualization.
- **Deliverables:**
  - Force-directed and hierarchical graph visualization (Cytoscape.js / D3).
  - Degree, betweenness, and eigenvector centrality highlighting.
  - Multi-hop traversal, neighborhood isolation, and relationship evidence inspection modals.

### Phase 4: Geospatial Intelligence & Incident-Density Heatmaps
- **Objective:** Spatial analysis and incident clustering.
- **Deliverables:**
  - Interactive map canvas (MapLibre GL / Leaflet).
  - Dynamic incident-density heatmaps, bounding-box filters, and spatial cluster detection.
  - Coordinated cross-filtering with active case entities.

### Phase 5: Modus Operandi (MO) Analysis & Similarity Scoring
- **Objective:** Behavioral and tactical pattern matching.
- **Deliverables:**
  - Feature-vector extraction for tactics, entry methods, tool signatures, and timing.
  - Explainable similarity scoring with transparent sub-score breakdowns (no black-box scoring).
  - Cross-case pattern detection matrix.

### Phase 6: Temporal Reconstruction & Timeline Analysis
- **Objective:** Chronological multi-stream sequence analysis.
- **Deliverables:**
  - Multi-lane interactive timeline canvas.
  - Gap and anomaly detection in incident sequences.
  - Coordinated playback mode syncing timeline positions with map pins and graph nodes.

### Phase 7: Evidence Vault & Provenance Tracking
- **Objective:** Immutable digital and physical evidence ledger.
- **Deliverables:**
  - Cryptographic checksum verification (SHA-256).
  - Custody chain tracking with historical custody transfers.
  - Full-text faceted search across digital artifacts, witness statements, and forensic reports.

### Phase 8: Local Intelligence Copilot (Gemma 4 E4B via Ollama)
- **Objective:** Offline, private assistive reasoning copilot.
- **Deliverables:**
  - Streaming investigative chat drawer powered by local Ollama `gemma4`.
  - Compulsory evidence citation engine with interactive vault links.
  - Optional Google Gemini API integration module with strict user opt-in and zero fallback.

### Phase 9: Competing Hypotheses Workbench (Analysis of Competing Hypotheses)
- **Objective:** Structured analytical technique (ACH) matrix.
- **Deliverables:**
  - Matrix interface evaluating multiple working hypotheses against all collected evidence.
  - Evidence consistency / inconsistency scoring to mitigate confirmation bias.
  - Hypothesis credibility ranking.

### Phase 10: Intelligence Fusion Studio
- **Objective:** Unified multi-pane analytical workstation.
- **Deliverables:**
  - Coordinated docking workspace synchronizing Graph, Map, Timeline, and Copilot.
  - Cross-canvas entity pinning and focus lock.
  - Real-time analytical scratchpad.

### Phase 11: Source-Linked Analytical Reporting
- **Objective:** Exportable, audit-ready intelligence products.
- **Deliverables:**
  - Automated report builder generating briefing documents with interactive or printed footnotes.
  - Provenance appendices linking every conclusion to verified evidence checksums.
  - PDF and Markdown export formats.

### Phase 12: Data Quality, Integrity & Audit Workspace
- **Objective:** System health, referential consistency, and auditability.
- **Deliverables:**
  - Automated graph cycle and orphaned node detection.
  - Chain-of-custody cryptographic audit log verification.
  - Analytical activity logging for forensic accountability.
