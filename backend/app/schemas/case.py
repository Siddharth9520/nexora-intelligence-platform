from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel, Field


class Case(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^CASE-[0-9]{3,}$",
        description="Stable case identifier, e.g. CASE-001"
    )
    title: str = Field(..., min_length=3, max_length=200, description="Investigation title")
    summary: str = Field(..., min_length=10, description="Comprehensive investigation abstract")
    status: str = Field(
        default="active",
        description="Case lifecycle status (e.g. active, archived, closed, cold)"
    )
    priority: str = Field(
        default="medium",
        description="Operational priority (low, medium, high, critical)"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC record creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC last update timestamp"
    )
    lead_analyst: str = Field(..., description="Designated lead intelligence analyst")
    incident_ids: List[str] = Field(default_factory=list, description="Associated incident identifiers")
    entity_ids: List[str] = Field(default_factory=list, description="Associated entity identifiers")
    evidence_ids: List[str] = Field(default_factory=list, description="Associated evidence identifiers")
    tags: List[str] = Field(default_factory=list, description="Categorization and indexing tags")


class CaseSummary(BaseModel):
    id: str
    title: str
    summary: str
    status: str
    priority: str
    lead_analyst: str
    incident_count: int
    entity_count: int
    evidence_count: int
    updated_at: datetime
