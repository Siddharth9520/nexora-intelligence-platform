from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class Hypothesis(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^HYP-[0-9]{3,}$",
        description="Stable hypothesis identifier, e.g. HYP-001"
    )
    case_id: str = Field(
        ...,
        pattern=r"^CASE-[0-9]{3,}$",
        description="Associated case identifier"
    )
    statement: str = Field(..., min_length=10, description="Hypothesis proposition text")
    origin: str = Field(
        default="analyst",
        description="Origin: 'analyst' (human-authored) or 'ai_copilot' (model-proposed)"
    )
    model_name: Optional[str] = Field(
        default=None,
        description="Model identifier if originated from AI (e.g. gemma4, gemini-1.5-pro)"
    )
    supporting_evidence_ids: List[str] = Field(
        default_factory=list,
        description="Evidence records supporting this hypothesis"
    )
    inconsistent_evidence_ids: List[str] = Field(
        default_factory=list,
        description="Evidence records refuting or in tension with this hypothesis"
    )
    credibility_score: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Analyst-assigned or computed credibility score"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp"
    )
