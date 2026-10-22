from typing import Dict, List, Any
from pydantic import BaseModel, Field
from app.schemas.case import CaseSummary


class EpistemicBreakdown(BaseModel):
    facts_count: int = Field(default=0, description="Total documented facts with cryptographic backing")
    results_count: int = Field(default=0, description="Total reproducible analytical results")
    leads_count: int = Field(default=0, description="Total AI investigative leads requiring verification")


class DashboardSummary(BaseModel):
    total_cases: int = Field(..., description="Total synthetic cases in store")
    total_entities: int = Field(..., description="Total tracked entities")
    total_evidence: int = Field(..., description="Total evidence items cataloged")
    total_relationships: int = Field(..., description="Total knowledge graph edges")
    total_timeline_events: int = Field(..., description="Total chronological events")
    total_hypotheses: int = Field(..., description="Total ACH hypotheses evaluated")
    epistemic_breakdown: EpistemicBreakdown = Field(..., description="Facts vs results vs leads")
    system_status: Dict[str, Any] = Field(..., description="Truthful backend and inference engine statuses")
    recent_cases: List[CaseSummary] = Field(..., description="List of latest case summaries")
    is_synthetic_demonstration: bool = Field(default=True, description="Strict synthetic data flag")
