import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login_flow():
    unique_email = f"student_{uuid.uuid4().hex[:8]}@vidyodaya.edu"
    register_payload = {
        "full_name": "Aarav Sharma",
        "email": unique_email,
        "password": "SecurePassword123!"
    }

    # 1. Register
    reg_response = client.post("/api/auth/register", json=register_payload)
    assert reg_response.status_code == 201
    data = reg_response.json()
    assert "access_token" in data
    assert data["user"]["email"] == unique_email

    token = data["access_token"]

    # 2. Get profile /me
    me_response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["full_name"] == "Aarav Sharma"

    # 3. Login
    login_response = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "SecurePassword123!"
    })
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

    # 4. Failed login with wrong password
    bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

