# NEXORA Data Model & Schema Specification

> **Guiding Axiom:** *Evidence is the source of truth. All data in NEXORA must have unambiguous provenance, immutable identifiers, and explicit referential integrity.*

---

## 1. Domain Entities & Stable Identifiers

All entities, records, and relationships within NEXORA adhere to a strict prefixed identifier convention:

| Domain Concept | ID Prefix | Format | Example | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Case** | `CASE-` | `CASE-[0-9]{3,}` | `CASE-001` | Master investigative container grouping related incidents and leads. |
| **Incident** | `INC-` | `INC-[0-9]{3,}` | `INC-001` | Distinct factual occurrence or event situated in space and time. |
| **Entity** | `ENT-` | `ENT-[0-9]{3,}` | `ENT-001` | Person, organization, vehicle, digital asset, or physical object. |
| **Location** | `LOC-` | `LOC-[0-9]{3,}` | `LOC-001` | Geographic point, boundary, or address with spatial coordinates. |
| **Evidence Record** | `EVD-` | `EVD-[0-9]{3,}` | `EVD-001` | Primary artifact (forensic, document, digital, testimonial). |
| **Relationship** | `REL-` | `REL-[0-9]{3,}` | `REL-001` | Typed directed edge connecting two entities or incidents. |
| **MO Profile** | `MO-` | `MO-[0-9]{3,}` | `MO-001` | Behavioral, tactical, or technical operational characteristics. |
| **Timeline Event** | `TLE-` | `TLE-[0-9]{3,}` | `TLE-001` | Verified chronological milestone anchored to timestamp and evidence. |
| **Hypothesis** | `HYP-` | `HYP-[0-9]{3,}` | `HYP-001` | Investigative theory, question, or AI-generated proposition. |

---

## 2. Core Schemas

### 2.1 Case Schema (`Case`)
```json
{
  "id": "CASE-001",
  "title": "Operation Vanguard Horizon",
  "summary": "Multi-jurisdictional investigation into coordinated industrial espionage targeting renewable grid infrastructure.",
  "status": "active",
  "priority": "high",
  "created_at": "2026-03-10T08:00:00Z",
  "updated_at": "2026-03-22T14:30:00Z",
  "lead_analyst": "Analyst J. Rivera",
  "incident_ids": ["INC-001", "INC-002"],
  "entity_ids": ["ENT-001", "ENT-002", "ENT-003"],
  "evidence_ids": ["EVD-001", "EVD-002", "EVD-003", "EVD-004"],
  "tags": ["critical-infrastructure", "cyber-physical", "espionage"]
}
```

### 2.2 Incident Schema (`Incident`)
```json
{
  "id": "INC-001",
  "case_id": "CASE-001",
  "title": "Unauthorized Substation Access at North Node",
  "incident_type": "physical_intrusion",
  "occurred_at": "2026-03-14T02:42:00Z",
  "location_id": "LOC-001",
  "summary": "Forced entry into telemetry cabin; physical extraction of serial control logs.",
  "severity": "critical",
  "status": "under_investigation",
  "mo_id": "MO-001",
  "evidence_ids": ["EVD-001", "EVD-002"]
}
```

### 2.3 Entity Schema (`Entity`)
```json
{
  "id": "ENT-001",
  "category": "person",
  "name": "Alex Mercer (Synthetic Subject Alpha)",
  "aliases": ["Cipher_9", "VanguardOperator"],
  "identifiers": {
    "badge_id": "SYN-EMP-4421",
    "rfid_key": "HEX:A4:99:C1:F0"
  },
  "attributes": {
    "role": "Systems Maintenance Contractor",
    "clearance": "Level-2 Restricted",
    "organization": "AeroGrid Industrial Services"
  },
  "reliability_score": 0.85,
  "notes": "Contract technician with verified physical access credential matching entry logs."
}
```

### 2.4 Evidence Record Schema (`Evidence`)
```json
{
  "id": "EVD-001",
  "case_id": "CASE-001",
  "title": "CCTV Footage - North Node Telemetry Cabin",
  "evidence_type": "digital_video",
  "source": "Physical Security System (Terminal Camera 04)",
  "collected_at": "2026-03-14T06:00:00Z",
  "chain_of_custody": [
    {
      "timestamp": "2026-03-14T06:15:00Z",
      "custodian": "Officer M. Davies (Badge #774)",
      "action": "Evidence extraction and SHA-256 seal generation"
    }
  ],
  "checksum": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "confidence_score": 0.95,
  "summary": "1080p footage showing subject in dark hooded coveralls using RFID token at 02:41:18."
}
```

### 2.5 Relationship Schema (`Relationship`)
```json
{
  "id": "REL-001",
  "case_id": "CASE-001",
  "source_id": "ENT-001",
  "target_id": "LOC-001",
  "relationship_type": "present_at",
  "direction": "directed",
  "weight": 0.9,
  "start_time": "2026-03-14T02:40:00Z",
  "end_time": "2026-03-14T03:10:00Z",
  "supporting_evidence_ids": ["EVD-001", "EVD-002"],
  "inference_type": "factual",
  "confidence": 0.95,
  "notes": "RFID access log and CCTV timestamp confirm physical presence."
}
```

---

## 3. Referential Integrity Rules

1. **Entity Referential Guarantee:** Every `source_id` and `target_id` in a `Relationship` must resolve to an existing `Entity` or `Location` in the canonical store.
2. **Provenance Mandatory on Inferred Relationships:** If `inference_type` is `ai_hypothesis` or `analytical_lead`, `supporting_evidence_ids` must include at least one valid `Evidence` record or explicitly mark the hypothesis as speculative.
3. **Immutability of Synthetic Truth:** Base synthetic records cannot be altered by analytical queries. Any user or AI-generated hypothesis must exist in an independent `Hypothesis` or `WorkspaceAnnotation` container.
4. **Temporal Ordering:** `Incident.occurred_at`, `TimelineEvent.timestamp`, and `Evidence.collected_at` must be valid ISO 8601 UTC strings with time-boundary coherence.
