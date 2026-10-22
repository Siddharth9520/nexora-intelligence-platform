from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.cases import router as cases_router
from app.api.v1.endpoints.entities import router as entities_router
from app.api.v1.endpoints.evidence import router as evidence_router
from app.api.v1.endpoints.relationships import router as relationships_router

__all__ = [
    "health_router",
    "cases_router",
    "entities_router",
    "evidence_router",
    "relationships_router",
]
