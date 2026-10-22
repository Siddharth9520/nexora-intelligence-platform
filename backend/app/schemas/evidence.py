from datetime import datetime, timezone
from typing import Any, Dict, List
from pydantic import BaseModel, Field


class CustodyEntry(BaseModel):
    timestamp: datetime = Field(..., description="UTC timestamp of the custody transfer or handling action")
    custodian: str = Field(..., description="Identity and credential of the handler (e.g. Officer or Analyst)")
    action: str = Field(..., description="Specific operational action taken on the evidence artifact")


class Evidence(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^EVD-[0-9]{3,}$",
        description="Stable evidence identifier, e.g. EVD-001"
    )
    case_id: str = Field(
        ...,
        pattern=r"^CASE-[0-9]{3,}$",
        description="Parent case identifier"
    )
    title: str = Field(..., min_length=3, max_length=200, description="Evidence title or artifact label")
    evidence_type: str = Field(
        ...,
        description="Type: digital_video, access_log, forensic_report, telemetry_dump, witness_statement"
    )
    source: str = Field(..., description="Originating source system, officer, or repository")
    collected_at: datetime = Field(..., description="UTC timestamp of collection")
    chain_of_custody: List[CustodyEntry] = Field(
        default_factory=list,
        description="Verifiable historical chain of custody entries"
    )
    checksum: str = Field(..., description="Cryptographic hash for artifact integrity (e.g. sha256:...)")
    confidence_score: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Assessed evidence reliability score between 0.0 and 1.0"
    )
    summary: str = Field(..., min_length=10, description="Factual analysis and description of artifact contents")
    raw_metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Forensic metadata (file size, resolution, sensor serials, packet counts)"
    )
