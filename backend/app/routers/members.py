from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/members", tags=["Lab Members"])


@router.get("/", response_model=List[schemas.LabMemberOut])
def list_members(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.LabMember)
    if role:
        query = query.filter(models.LabMember.role == role)
    if is_active is not None:
        query = query.filter(models.LabMember.is_active == is_active)
    return query.offset(skip).limit(limit).all()


@router.get("/{member_id}", response_model=schemas.LabMemberOut)
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.LabMember).filter(models.LabMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


@router.post("/", response_model=schemas.LabMemberOut, status_code=201)
def create_member(data: schemas.LabMemberCreate, db: Session = Depends(get_db)):
    existing = db.query(models.LabMember).filter(models.LabMember.email == data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    member = models.LabMember(**data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.put("/{member_id}", response_model=schemas.LabMemberOut)
def update_member(member_id: int, data: schemas.LabMemberUpdate, db: Session = Depends(get_db)):
    member = db.query(models.LabMember).filter(models.LabMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}", status_code=204)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.LabMember).filter(models.LabMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
