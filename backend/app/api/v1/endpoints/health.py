from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse, CanonicalDataSummary
from app.services.ai.factory import get_ai_provider_status
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="System Health & Diagnostic Check",
    description="Returns backend runtime status, active AI provider configuration, and canonical dataset readiness."
)
async def get_system_health() -> HealthResponse:
    ai_status = await get_ai_provider_status()
    counts = canonical_store.get_summary_counts()

    canonical_summary = CanonicalDataSummary(
        status="loaded",
        cases_count=counts["cases_count"],
        entities_count=counts["entities_count"],
        evidence_count=counts["evidence_count"],
        relationships_count=counts["relationships_count"]
    )

    return HealthResponse(
        status="ok",
        service="nexora-backend",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        tagline=settings.TAGLINE,
        timestamp=datetime.now(timezone.utc),
        ai_provider=ai_status,
        canonical_data=canonical_summary
    )
