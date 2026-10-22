from typing import Any, Dict, List
from app.core.config import settings
from app.services.ai.base import BaseAIProvider, AIHypothesisLead, AIContradictionItem


class GeminiProvider(BaseAIProvider):
    """
    Optional hosted cloud AI provider using Google Gemini API.
    Activated ONLY via explicit user configuration (AI_PROVIDER=gemini) with a valid GEMINI_API_KEY.
    """

    def __init__(self, api_key: str = settings.GEMINI_API_KEY, model: str = settings.GEMINI_MODEL):
        self.api_key = api_key
        self.model = model
        self.timeout = settings.GEMINI_TIMEOUT_SECONDS

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_identifier(self) -> str:
        return self.model

    async def is_available(self) -> bool:
        """Check if API key is populated and configured."""
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def generate_hypotheses(
        self,
        case_summary: str,
        evidence_snippets: List[Dict[str, Any]]
    ) -> List[AIHypothesisLead]:
        if not await self.is_available():
            raise RuntimeError("Google Gemini API is not configured. Provide GEMINI_API_KEY in backend environment.")
        return []

    async def detect_contradictions(
        self,
        statements: List[Dict[str, Any]]
    ) -> List[AIContradictionItem]:
        if not await self.is_available():
            raise RuntimeError("Google Gemini API is not configured. Provide GEMINI_API_KEY in backend environment.")
        return []
