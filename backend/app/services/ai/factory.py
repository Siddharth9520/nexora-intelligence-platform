from typing import Optional
from app.core.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.ollama_provider import OllamaProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.schemas.health import AIProviderStatus


def get_ai_provider() -> Optional[BaseAIProvider]:
    """
    Factory function returning the active AI provider according to configuration.
    Strict policy: Never silently fallback between local and hosted providers.
    """
    provider_key = settings.AI_PROVIDER.lower().strip()
    if provider_key == "ollama":
        return OllamaProvider()
    elif provider_key == "gemini":
        return GeminiProvider()
    return None


async def get_ai_provider_status() -> AIProviderStatus:
    """Inspects configuration and availability of AI subsystems for the health endpoint."""
    provider_key = settings.AI_PROVIDER.lower().strip()
    ollama_configured = bool(settings.OLLAMA_BASE_URL)
    gemini_configured = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)

    status = "standby"
    provider = get_ai_provider()
    if provider:
        available = await provider.is_available()
        status = "ready" if available else "unreachable"

    return AIProviderStatus(
        active_provider=provider_key,
        ollama_configured=ollama_configured,
        gemini_configured=gemini_configured,
        status=status
    )
