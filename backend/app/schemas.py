from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models import MemberRole, ProjectStatus, ExpenseCategory, PurchaseStatus


# ─── Lab Member Schemas ────────────────────────────────────────────────────────

class LabMemberBase(BaseModel):
    name: str
    email: str
    role: MemberRole = MemberRole.RESEARCHER
    department: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True


class LabMemberCreate(LabMemberBase):
    pass


class LabMemberUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[MemberRole] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


class LabMemberOut(LabMemberBase):
    id: int
    joined_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ─── Lab Project Schemas ───────────────────────────────────────────────────────

class LabProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.PLANNING
    budget: float = 0.0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    lead_member_id: Optional[int] = None


class LabProjectCreate(LabProjectBase):
    pass


class LabProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    budget: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    lead_member_id: Optional[int] = None


class LabProjectOut(LabProjectBase):
    id: int
    spent: float
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ─── Vendor Schemas ────────────────────────────────────────────────────────────

class VendorBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    category: Optional[str] = None
    is_active: bool = True


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None


class VendorOut(VendorBase):
    id: int
    total_spent: float
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ─── Expense Schemas ───────────────────────────────────────────────────────────

class ExpenseBase(BaseModel):
    title: str
    description: Optional[str] = None
    amount: float
    category: ExpenseCategory = ExpenseCategory.OTHER
    project_id: Optional[int] = None
    submitted_by: Optional[int] = None
    receipt_url: Optional[str] = None
    expense_date: Optional[datetime] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[ExpenseCategory] = None
    project_id: Optional[int] = None
    receipt_url: Optional[str] = None


class ExpenseOut(ExpenseBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ─── Purchase Order Schemas ────────────────────────────────────────────────────

class PurchaseOrderBase(BaseModel):
    order_number: str
    title: str
    description: Optional[str] = None
    amount: float
    status: PurchaseStatus = PurchaseStatus.PENDING
    vendor_id: Optional[int] = None
    project_id: Optional[int] = None
    requested_by: Optional[int] = None
    invoice_number: Optional[str] = None
    notes: Optional[str] = None
    ordered_at: Optional[datetime] = None
    received_at: Optional[datetime] = None


class PurchaseOrderCreate(PurchaseOrderBase):
    pass


class PurchaseOrderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[PurchaseStatus] = None
    vendor_id: Optional[int] = None
    project_id: Optional[int] = None
    invoice_number: Optional[str] = None
    notes: Optional[str] = None
    ordered_at: Optional[datetime] = None
    received_at: Optional[datetime] = None


class PurchaseOrderOut(PurchaseOrderBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ─── Stats Schema ──────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_members: int
    active_members: int
    total_projects: int
    active_projects: int
    total_expenses: float
    total_purchase_orders: int
    pending_purchases: float
    total_vendors: int
    monthly_spending: float
