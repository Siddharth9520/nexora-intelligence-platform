from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.timeline import TimelineEvent
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/timeline",
    response_model=List[TimelineEvent],
    summary="List Timeline Events",
    description="Returns verified chronological events, optionally filtered by case identifier."
)
async def get_timeline(
    case_id: Optional[str] = Query(default=None, description="Optional case identifier filter, e.g. CASE-001")
) -> List[TimelineEvent]:
    return canonical_store.get_timeline(case_id=case_id)
