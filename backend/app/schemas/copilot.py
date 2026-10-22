from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CopilotQueryRequest(BaseModel):
    case_id: str = Field(..., description="Target case identifier, e.g. CASE-001")
    prompt: str = Field(..., min_length=2, max_length=2000, description="Analyst investigative query")
    provider: Optional[str] = Field(default=None, description="Optional provider override: 'ollama' or 'gemini'")


class CopilotCitation(BaseModel):
    id: str = Field(..., description="Evidence record ID, e.g. EVD-001")
    title: str = Field(..., description="Evidence title")
    checksum: Optional[str] = Field(default=None, description="Cryptographic SHA-256 seal")


class CopilotQueryResponse(BaseModel):
    case_id: str
    prompt: str
    answer: str
    provider: str
    model: str
    status: str = Field(description="Query status: 'generated', 'grounded_retrieval', or 'provider_standby'")
    citations: List[CopilotCitation] = Field(default_factory=list)
    factual_observations: List[str] = Field(default_factory=list)
    analytical_leads: List[str] = Field(default_factory=list)
    unverified_gaps: List[str] = Field(default_factory=list)
    latency_ms: int = Field(default=0)


class CopilotStatusResponse(BaseModel):
    active_provider: str
    configured_model: str
    ollama_available: bool
    ollama_endpoint: str
    gemini_available: bool
    gemini_model: str
    system_readiness: str
    setup_guide: Dict[str, str]
