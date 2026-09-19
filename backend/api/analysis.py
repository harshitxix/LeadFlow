from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal, Lead, Analysis
from pydantic import BaseModel
from typing import List, Optional
import json

from agents.graph import agent_executor

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AnalysisResponse(BaseModel):
    id: int
    lead_id: int
    qualification: str
    qualification_reasons: List[str]
    missing_information: List[str]
    recommended_action: str
    research_summary: str
    email_draft: Optional[str] = None
    company_name: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/{lead_id}/analyze", response_model=AnalysisResponse)
def analyze_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    # Build initial state
    initial_state = {
        "lead_id": lead.id,
        "company_name": lead.company_name or "",
        "contact_name": lead.contact_name or "",
        "designation": lead.designation or "",
        "industry": lead.industry or "",
        "company_size": lead.company_size or "",
        "requirement": lead.requirement or "",
        "budget": lead.budget or "",
        "timeline": lead.timeline or "",
        "source": lead.source or ""
    }
    
    # Run the graph
    try:
        final_state = agent_executor.invoke(initial_state)
    except Exception as e:
        print(f"Error executing agent: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing lead")
        
    # Save analysis to DB
    db_analysis = Analysis(
        lead_id=lead.id,
        qualification=final_state.get("qualification", "UNKNOWN"),
        qualification_reasons=json.dumps(final_state.get("qualification_reasons", [])),
        missing_information=json.dumps(final_state.get("missing_information", [])),
        recommended_action=final_state.get("recommended_action", ""),
        research_summary=final_state.get("research_summary", "")
    )
    db.add(db_analysis)
    
    # Update lead status
    lead.status = "Analyzed"
    lead.priority = final_state.get("qualification", "MEDIUM").capitalize()
    db.commit()
    db.refresh(db_analysis)
    
    return {
        "id": db_analysis.id,
        "lead_id": db_analysis.lead_id,
        "qualification": db_analysis.qualification,
        "qualification_reasons": json.loads(db_analysis.qualification_reasons),
        "missing_information": json.loads(db_analysis.missing_information),
        "recommended_action": db_analysis.recommended_action,
        "research_summary": db_analysis.research_summary,
        "email_draft": final_state.get("email_draft"),
        "company_name": lead.company_name
    }

@router.get("/{lead_id}", response_model=AnalysisResponse)
def get_analysis(lead_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.lead_id == lead_id).order_by(Analysis.id.desc()).first()
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    # For MVP we reconstruct the email draft mock if it wasn't saved in DB
    return {
        "id": analysis.id,
        "lead_id": analysis.lead_id,
        "qualification": analysis.qualification,
        "qualification_reasons": json.loads(analysis.qualification_reasons) if analysis.qualification_reasons else [],
        "missing_information": json.loads(analysis.missing_information) if analysis.missing_information else [],
        "recommended_action": analysis.recommended_action,
        "research_summary": analysis.research_summary,
        "email_draft": f"Subject: Exploring AI Support Automation for {lead.company_name if lead else ''}\n\nBased on your requirements, we'd be happy to discuss an integration. Would Tuesday work for a short discovery call?",
        "company_name": lead.company_name if lead else ""
    }
