from fastapi import APIRouter
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.cases import router as cases_router
from app.api.v1.endpoints.entities import router as entities_router
from app.api.v1.endpoints.evidence import router as evidence_router
from app.api.v1.endpoints.relationships import router as relationships_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.timeline import router as timeline_router
from app.api.v1.endpoints.hypotheses import router as hypotheses_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router, tags=["Health & Diagnostics"])
api_v1_router.include_router(dashboard_router, tags=["Investigative Dashboard"])
api_v1_router.include_router(cases_router, tags=["Cases & Dossiers"])
api_v1_router.include_router(entities_router, tags=["Entities & Subjects"])
api_v1_router.include_router(evidence_router, tags=["Evidence Vault"])
api_v1_router.include_router(relationships_router, tags=["Knowledge Graph Relationships"])
api_v1_router.include_router(timeline_router, tags=["Chronological Timeline"])
api_v1_router.include_router(hypotheses_router, tags=["ACH Hypotheses"])

