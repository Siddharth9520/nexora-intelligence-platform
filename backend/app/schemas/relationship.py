from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class Relationship(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^REL-[0-9]{3,}$",
        description="Stable relationship identifier, e.g. REL-001"
    )
    case_id: str = Field(
        ...,
        pattern=r"^CASE-[0-9]{3,}$",
        description="Parent case identifier"
    )
    source_id: str = Field(..., description="Source entity, location, or incident identifier")
    target_id: str = Field(..., description="Target entity, location, or incident identifier")
    relationship_type: str = Field(
        ...,
        description="Typed link: present_at, communicated_with, employed_by, controls, transferred_funds, co_occurring"
    )
    direction: str = Field(
        default="directed",
        description="Directionality: directed, bidirectional, undirected"
    )
    weight: float = Field(
        default=0.8,
        ge=0.0,
        le=1.0,
        description="Normalized link strength weight (0.0 to 1.0)"
    )
    start_time: Optional[datetime] = Field(default=None, description="Optional temporal validity window start")
    end_time: Optional[datetime] = Field(default=None, description="Optional temporal validity window end")
    supporting_evidence_ids: List[str] = Field(
        default_factory=list,
        description="Evidence identifiers validating this link"
    )
    inference_type: str = Field(
        default="factual",
        description="Provenance level: 'factual' (hard evidence), 'analytical_lead' (algorithmic correlation), 'ai_hypothesis' (AI suggestion)"
    )
    confidence: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Confidence score in the veracity of the link"
    )
    notes: Optional[str] = Field(default=None, description="Analyst notes and context")
