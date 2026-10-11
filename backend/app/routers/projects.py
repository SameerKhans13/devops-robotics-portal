from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/projects", tags=["Lab Projects"])


@router.get("/", response_model=List[schemas.LabProjectOut])
def list_projects(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.LabProject)
    if status:
        query = query.filter(models.LabProject.status == status)
    return query.offset(skip).limit(limit).all()


@router.get("/{project_id}", response_model=schemas.LabProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.LabProject).filter(models.LabProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=schemas.LabProjectOut, status_code=201)
def create_project(data: schemas.LabProjectCreate, db: Session = Depends(get_db)):
    project = models.LabProject(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=schemas.LabProjectOut)
def update_project(project_id: int, data: schemas.LabProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(models.LabProject).filter(models.LabProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.LabProject).filter(models.LabProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
