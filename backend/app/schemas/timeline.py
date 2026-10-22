from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class TimelineEvent(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^EVT-[0-9]{3,}$",
        description="Stable timeline event identifier, e.g. EVT-001"
    )
    case_id: str = Field(
        ...,
        pattern=r"^CASE-[0-9]{3,}$",
        description="Associated case identifier"
    )
    timestamp: datetime = Field(..., description="Atomic UTC timestamp")
    title: str = Field(..., min_length=3, max_length=200, description="Event title")
    event_type: str = Field(
        ...,
        description="Event category: physical_intrusion, rf_signal, scada_alarm, aerial_recon, egress"
    )
    epistemic_type: str = Field(
        default="fact",
        description="Epistemic tier: fact (Documented Fact), lead (AI Lead), result (Analytical Result)"
    )
    summary: str = Field(..., min_length=10, description="Brief narrative summary of event")
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Assessed confidence score")
    evidence_ids: List[str] = Field(default_factory=list, description="Linked evidence record IDs")
    entity_ids: List[str] = Field(default_factory=list, description="Correlated entity IDs")
    is_synthetic: bool = Field(default=True, description="Strict synthetic data flag")
