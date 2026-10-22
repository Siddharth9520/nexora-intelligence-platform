from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.hypothesis import Hypothesis
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/hypotheses",
    response_model=List[Hypothesis],
    summary="List Evaluated ACH Hypotheses",
    description="Returns competing hypotheses and their credibility ratings, optionally filtered by case identifier."
)
async def get_hypotheses(
    case_id: Optional[str] = Query(default=None, description="Optional case identifier filter, e.g. CASE-001")
) -> List[Hypothesis]:
    return canonical_store.get_hypotheses(case_id=case_id)
