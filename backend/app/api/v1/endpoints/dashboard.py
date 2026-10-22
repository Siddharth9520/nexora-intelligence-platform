from fastapi import APIRouter
from app.schemas.dashboard import DashboardSummary
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/dashboard",
    response_model=DashboardSummary,
    summary="Get Investigative Dashboard Summary",
    description="Returns aggregate counts, epistemic facts vs leads breakdown, and recent cases derived directly from the canonical store."
)
async def get_dashboard() -> DashboardSummary:
    return canonical_store.get_dashboard_summary()
