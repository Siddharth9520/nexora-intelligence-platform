from datetime import datetime, timezone
from typing import Dict, Any
from pydantic import BaseModel, Field


class AIProviderStatus(BaseModel):
    active_provider: str = Field(..., description="Active AI provider: 'none', 'ollama', or 'gemini'")
    ollama_configured: bool = Field(..., description="Whether Ollama endpoint is configured")
    gemini_configured: bool = Field(..., description="Whether Gemini API key is configured")
    status: str = Field(..., description="Provider operational status: 'ready', 'standby', 'error'")


class CanonicalDataSummary(BaseModel):
    status: str = Field(..., description="Status of the canonical synthetic repository")
    cases_count: int = Field(default=0, description="Total verified synthetic cases loaded")
    entities_count: int = Field(default=0, description="Total synthetic entities")
    evidence_count: int = Field(default=0, description="Total synthetic evidence items")
    relationships_count: int = Field(default=0, description="Total synthetic relationship edges")


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Overall health state")
    service: str = Field(default="nexora-backend", description="Service identifier")
    version: str = Field(default="0.1.0", description="Backend service semantic version")
    environment: str = Field(..., description="Runtime environment")
    tagline: str = Field(default="Every Connection Reveals a Clue.", description="NEXORA motto")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Current server UTC timestamp"
    )
    ai_provider: AIProviderStatus = Field(..., description="AI subsystem status")
    canonical_data: CanonicalDataSummary = Field(..., description="Canonical store status")
