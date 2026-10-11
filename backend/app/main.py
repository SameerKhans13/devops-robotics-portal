from datetime import datetime
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from app.config import settings
from app.database import get_db, engine
from app import models, schemas
from app.routers import members, projects, vendors, expenses, purchases

# Create all tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="🤖 Robotics Lab Portal API — Manage lab members, projects, expenses, vendors and purchases.",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional Prometheus instrumentation for monitoring
try:
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(app).expose(app)
except ImportError:
    @app.get("/metrics", tags=["Health"])
    def metrics_placeholder():
        return "# Prometheus metrics enabled in production environment with prometheus_fastapi_instrumentator\n"

# Include routers
app.include_router(members.router)
app.include_router(projects.router)
app.include_router(vendors.router)
app.include_router(expenses.router)
app.include_router(purchases.router)


@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.app_name,
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "service": settings.app_name}


@app.get("/ready", tags=["Health"])
def ready(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not ready", "database": str(e)}


@app.get("/api/stats", response_model=schemas.DashboardStats, tags=["Dashboard"])
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_members = db.query(models.LabMember).count()
    active_members = db.query(models.LabMember).filter(models.LabMember.is_active == True).count()
    total_projects = db.query(models.LabProject).count()
    active_projects = db.query(models.LabProject).filter(
        models.LabProject.status == models.ProjectStatus.ACTIVE
    ).count()
    total_expenses = db.query(func.sum(models.Expense.amount)).scalar() or 0.0
    total_purchase_orders = db.query(models.PurchaseOrder).count()
    pending_purchases = db.query(func.sum(models.PurchaseOrder.amount)).filter(
        models.PurchaseOrder.status.in_([models.PurchaseStatus.PENDING, models.PurchaseStatus.APPROVED])
    ).scalar() or 0.0
    total_vendors = db.query(models.Vendor).filter(models.Vendor.is_active == True).count()

    # Monthly spending (current month)
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_spending = db.query(func.sum(models.Expense.amount)).filter(
        models.Expense.expense_date >= month_start
    ).scalar() or 0.0

    return schemas.DashboardStats(
        total_members=total_members,
        active_members=active_members,
        total_projects=total_projects,
        active_projects=active_projects,
        total_expenses=total_expenses,
        total_purchase_orders=total_purchase_orders,
        pending_purchases=pending_purchases,
        total_vendors=total_vendors,
        monthly_spending=monthly_spending,
    )
