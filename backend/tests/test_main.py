import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# Use in-memory SQLite for tests
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True, scope="function")
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_create_member(client):
    r = client.post("/api/members/", json={
        "name": "Dr. Ada Lovelace",
        "email": "ada@roboticslab.io",
        "role": "researcher",
        "department": "AI Research",
    })
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "Dr. Ada Lovelace"
    assert data["email"] == "ada@roboticslab.io"
    assert data["id"] is not None


def test_list_members(client):
    client.post("/api/members/", json={"name": "Alice", "email": "alice@lab.io", "role": "engineer"})
    client.post("/api/members/", json={"name": "Bob", "email": "bob@lab.io", "role": "intern"})
    r = client.get("/api/members/")
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_get_member_not_found(client):
    r = client.get("/api/members/9999")
    assert r.status_code == 404


def test_create_project(client):
    r = client.post("/api/projects/", json={
        "name": "Mars Rover v2",
        "description": "Second generation exploration rover",
        "status": "active",
        "budget": 50000.0,
    })
    assert r.status_code == 201
    assert r.json()["name"] == "Mars Rover v2"


def test_create_vendor(client):
    r = client.post("/api/vendors/", json={
        "name": "RoboTech Supplies",
        "contact_person": "John Doe",
        "email": "john@robotech.com",
        "category": "Electronics",
    })
    assert r.status_code == 201
    assert r.json()["name"] == "RoboTech Supplies"


def test_create_expense(client):
    r = client.post("/api/expenses/", json={
        "title": "Servo Motors x10",
        "amount": 1200.00,
        "category": "components",
    })
    assert r.status_code == 201
    assert r.json()["amount"] == 1200.00


def test_create_purchase_order(client):
    r = client.post("/api/purchases/", json={
        "order_number": "PO-2024-001",
        "title": "Raspberry Pi 5 x5",
        "amount": 375.00,
        "status": "pending",
    })
    assert r.status_code == 201
    assert r.json()["order_number"] == "PO-2024-001"


def test_duplicate_purchase_order_number(client):
    client.post("/api/purchases/", json={
        "order_number": "PO-DUP-001",
        "title": "Test Item",
        "amount": 100.0,
        "status": "pending",
    })
    r = client.post("/api/purchases/", json={
        "order_number": "PO-DUP-001",
        "title": "Test Item 2",
        "amount": 200.0,
        "status": "pending",
    })
    assert r.status_code == 409


def test_dashboard_stats(client):
    r = client.get("/api/stats")
    assert r.status_code == 200
    data = r.json()
    assert "total_members" in data
    assert "total_projects" in data
    assert "total_expenses" in data
