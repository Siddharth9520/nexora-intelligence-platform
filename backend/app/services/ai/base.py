from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AIHypothesisLead(BaseModel):
    statement: str = Field(..., description="The substantive lead or hypothesis statement")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence score")
    cited_evidence_ids: List[str] = Field(
        default_factory=list,
        description="Explicit evidence IDs directly grounding this lead"
    )
    reasoning_summary: str = Field(..., description="Short explanation of the analytical chain of thought")


class AIContradictionItem(BaseModel):
    item_a_id: str = Field(..., description="First evidence or statement ID")
    item_b_id: str = Field(..., description="Conflicting evidence or statement ID")
    explanation: str = Field(..., description="Explanation of why these two records are in tension")
    severity: str = Field(default="medium", description="Severity: low, medium, high")


class BaseAIProvider(ABC):
    """
    Abstract interface for AI intelligence providers.
    All models (local Ollama Gemma 4 or hosted Google Gemini) must conform to this contract.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Machine identifier of the provider."""
        pass

    @property
    @abstractmethod
    def model_identifier(self) -> str:
        """The specific model identifier (e.g. gemma4, gemini-1.5-pro)."""
        pass

    @abstractmethod
    async def is_available(self) -> bool:
        """Check whether the underlying model or API service is currently accessible."""
        pass

    @abstractmethod
    async def generate_hypotheses(
        self,
        case_summary: str,
        evidence_snippets: List[Dict[str, Any]]
    ) -> List[AIHypothesisLead]:
        """Propose investigative hypotheses strictly tied to evidence IDs."""
        pass

    @abstractmethod
    async def detect_contradictions(
        self,
        statements: List[Dict[str, Any]]
    ) -> List[AIContradictionItem]:
        """Identify conflicting factual claims across evidence records."""
        pass
