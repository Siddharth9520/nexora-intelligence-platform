# NEXORA AI Provider Strategy & Engineering Policy

> **Core Mandate:** *AI generates investigative leads. The analyst makes the decision.*

---

## 1. Philosophical & Operational Principles

1. **Assistance, Not Decision-Making:**
   AI models within NEXORA are exploratory assistants. They generate hypotheses, summarize complex records, and highlight potential contradictions. They never issue legal conclusions, declare guilt, or modify factual evidence records.

2. **Source Truth Separation:**
   All outputs produced by AI models are explicitly tagged with `origin: "ai_hypothesis"`, model metadata, timestamp, and confidence indicators. They are visually demarcated from factual synthetic evidence using distinct analytical styling.

3. **Strict Zero-Fallback Policy:**
   Under **no circumstance** will NEXORA silently fall back from a local open-weight model to an external hosted cloud API. If the local Ollama instance is unreachable or overloaded, the user is notified of local model downtime. Switching to a cloud service (e.g., Google Gemini) requires explicit user configuration and consent.

4. **Independent Deterministic Core:**
   The entire analytical workbench—including the Knowledge Graph, Geospatial Heatmap, Temporal Timeline, MO similarity scoring, and Evidence Vault—remains 100% operational when no AI model is active (`AI_PROVIDER="none"`).

---

## 2. Supported AI Providers

### 2.1 Primary Baseline: Open-Weight Gemma 4 E4B via Ollama
- **Model Identifier:** `gemma4` (or `gemma4:latest`)
- **Execution Environment:** Local on-premises or developer workstation via Ollama REST API (`http://localhost:11434/api/generate` and `/api/chat`).
- **Characteristics:**
  - Complete data sovereignty: zero forensic or investigative tokens leave the local network.
  - Predictable latency without third-party rate limits.
  - Open weights with reproducible inference parameters (temperature, seed).
- **Deployment Prerequisites:**
  - Installed Ollama daemon.
  - Minimum 8 GB to 16 GB unified RAM for 4-bit / 8-bit quantized weights.

### 2.2 Secondary / Optional Hosted Provider: Google Gemini API
- **Model Identifier:** `gemini-1.5-pro` / `gemini-1.5-flash`
- **Execution Environment:** Hosted Google Cloud API endpoints via official Python SDK (`google-genai` / `google-generativeai`).
- **Characteristics:**
  - Extended context window for massive multi-case synthesis and cross-dossier reconciliation.
  - High reasoning bandwidth for deep contradiction detection across voluminous witness reports.
- **Security & Privacy Boundary:**
  - Strictly requires `AI_PROVIDER=gemini` and a valid `GEMINI_API_KEY` in backend environment variables.
  - Secret keys are **never** exposed to client-side bundles or HTTP responses.
  - Data transmission occurs exclusively between the backend service and Google API endpoints over TLS.

---

## 3. Abstract Provider Architecture

All AI providers implement a standardized Python Abstract Base Class (`BaseAIProvider`):

```python
from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.ai import HypothesisProposal, CaseSummary, ContradictionReport

class BaseAIProvider(ABC):
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if the provider service is reachable and responsive."""
        pass

    @abstractmethod
    async def generate_hypotheses(
        self,
        case_summary: str,
        evidence_snippets: List[dict]
    ) -> List[HypothesisProposal]:
        """Propose investigative hypotheses strictly tied to evidence IDs."""
        pass

    @abstractmethod
    async def detect_contradictions(
        self,
        statements: List[dict]
    ) -> List[ContradictionReport]:
        """Identify conflicting factual claims across evidence records."""
        pass
```

---

## 4. Evidence Citation Validation Pipeline

To eliminate model hallucinations:
1. Every structured hypothesis output must return a list of `cited_evidence_ids` (e.g., `["EVD-001", "EVD-003"]`).
2. The backend `EvidenceValidator` intercepts model output and verifies that all cited IDs exist in the active case.
3. Citations that fail verification are stripped or flagged as `unverified_claim`.
4. The analyst UI displays an interactive citation badge linking directly to the primary document in the Evidence Vault.
