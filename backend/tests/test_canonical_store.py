from fastapi.testclient import TestClient
from app.main import app
from app.data.canonical_store import canonical_store

client = TestClient(app)


def test_canonical_store_referential_integrity():
    violations = canonical_store.validate_referential_integrity()
    assert len(violations) == 0, f"Integrity violations found: {violations}"


def test_list_cases_api():
    response = client.get("/api/v1/cases")
    assert response.status_code == 200
    cases = response.json()
    assert len(cases) >= 2
    case_ids = [c["id"] for c in cases]
    assert "CASE-001" in case_ids


def test_get_case_detail_api():
    response = client.get("/api/v1/cases/CASE-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "CASE-001"
    assert data["title"] == "Operation Vanguard Horizon"
    assert len(data["entity_ids"]) >= 1
    assert len(data["evidence_ids"]) >= 1


def test_get_nonexistent_case_api():
    response = client.get("/api/v1/cases/CASE-999")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data


def test_get_entities_for_case_api():
    response = client.get("/api/v1/cases/CASE-001/entities")
    assert response.status_code == 200
    entities = response.json()
    assert len(entities) >= 1
    assert any(e["id"] == "ENT-001" for e in entities)


def test_get_evidence_for_case_api():
    response = client.get("/api/v1/cases/CASE-001/evidence")
    assert response.status_code == 200
    evidence_list = response.json()
    assert len(evidence_list) >= 1
    assert any(ev["id"] == "EVD-001" for ev in evidence_list)


def test_get_relationships_for_case_api():
    response = client.get("/api/v1/cases/CASE-001/relationships")
    assert response.status_code == 200
    relationships = response.json()
    assert len(relationships) >= 1
    assert any(r["id"] == "REL-001" for r in relationships)


def test_dashboard_api():
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_cases"] >= 3
    assert data["total_entities"] >= 8
    assert data["total_evidence"] >= 6
    assert data["total_relationships"] >= 10
    assert data["total_timeline_events"] >= 6
    assert data["total_hypotheses"] >= 3
    assert data["epistemic_breakdown"]["facts_count"] >= 1


def test_all_entities_api():
    response = client.get("/api/v1/entities")
    assert response.status_code == 200
    entities = response.json()
    assert len(entities) >= 8
    assert any(e["id"] == "ENT-001" for e in entities)


def test_all_evidence_api():
    response = client.get("/api/v1/evidence")
    assert response.status_code == 200
    evidence_list = response.json()
    assert len(evidence_list) >= 6
    assert any(ev["id"] == "EVD-001" for ev in evidence_list)


def test_all_relationships_api():
    response = client.get("/api/v1/relationships")
    assert response.status_code == 200
    relationships = response.json()
    assert len(relationships) >= 10
    assert any(r["id"] == "REL-001" for r in relationships)


def test_timeline_api():
    response = client.get("/api/v1/timeline")
    assert response.status_code == 200
    events = response.json()
    assert len(events) >= 6
    assert any(ev["id"] == "EVT-001" for ev in events)


def test_timeline_for_case_api():
    response = client.get("/api/v1/timeline?case_id=CASE-001")
    assert response.status_code == 200
    events = response.json()
    assert len(events) >= 1
    assert all(ev["case_id"] == "CASE-001" for ev in events)


def test_hypotheses_api():
    response = client.get("/api/v1/hypotheses")
    assert response.status_code == 200
    hypotheses = response.json()
    assert len(hypotheses) >= 3
    assert any(h["id"] == "HYP-001" for h in hypotheses)


def test_root_health_api():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "nexora-backend"

