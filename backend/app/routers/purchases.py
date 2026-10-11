from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/purchases", tags=["Purchase Orders"])


@router.get("/", response_model=List[schemas.PurchaseOrderOut])
def list_purchases(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    vendor_id: Optional[int] = None,
    project_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.PurchaseOrder)
    if status:
        query = query.filter(models.PurchaseOrder.status == status)
    if vendor_id:
        query = query.filter(models.PurchaseOrder.vendor_id == vendor_id)
    if project_id:
        query = query.filter(models.PurchaseOrder.project_id == project_id)
    return query.order_by(models.PurchaseOrder.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{order_id}", response_model=schemas.PurchaseOrderOut)
def get_purchase(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return order


@router.post("/", response_model=schemas.PurchaseOrderOut, status_code=201)
def create_purchase(data: schemas.PurchaseOrderCreate, db: Session = Depends(get_db)):
    # Check order number uniqueness
    existing = db.query(models.PurchaseOrder).filter(
        models.PurchaseOrder.order_number == data.order_number
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Order number already exists")
    order = models.PurchaseOrder(**data.model_dump())
    db.add(order)
    # Update vendor total_spent if received
    if data.status == models.PurchaseStatus.RECEIVED and data.vendor_id:
        vendor = db.query(models.Vendor).filter(models.Vendor.id == data.vendor_id).first()
        if vendor:
            vendor.total_spent = (vendor.total_spent or 0.0) + data.amount
    db.commit()
    db.refresh(order)
    return order


@router.put("/{order_id}", response_model=schemas.PurchaseOrderOut)
def update_purchase(order_id: int, data: schemas.PurchaseOrderUpdate, db: Session = Depends(get_db)):
    order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    prev_status = order.status
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(order, field, value)
    # Update vendor total_spent when status changes to received
    if data.status == models.PurchaseStatus.RECEIVED and prev_status != models.PurchaseStatus.RECEIVED:
        if order.vendor_id:
            vendor = db.query(models.Vendor).filter(models.Vendor.id == order.vendor_id).first()
            if vendor:
                vendor.total_spent = (vendor.total_spent or 0.0) + order.amount
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=204)
def delete_purchase(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    db.delete(order)
    db.commit()
