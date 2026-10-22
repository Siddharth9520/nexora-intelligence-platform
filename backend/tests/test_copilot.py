import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_copilot_status_endpoint():
    response = client.get("/api/v1/copilot/status")
    assert response.status_code == 200
    data = response.json()
    assert "active_provider" in data
    assert "configured_model" in data
    assert "ollama_available" in data
    assert "gemini_available" in data
    assert "system_readiness" in data
    assert data["system_readiness"] in ["ready", "standby"]
    assert "setup_guide" in data
    assert "policy" in data["setup_guide"]


def test_copilot_query_case_summary():
    payload = {
        "case_id": "CASE-001",
        "prompt": "Summarize the selected case.",
        "provider": "ollama"
    }
    response = client.post("/api/v1/copilot/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["case_id"] == "CASE-001"
    assert "AeroGrid" in data["answer"] or "CASE-001" in data["answer"]
    assert data["status"] in ["generated", "grounded_retrieval"]
    assert len(data["citations"]) > 0
    assert "citations" in data
    assert "factual_observations" in data
    assert "analytical_leads" in data
    assert "unverified_gaps" in data


def test_copilot_query_timeline_prompt():
    payload = {
        "case_id": "CASE-001",
        "prompt": "Summarize the documented timeline.",
        "provider": "ollama"
    }
    response = client.post("/api/v1/copilot/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Temporal Reconstruction" in data["answer"]
    assert "EVT-001" in data["answer"] or "02:15 UTC" in data["answer"]


def test_copilot_query_missing_gaps_prompt():
    payload = {
        "case_id": "CASE-001",
        "prompt": "What information is missing from this investigation?",
        "provider": "ollama"
    }
    response = client.post("/api/v1/copilot/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["unverified_gaps"]) > 0


def test_copilot_query_invalid_case():
    payload = {
        "case_id": "CASE-999-DOES-NOT-EXIST",
        "prompt": "Summarize this invalid case."
    }
    response = client.post("/api/v1/copilot/query", json=payload)
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["error"]["message"].lower()
