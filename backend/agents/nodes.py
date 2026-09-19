import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from .state import AgentState

# Setup LLM, fallback to mock if no key is found
openai_api_key = os.getenv("OPENAI_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")

llm = None
if openai_api_key:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0) # Using cost-effective model for MVP

def lead_understanding(state: AgentState) -> AgentState:
    if not llm:
        state["pain_points"] = ["Need to automate customer support", "Require CRM integration"]
        state["intent"] = "Looking to purchase an AI solution soon."
        return state

    prompt = f"""Analyze this lead and extract structured information.
Company: {state['company_name']}
Contact: {state['contact_name']} - {state['designation']}
Requirement: {state['requirement']}
Budget: {state['budget']}
Timeline: {state['timeline']}

Provide a JSON output with keys: "pain_points" (list of strings) and "intent" (string)."""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        # Clean up response to get pure JSON
        content = response.content.replace("```json", "").replace("```", "").strip()
        data = json.loads(content)
        state["pain_points"] = data.get("pain_points", [])
        state["intent"] = data.get("intent", "")
    except Exception as e:
        print(f"Error in lead_understanding: {e}")
        state["pain_points"] = []
        state["intent"] = "Unknown"
        
    return state

def company_research(state: AgentState) -> AgentState:
    if not tavily_api_key:
        state["research_summary"] = f"{state['company_name']} is a company in the {state['industry']} sector. Public information is limited, relying on provided lead details."
        return state
        
    # Tavily API Call Simulation (replace with actual langchain_community.utilities.TavilySearchAPIWrapper if needed)
    from langchain_community.tools.tavily_search import TavilySearchResults
    try:
        tool = TavilySearchResults(max_results=2)
        results = tool.invoke(f"{state['company_name']} {state['industry']} overview")
        summary = "\\n".join([f"- {res['content']}" for res in results])
        state["research_summary"] = summary
    except Exception as e:
        print(f"Tavily search failed: {e}")
        state["research_summary"] = "Could not fetch public research."
        
    return state

def rag_knowledge_search(state: AgentState) -> AgentState:
    # In MVP, if chroma isn't populated, we simulate the RAG context
    state["rag_context"] = "Our company provides AI Automation, CRM Integration, and Custom AI Solutions. We require a budget of at least ₹10 Lakhs."
    return state

def qualify_lead(state: AgentState) -> AgentState:
    if not llm:
        state["qualification"] = "HIGH"
        state["qualification_reasons"] = [
            "Relevant business requirement",
            "Budget information available",
            "Clear implementation timeline",
            "Relevant decision-maker identified",
            "Requirement matches available services"
        ]
        state["missing_information"] = [
            "Existing CRM platform",
            "Number of customer-support users",
            "Technical integration requirements"
        ]
        return state

    prompt = f"""Qualify this lead based on the following:
Lead: {state['company_name']} ({state['industry']})
Requirement: {state['requirement']}
Budget: {state['budget']}
Timeline: {state['timeline']}
Our Capabilities (RAG): {state['rag_context']}

Rules:
1. Budget Fit?
2. Requirement matches capabilities?
3. Timeline reasonable?

Return a JSON with:
- "qualification": "HIGH", "MEDIUM", or "LOW"
- "qualification_reasons": list of strings (e.g. "Budget fits perfectly")
- "missing_information": list of strings (what else do we need to know?)"""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.replace("```json", "").replace("```", "").strip()
        data = json.loads(content)
        state["qualification"] = data.get("qualification", "MEDIUM")
        state["qualification_reasons"] = data.get("qualification_reasons", [])
        state["missing_information"] = data.get("missing_information", [])
    except Exception:
        state["qualification"] = "MEDIUM"
        state["qualification_reasons"] = ["Could not parse qualification rules."]
        state["missing_information"] = []

    return state

def next_action_and_followup(state: AgentState) -> AgentState:
    if not llm:
        state["recommended_action"] = "Schedule Discovery Call"
        state["email_draft"] = f"Subject: Exploring AI Support Automation for {state['company_name']}\n\nHi {state['contact_name'].split()[0]},\n\nThanks for sharing your requirements regarding AI-powered customer support automation.\n\nBased on your requirements, we'd be happy to discuss how an AI workflow could integrate with your existing CRM.\n\nI'd suggest a short discovery call to understand your current setup and integration requirements.\n\nWould Tuesday or Wednesday work for a quick discussion?\n\nRegards,\nSales Team"
        return state

    prompt = f"""Determine the next best sales action and draft an email to the lead.
Lead: {state['company_name']}, Contact: {state['contact_name']}
Qualification: {state['qualification']}
Missing Info: {", ".join(state['missing_information']) if state['missing_information'] else 'None'}

Return JSON:
- "recommended_action": string (e.g. "Schedule Discovery Call")
- "email_draft": string (The complete text of the email to send)"""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.replace("```json", "").replace("```", "").strip()
        data = json.loads(content)
        state["recommended_action"] = data.get("recommended_action", "Review internally")
        state["email_draft"] = data.get("email_draft", "Could not generate draft.")
    except Exception:
        state["recommended_action"] = "Review internally"
        state["email_draft"] = "Could not generate draft."

    return state
