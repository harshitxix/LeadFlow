from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Adjust path to import models if needed, though uvicorn usually runs from backend root
from models.database import SessionLocal, Lead

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LeadCreate(BaseModel):
    company_name: str
    contact_name: str
    designation: str
    industry: str
    company_size: str
    requirement: str
    budget: str
    timeline: str
    source: str
    additional_notes: Optional[str] = None

class LeadResponse(BaseModel):
    id: int
    company_name: str
    contact_name: str
    designation: str
    industry: str
    status: str
    priority: str

    class Config:
        from_attributes = True

@router.post("/", response_model=LeadResponse)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    # Include additional notes in requirement for now
    db_lead = Lead(
        company_name=lead.company_name,
        contact_name=lead.contact_name,
        designation=lead.designation,
        industry=lead.industry,
        company_size=lead.company_size,
        requirement=lead.requirement + (f"\nNotes: {lead.additional_notes}" if lead.additional_notes else ""),
        budget=lead.budget,
        timeline=lead.timeline,
        source=lead.source
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/", response_model=List[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    return leads

