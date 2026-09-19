from typing import TypedDict, Optional, List, Dict, Any

class AgentState(TypedDict):
    lead_id: int
    company_name: str
    contact_name: str
    designation: str
    industry: str
    company_size: str
    requirement: str
    budget: str
    timeline: str
    source: str
    
    # Understanding
    pain_points: Optional[List[str]]
    intent: Optional[str]
    
    # Research
    research_summary: Optional[str]
    
    # RAG
    rag_context: Optional[str]
    
    # Qualification
    qualification: Optional[str]
    qualification_reasons: Optional[List[str]]
    missing_information: Optional[List[str]]
    
    # Next Action & Follow-up
    recommended_action: Optional[str]
    email_draft: Optional[str]
