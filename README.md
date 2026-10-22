# NEXORA Intelligence Platform

> **Tagline:** *Every Connection Reveals a Clue.*  
> **Core Principle:** *EVIDENCE IS THE SOURCE OF TRUTH. AI GENERATES INVESTIGATIVE LEADS. THE ANALYST MAKES THE DECISION.*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14_App_Router-black.svg?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_Strict-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Language-Python_3.11+-3776AB.svg?style=flat&logo=python)](https://python.org)
[![Tests](https://img.shields.io/badge/Tests-Pytest_Passing-success.svg?style=flat)]()

---

## 1. Product Vision

**NEXORA** is an AI-assisted evidence intelligence and relationship analysis platform engineered for law enforcement, investigative, forensic, and analytical workflows. It allows analysts to explore interconnected synthetic cases, incidents, entities, locations, timelines, and evidence through a unified, evidence-first workspace.

### Key Capabilities (Planned Across 12 Phases):
- **Interactive Knowledge Graphs:** Multi-hop link traversal, centrality analysis, and neighborhood isolation.
- **Evidence Provenance & Vault:** Immutable chain of custody with SHA-256 cryptographic verification.
- **Geospatial Intelligence & Heatmaps:** Density maps, incident clustering, and spatial bounding queries.
- **Modus Operandi (MO) Comparison:** Explainable tactical feature vectors with transparent similarity scoring.
- **Temporal Reconstruction:** Multi-stream chronological alignment and sequence anomaly detection.
- **Offline Local AI Copilot:** Private on-device reasoning using **Gemma 4 E4B** via Ollama (`gemma4`).
- **Optional Cloud Provider:** Google Gemini API integration with strict user opt-in and zero silent fallback.
- **Competing Hypothesis Workbench:** Analysis of Competing Hypotheses (ACH) matrix to eliminate confirmation bias.
- **Intelligence Fusion Studio:** Synchronized multi-pane workspace locking entity focus across canvases.

---

## 2. Project Architecture & Monorepo Layout

NEXORA uses a clean, lightweight monorepo architecture:

```text
nexora-intelligence-platform/
├── frontend/               # Next.js App Router, React 18, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/            # App router pages, layouts, and global styles
│   │   ├── components/     # UI components, layout shell, and dashboard widgets
│   │   ├── lib/            # Centralized API client (nexoraApi) and utilities
│   │   └── types/          # Domain TypeScript interfaces
│   ├── package.json        # Frontend dependencies & scripts
│   └── tsconfig.json       # Strict TypeScript configuration
├── backend/                # Python FastAPI analytical backend
│   ├── app/
│   │   ├── api/v1/         # Versioned endpoints (health, cases, entities, evidence, relationships)
│   │   ├── core/           # Centralized configuration (pydantic-settings)
│   │   ├── data/           # Canonical synthetic dataset & referential integrity checker
│   │   ├── schemas/        # Pydantic v2 schemas (Case, Entity, Incident, Evidence, Relationship)
│   │   ├── services/ai/    # AI provider abstraction layer (Ollama Gemma 4, Gemini API, Factory)
│   │   └── main.py         # FastAPI application entry point
│   ├── tests/              # Pytest test suite (health, schemas, integrity)
│   ├── pyproject.toml      # Build metadata and tool settings
│   └── requirements.txt    # Pinned Python dependencies
├── shared/                 # Cross-boundary contracts & definitions
│   ├── contracts/          # OpenAPI 3.1 JSON contract
│   └── types/              # Canonical TypeScript type declarations
├── docs/                   # Engineering blueprints & specifications
│   ├── system-architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── ai-provider-strategy.md
│   ├── development-setup.md
│   ├── design-system.md        # Tactical Intelligence Workstation design tokens & styles
│   ├── ux-architecture.md      # Information architecture, journeys & responsive specs
│   ├── stitch-screen-index.md  # Master catalog of Google Stitch screens
│   └── roadmap.md
├── .env.example            # Environment variable documentation
├── .gitignore              # Git exclusion rules
└── README.md               # Master documentation
```

---

## 3. Quickstart Guide

### 3.1 Prerequisites
- **Node.js:** v18.17+ or v20+ / v24+
- **Python:** 3.10+ or 3.11+
- **Git:** 2.30+

### 3.2 Backend Setup & Execution
From the root directory:
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux / macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend development server
python -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```
The backend will be available at:
- **API Health:** `http://127.0.0.1:8000/api/v1/health`
- **Swagger Documentation:** `http://127.0.0.1:8000/docs`
- **ReDoc Documentation:** `http://127.0.0.1:8000/redoc`

### 3.3 Frontend Setup & Execution
Open a separate terminal window:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run the Next.js development server
npm run dev
```
Open **`http://localhost:3000`** in your browser. The Command Center dashboard will display live health diagnostics and canonical synthetic records loaded from the backend.

---

## 4. Testing & Verification

### Backend Pytest Suite
```bash
cd backend
.\venv\Scripts\pytest tests/ -v
```
All 23 analytical tests pass:
- Root `/health` and `/api/v1/health` diagnostic API verification.
- Comprehensive `/api/v1/dashboard` aggregate count verification.
- Referential integrity verification across all cases, entities, evidence, relationships, timeline, and hypotheses (0 broken references).
- Complete endpoint coverage: `/api/v1/cases`, `/api/v1/entities`, `/api/v1/evidence`, `/api/v1/relationships`, `/api/v1/timeline`, `/api/v1/hypotheses`.
- Error and 404 handling validation.
- Pydantic schema validation (ID patterns, reliability scores, required fields).

### Frontend Production Build
```bash
cd frontend
npm run build
```
Production build succeeds with 0 errors and zero lint warnings.

---

## 5. Synthetic Data & AI Policy

- **Synthetic Records:** All data (`CASE-001` through `CASE-003`, `ENT-001` through `ENT-008`, `EVD-001` through `EVD-006`, `REL-001` through `REL-010`, `EVT-001` through `EVT-006`, `HYP-001` through `HYP-003`) are strictly synthetic demonstration artifacts. No real-world individuals, facilities, or incidents are referenced.
- **Local Gemma 4 E4B Baseline:** Local Ollama model (`gemma4`) provides private, on-device reasoning without transmitting data externally.
- **Zero Silent Fallback Policy:** The platform will never silently fall back from local Gemma to a cloud API.
- **Mandatory Provenance:** Every AI-generated proposition must cite explicit synthetic evidence IDs.

---

## 6. Implementation Roadmap

| Phase | Module | Status | Description |
| :---: | :--- | :---: | :--- |
| **1** | **Foundation & Blueprint** | **Complete** | Architecture, API gateway, Pydantic schemas, Next.js workspace, and live diagnostics. |
| **2** | **Product Design & UX** | **Complete** | Tactical Workstation design system, Stitch screens, responsive layouts, Command Palette, Context Inspector, and UX workflows. |
| **3** | **Rapid Demo Implementation** | **Complete** | In-memory synthetic dataset, 9 FastAPI routes, Cases Workstation, Knowledge Graph canvas, Timeline reconstruction, and GitHub sync. |
| **4** | **Knowledge Graph Engine** | Planned | Multi-hop Cytoscape/D3 graph canvas, centrality algorithms, and neighborhood isolation. |
| **5** | **Geospatial Intelligence** | Planned | MapLibre incident-density heatmaps and spatial coordinate clustering. |
| **6** | **Modus Operandi Analysis** | Planned | Tactical feature vectors and explainable similarity matrix. |
| **7** | **Temporal Analytics** | Planned | Deep multi-stream chronological alignment and sequence anomaly detection. |
| **8** | **Evidence Vault & Provenance** | Planned | Advanced cryptographic custody tracking, SHA-256 seals, and artifact inspection. |
| **9** | **Intelligence Copilot** | Planned | Local Gemma 4 E4B assistive drawer with compulsory evidence citations. |
| **10** | **Competing Hypotheses** | Planned | Richards Heuer ACH matrix with cognitive bias elimination. |
| **11** | **Report Generation** | Planned | Source-linked briefing document builder with exportable provenance. |
| **12** | **Data Quality & Audit** | Planned | Automated graph cycle detection, integrity audits, and user activity logging. |

---

## 7. License

Synthetic demonstration datasets and codebase are provided under the MIT License.

