from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.case import Case, CaseSummary
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/cases",
    response_model=List[CaseSummary],
    summary="List All Verified Synthetic Cases",
    description="Retrieves a list of all active synthetic investigation dossiers with summary counts."
)
async def list_cases() -> List[CaseSummary]:
    return canonical_store.get_cases()


@router.get(
    "/cases/{case_id}",
    response_model=Case,
    summary="Get Specific Case Dossier",
    description="Retrieves comprehensive details of a specific synthetic case dossier by its stable identifier."
)
async def get_case_by_id(case_id: str) -> Case:
    case = canonical_store.get_case(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation case with identifier '{case_id}' was not found in the canonical store."
        )
    return case
