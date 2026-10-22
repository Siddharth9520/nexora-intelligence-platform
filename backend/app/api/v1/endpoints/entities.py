from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.entity import Entity
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/entities",
    response_model=List[Entity],
    summary="List All Verified Entities",
    description="Returns all verified synthetic entities across cases, optionally filtered by case identifier."
)
async def list_entities(
    case_id: Optional[str] = Query(default=None, description="Optional case identifier filter, e.g. CASE-001")
) -> List[Entity]:
    if case_id and not canonical_store.get_case(case_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' was not found."
        )
    return canonical_store.get_all_entities(case_id=case_id)


@router.get(
    "/cases/{case_id}/entities",
    response_model=List[Entity],
    summary="List Entities for Case",
    description="Returns all verified synthetic entities linked to the given case dossier."
)
async def get_entities_for_case(case_id: str) -> List[Entity]:
    case = canonical_store.get_case(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' was not found."
        )
    return canonical_store.get_entities_for_case(case_id)
