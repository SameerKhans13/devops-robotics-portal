from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])


@router.get("/", response_model=List[schemas.ExpenseOut])
def list_expenses(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    project_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Expense)
    if category:
        query = query.filter(models.Expense.category == category)
    if project_id:
        query = query.filter(models.Expense.project_id == project_id)
    return query.order_by(models.Expense.expense_date.desc()).offset(skip).limit(limit).all()


@router.get("/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.post("/", response_model=schemas.ExpenseOut, status_code=201)
def create_expense(data: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    expense = models.Expense(**data.model_dump())
    db.add(expense)
    # Update project spent amount
    if data.project_id:
        project = db.query(models.LabProject).filter(models.LabProject.id == data.project_id).first()
        if project:
            project.spent = (project.spent or 0.0) + data.amount
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(expense_id: int, data: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
