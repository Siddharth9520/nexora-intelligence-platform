# NEXORA API Contract & Transport Specification

> **Base Route:** `/api/v1`  
> **Protocol:** HTTP/1.1 or HTTP/2 over TLS / Cleartext HTTP in local dev.  
> **Content-Type:** `application/json`

---

## 1. Design Principles

1. **Deterministic Contracts:** All responses follow strict Pydantic schemas on the server and generated TypeScript types on the client.
2. **Standardized Response Envelope:** Every analytical endpoint returns data within a predictable envelope format with timestamp and correlation metadata.
3. **Graceful Degraded States:** When AI or optional services are unavailable, endpoints degrade predictably with clear status codes and informative diagnostics.

---

## 2. Global Error Format (RFC 7807)

```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "Entity with ID 'ENT-999' does not exist in the canonical dataset.",
    "status": 404,
    "timestamp": "2026-03-22T14:35:00Z",
    "details": {
      "entity_id": "ENT-999",
      "case_id": "CASE-001"
    }
  }
}
```

---

## 3. Core Phase 1 Endpoints

### 3.1 Health & Diagnostics
- **`GET /api/v1/health`**
  - **Purpose:** Verifies backend responsiveness, system runtime, configuration status, and AI provider readiness.
  - **Response Payload:**
    ```json
    {
      "status": "ok",
      "version": "0.1.0",
      "environment": "development",
      "timestamp": "2026-03-22T14:35:00Z",
      "service": "nexora-backend",
      "ai_provider": {
        "active_provider": "none",
        "ollama_configured": false,
        "gemini_configured": false,
        "status": "standby"
      },
      "canonical_data": {
        "status": "loaded",
        "cases_count": 3,
        "entities_count": 12,
        "evidence_count": 18
      }
    }
    ```

### 3.2 Cases API
- **`GET /api/v1/cases`**: List all active synthetic cases with summary statistics.
- **`GET /api/v1/cases/{case_id}`**: Retrieve full details of a specific case including associated incidents, entities, and evidence IDs.

### 3.3 Entities & Graph API
- **`GET /api/v1/cases/{case_id}/entities`**: Retrieve all entities linked to the specified case.
- **`GET /api/v1/cases/{case_id}/relationships`**: Retrieve all graph edges connecting entities within the case.

### 3.4 Evidence Vault API
- **`GET /api/v1/cases/{case_id}/evidence`**: Retrieve all evidence items with chain-of-custody and verification checksums.
- **`GET /api/v1/evidence/{evidence_id}`**: Retrieve full details and raw artifact metadata for an individual evidence record.

---

## 4. Contract Generation Strategy

- The backend exposes an OpenAPI 3.1 specification at `/api/v1/openapi.json`.
- A synchronization script (`shared/scripts/sync-types.py` / `sync-types.ts`) inspects the OpenAPI schema and generates strongly typed TypeScript interfaces in `shared/types/` and `frontend/src/types/`.
- Frontend code directly imports these interfaces, preventing schema drift.
