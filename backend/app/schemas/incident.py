from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class Incident(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^INC-[0-9]{3,}$",
        description="Stable incident identifier, e.g. INC-001"
    )
    case_id: str = Field(
        ...,
        pattern=r"^CASE-[0-9]{3,}$",
        description="Parent case identifier"
    )
    title: str = Field(..., min_length=3, max_length=200, description="Incident title")
    incident_type: str = Field(..., description="Typology (e.g. physical_intrusion, cyber_breach, asset_transfer)")
    occurred_at: datetime = Field(..., description="Verified UTC occurrence timestamp")
    location_id: str = Field(
        ...,
        pattern=r"^LOC-[0-9]{3,}$",
        description="Associated location identifier"
    )
    summary: str = Field(..., min_length=10, description="Factual factual summary of the incident")
    severity: str = Field(default="medium", description="Severity rating: low, medium, high, critical")
    status: str = Field(default="verified", description="Status: pending_verification, verified, dismissed")
    mo_id: Optional[str] = Field(default=None, description="Associated Modus Operandi profile ID if linked")
    evidence_ids: List[str] = Field(default_factory=list, description="Directly supporting evidence identifiers")
