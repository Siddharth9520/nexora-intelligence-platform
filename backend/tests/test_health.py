from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "version" in data
    assert "tagline" in data
    assert data["health"] == "/api/v1/health"


def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "nexora-backend"
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data
    
    # Verify AI provider block exists
    ai_info = data["ai_provider"]
    assert "active_provider" in ai_info
    assert "status" in ai_info
    
    # Verify canonical data block exists and has loaded items
    canonical_info = data["canonical_data"]
    assert canonical_info["status"] == "loaded"
    assert canonical_info["cases_count"] >= 1
    assert canonical_info["entities_count"] >= 1
    assert canonical_info["evidence_count"] >= 1
