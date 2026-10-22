import pytest
from datetime import datetime, timezone
from pydantic import ValidationError
from app.schemas.case import Case
from app.schemas.entity import Entity
from app.schemas.incident import Incident
from app.schemas.evidence import Evidence
from app.schemas.relationship import Relationship


def test_case_schema_valid():
    case = Case(
        id="CASE-101",
        title="Test Investigation Title",
        summary="A sufficiently long test summary describing the synthetic case.",
        lead_analyst="Analyst T. Woods",
        incident_ids=["INC-001"],
        entity_ids=["ENT-001"],
        evidence_ids=["EVD-001"],
        tags=["cyber", "synthetic"]
    )
    assert case.id == "CASE-101"
    assert case.status == "active"
    assert case.priority == "medium"


def test_case_schema_invalid_id():
    with pytest.raises(ValidationError):
        Case(
            id="INVALID-ID-123",  # Does not match ^CASE-[0-9]{3,}$
            title="Invalid Case",
            summary="Valid length summary for an invalid ID case.",
            lead_analyst="Analyst T."
        )


def test_entity_schema_valid():
    entity = Entity(
        id="ENT-500",
        category="person",
        name="John Doe Synthetic",
        reliability_score=0.9
    )
    assert entity.id == "ENT-500"
    assert entity.reliability_score == 0.9


def test_entity_schema_invalid_score():
    with pytest.raises(ValidationError):
        Entity(
            id="ENT-501",
            category="person",
            name="Score Out of Range",
            reliability_score=1.5  # Exceeds le=1.0
        )


def test_evidence_schema_valid():
    evd = Evidence(
        id="EVD-200",
        case_id="CASE-001",
        title="Valid Test Evidence",
        evidence_type="forensic_report",
        source="Lab Alpha",
        collected_at=datetime.now(timezone.utc),
        checksum="sha256:1122334455667788",
        summary="Forensic lab report detailing hardware test."
    )
    assert evd.id == "EVD-200"
    assert evd.confidence_score == 0.9


def test_relationship_schema_valid():
    rel = Relationship(
        id="REL-900",
        case_id="CASE-001",
        source_id="ENT-001",
        target_id="ENT-002",
        relationship_type="associated_with",
        inference_type="factual"
    )
    assert rel.id == "REL-900"
    assert rel.inference_type == "factual"
