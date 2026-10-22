from datetime import datetime, timezone
from typing import List, Optional
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
    classification: Optional[str] = Field(
        default="SECRET // NOFORN",
        description="Security classification level"
    )


class CaseSummary(BaseModel):
    id: str = Field(..., description="Case identifier")
    title: str = Field(..., description="Investigation title")
    summary: str = Field(..., description="Case summary")
    status: str = Field(default="active", description="Case status")
    priority: str = Field(default="medium", description="Priority level")
    lead_analyst: str = Field(..., description="Lead analyst")
    incident_count: int = Field(default=0, description="Number of correlated incidents")
    entity_count: int = Field(default=0, description="Number of correlated entities")
    evidence_count: int = Field(default=0, description="Number of correlated evidence items")
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last updated timestamp"
    )
    classification: Optional[str] = Field(
        default="SECRET // NOFORN",
        description="Security classification level"
    )
