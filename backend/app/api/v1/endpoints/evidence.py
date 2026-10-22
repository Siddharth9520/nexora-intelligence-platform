from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.evidence import Evidence
from app.data.canonical_store import canonical_store

router = APIRouter()


@router.get(
    "/evidence",
    response_model=List[Evidence],
    summary="List All Verified Evidence",
    description="Returns all verified evidence records across cases, optionally filtered by case identifier."
)
async def list_evidence(
    case_id: Optional[str] = Query(default=None, description="Optional case identifier filter, e.g. CASE-001")
) -> List[Evidence]:
    if case_id and not canonical_store.get_case(case_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' was not found."
        )
    return canonical_store.get_all_evidence(case_id=case_id)


@router.get(
    "/cases/{case_id}/evidence",
    response_model=List[Evidence],
    summary="List Evidence Records for Case",
    description="Returns all verified evidence records linked to a specific case dossier, including checksums and custody logs."
)
async def get_evidence_for_case(case_id: str) -> List[Evidence]:
    case = canonical_store.get_case(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' was not found in the canonical store."
        )
    return canonical_store.get_evidence_for_case(case_id)


@router.get(
    "/evidence/{evidence_id}",
    response_model=Evidence,
    summary="Get Specific Evidence Record",
    description="Retrieves complete artifact metadata, chain of custody, and cryptographic checksum for a single evidence item."
)
async def get_evidence_by_id(evidence_id: str) -> Evidence:
    for evd in canonical_store._evidence.values():
        if evd.id == evidence_id:
            return evd
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Evidence record with identifier '{evidence_id}' was not found."
    )
