from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.relationship import Relationship
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/relationships",
    response_model=List[Relationship],
    summary="List All Verified Relationships",
    description="Returns all verified link graph edges, weights, provenance types, and supporting evidence citations, optionally filtered by case identifier."
)
async def list_relationships(
    case_id: Optional[str] = Query(default=None, description="Optional case identifier filter, e.g. CASE-001")
) -> List[Relationship]:
    if case_id and not canonical_store.get_case(case_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' was not found in the canonical store."
        )
    return canonical_store.get_all_relationships(case_id=case_id)


@router.get(
    "/cases/{case_id}/relationships",
    response_model=List[Relationship],
    summary="List Entity & Incident Relationships for Case",
    description="Returns all verified link graph edges, weights, provenance types, and supporting evidence citations for a case."
)
async def get_relationships_for_case(case_id: str) -> List[Relationship]:
    case = canonical_store.get_case(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' was not found in the canonical store."
        )
    return canonical_store.get_relationships_for_case(case_id)
