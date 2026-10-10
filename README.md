# 🤖 Robotics Lab Portal

A **production-grade fullstack application** for managing a Robotics Lab — members, projects, expenses, vendors, and purchase orders. Built with a modern DevOps stack.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS (dark navy theme) |
| **Backend** | FastAPI (Python 3.12) |
| **Database** | PostgreSQL 16 + SQLAlchemy ORM |
| **Migrations** | Alembic |
| **Testing** | Pytest |
| **Containers** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Security** | Trivy container scanning |
| **Monitoring** | Prometheus metrics endpoint |

## 📋 Features

- 👥 **Lab Members** — CRUD, roles, departments, active status
- 🗂️ **Projects** — Budget tracking, status, lead assignment, progress bars
- 💰 **Expenses** — Category-based tracking, project linking, running totals
- 🏢 **Vendors** — Supplier management, total spent tracking
- 🛒 **Purchase Orders** — Full lifecycle (pending → approved → ordered → received), vendor/project linking, invoice tracking
- 📊 **Dashboard** — Real-time KPI cards, system status, activity stats
- 🔒 REST API with full Swagger docs at `/docs`
- ❤️ Health (`/health`) and readiness (`/ready`) endpoints for Kubernetes
- 📈 Prometheus metrics at `/metrics`

## 🚀 Quick Start (Docker Compose)

```bash
# Start everything with one command
docker compose up --build

# Open frontend
http://localhost:3000

# Open API docs
http://localhost:8000/docs

# Health check
http://localhost:8000/health
```

## 🛠️ Run Locally (Development)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Set database URL
$env:DATABASE_URL = "postgresql+psycopg://roboticslab:roboticslab@localhost:5432/roboticslab"

# Start PostgreSQL first (via docker)
docker run -d -p 5432:5432 -e POSTGRES_DB=roboticslab -e POSTGRES_USER=roboticslab -e POSTGRES_PASSWORD=roboticslab postgres:16-alpine

# Run API server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

## 🧪 Testing

```bash
cd backend
pytest -q
```

Tests use SQLite (no PostgreSQL needed).

## 📡 API Endpoints

```
GET    /                     Root info
GET    /health               Liveness check
GET    /ready                Readiness (checks DB)
GET    /metrics              Prometheus metrics
GET    /api/stats            Dashboard statistics

GET    /api/members/         List members
POST   /api/members/         Create member
GET    /api/members/{id}     Get member
PUT    /api/members/{id}     Update member
DELETE /api/members/{id}     Delete member

GET    /api/projects/        List projects
POST   /api/projects/        Create project
GET    /api/projects/{id}    Get project
PUT    /api/projects/{id}    Update project
DELETE /api/projects/{id}    Delete project

GET    /api/vendors/         List vendors
POST   /api/vendors/         Create vendor
...and so on for expenses and purchases
```

## 🔄 CI/CD Pipeline

```text
Push to main
     │
     ▼
┌─────────────────────────────────┐
│  pytest (backend tests)         │◄── FAILS? Pipeline stops
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Vite Build (frontend)          │◄── FAILS? Pipeline stops
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Docker Build → Push to GHCR   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Trivy Security Scan            │
└─────────────────────────────────┘
```

## 🗄️ Database Schema

```
lab_members ──────────────────────────────────────────┐
lab_projects ─── project_members ─── lab_members       │
lab_projects ─── expenses ─────────── lab_members ─────┤
lab_projects ─── purchase_orders ──── vendors          │
                                 └─── lab_members ─────┘
```

## 📁 Project Structure

```
devops-robotics-portal/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, routes, health
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # DB connection
│   │   ├── config.py        # Settings
│   │   └── routers/         # Route handlers
│   │       ├── members.py
│   │       ├── projects.py
│   │       ├── vendors.py
│   │       ├── expenses.py
│   │       └── purchases.py
│   ├── tests/
│   │   └── test_main.py     # Pytest tests
│   ├── alembic/             # DB migrations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Router + sidebar
│   │   ├── api.js           # API client
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Purchases.jsx
│   │   │   └── Vendors.jsx
│   │   └── index.css        # Tailwind + custom
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .github/workflows/ci.yml
```
