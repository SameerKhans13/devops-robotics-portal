import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Float,
    ForeignKey, Enum as SAEnum, Boolean
)
from sqlalchemy.orm import relationship
from app.database import Base


class MemberRole(str, enum.Enum):
    RESEARCHER = "researcher"
    ENGINEER = "engineer"
    TECHNICIAN = "technician"
    INTERN = "intern"
    LEAD = "lead"


class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ExpenseCategory(str, enum.Enum):
    COMPONENTS = "components"
    EQUIPMENT = "equipment"
    SOFTWARE = "software"
    MAINTENANCE = "maintenance"
    TRAVEL = "travel"
    OTHER = "other"


class PurchaseStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    ORDERED = "ordered"
    RECEIVED = "received"
    CANCELLED = "cancelled"


class LabMember(Base):
    __tablename__ = "lab_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    role = Column(SAEnum(MemberRole), default=MemberRole.RESEARCHER, nullable=False)
    department = Column(String(100))
    phone = Column(String(20))
    is_active = Column(Boolean, default=True, nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    projects = relationship("ProjectMember", back_populates="member")
    expenses = relationship("Expense", back_populates="submitted_by_member")
    purchases = relationship("PurchaseOrder", back_populates="requested_by_member")


class LabProject(Base):
    __tablename__ = "lab_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    status = Column(SAEnum(ProjectStatus), default=ProjectStatus.PLANNING, nullable=False)
    budget = Column(Float, default=0.0)
    spent = Column(Float, default=0.0)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    lead_member_id = Column(Integer, ForeignKey("lab_members.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lead_member = relationship("LabMember", foreign_keys=[lead_member_id])
    members = relationship("ProjectMember", back_populates="project")
    expenses = relationship("Expense", back_populates="project")
    purchases = relationship("PurchaseOrder", back_populates="project")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("lab_projects.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("lab_members.id"), nullable=False)
    role_in_project = Column(String(100))
    joined_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("LabProject", back_populates="members")
    member = relationship("LabMember", back_populates="projects")


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    contact_person = Column(String(100))
    email = Column(String(150))
    phone = Column(String(20))
    address = Column(Text)
    category = Column(String(100))
    is_active = Column(Boolean, default=True)
    total_spent = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    purchases = relationship("PurchaseOrder", back_populates="vendor")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    amount = Column(Float, nullable=False)
    category = Column(SAEnum(ExpenseCategory), default=ExpenseCategory.OTHER, nullable=False)
    project_id = Column(Integer, ForeignKey("lab_projects.id"), nullable=True)
    submitted_by = Column(Integer, ForeignKey("lab_members.id"), nullable=True)
    receipt_url = Column(String(500))
    expense_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("LabProject", back_populates="expenses")
    submitted_by_member = relationship("LabMember", back_populates="expenses")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    amount = Column(Float, nullable=False)
    status = Column(SAEnum(PurchaseStatus), default=PurchaseStatus.PENDING, nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("lab_projects.id"), nullable=True)
    requested_by = Column(Integer, ForeignKey("lab_members.id"), nullable=True)
    invoice_number = Column(String(100))
    notes = Column(Text)
    ordered_at = Column(DateTime)
    received_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="purchases")
    project = relationship("LabProject", back_populates="purchases")
    requested_by_member = relationship("LabMember", back_populates="purchases")
