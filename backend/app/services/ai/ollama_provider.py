from typing import Any, Dict, List
import httpx
from app.core.config import settings
from app.services.ai.base import BaseAIProvider, AIHypothesisLead, AIContradictionItem


class OllamaProvider(BaseAIProvider):
    """
    Default local offline AI provider using open-weight Gemma 4 E4B via Ollama.
    Preserves absolute data sovereignty by running strictly on the analyst workstation / local network.
    """

    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, model: str = settings.OLLAMA_MODEL):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = settings.OLLAMA_TIMEOUT_SECONDS

    @property
    def provider_name(self) -> str:
        return "ollama"

    @property
    def model_identifier(self) -> str:
        return self.model

    async def is_available(self) -> bool:
        """Ping local Ollama daemon to check if it's responsive."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False

    async def generate_hypotheses(
        self,
        case_summary: str,
        evidence_snippets: List[Dict[str, Any]]
    ) -> List[AIHypothesisLead]:
        # Phase 1: Architecture boundary established; full generative pipeline activates in Phase 8
        if not await self.is_available():
            raise RuntimeError(f"Local Ollama provider at {self.base_url} is not currently reachable.")
        return []

    async def detect_contradictions(
        self,
        statements: List[Dict[str, Any]]
    ) -> List[AIContradictionItem]:
        if not await self.is_available():
            raise RuntimeError(f"Local Ollama provider at {self.base_url} is not currently reachable.")
        return []
