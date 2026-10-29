from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    # Root can return either SPA HTML index or API root JSON depending on build
    if "application/json" in response.headers.get("content-type", ""):
        data = response.json()
        assert "Vidyodaya" in data.get("name", "")
    else:
        assert "html" in response.headers.get("content-type", "")

