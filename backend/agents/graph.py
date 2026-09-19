from langgraph.graph import StateGraph, END
from .state import AgentState
from .nodes import (
    lead_understanding,
    company_research,
    rag_knowledge_search,
    qualify_lead,
    next_action_and_followup
)

workflow = StateGraph(AgentState)

workflow.add_node("lead_understanding", lead_understanding)
workflow.add_node("company_research", company_research)
workflow.add_node("rag_knowledge_search", rag_knowledge_search)
workflow.add_node("qualify_lead", qualify_lead)
workflow.add_node("next_action", next_action_and_followup)

workflow.set_entry_point("lead_understanding")
workflow.add_edge("lead_understanding", "company_research")
workflow.add_edge("company_research", "rag_knowledge_search")
workflow.add_edge("rag_knowledge_search", "qualify_lead")
workflow.add_edge("qualify_lead", "next_action")
workflow.add_edge("next_action", END)

# Compile the graph
agent_executor = workflow.compile()
