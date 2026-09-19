# LeadFlow AI - Agentic Sales Qualification & Action Agent

## Live Deployment
- **Frontend URL:** https://lead-flow-alpha-six.vercel.app/
- **Backend Infrastructure:** FastAPI running on Render
- **Frontend Infrastructure:** React, Vite, Tailwind CSS running on Vercel

## Project Overview
LeadFlow AI is a domain-specific Agentic AI Sales tool designed to automate the early stages of the sales process. Rather than sales teams manually reviewing every incoming lead, researching the company, qualifying the prospect, and drafting follow-ups, LeadFlow AI executes these steps autonomously and presents a polished analysis for final review.

## System Architecture & Workflow

The backend utilizes LangGraph to create a deterministic, stateful workflow through a series of AI agents. The frontend communicates with the backend via a REST API to submit lead details and fetch the processed results.

### Agentic Workflow Steps

1. **Lead Understanding Agent**
   - Extracts structured information from raw lead inputs.
   - Identifies the core pain points and the prospect's underlying intent.
   
2. **Research Agent**
   - Simulates a search to gather additional public context on the company and its industry.
   - Summarizes the findings to enrich the context for the qualification stage.

3. **Knowledge Retrieval Agent (RAG)**
   - Simulates pulling domain-specific context regarding our company's capabilities, budget requirements, and service offerings.
   - Ensures the AI relies on actual internal business logic rather than hallucinated assumptions.

4. **Qualification Agent**
   - Synthesizes the initial understanding, company research, and internal RAG context.
   - Determines the lead's priority (HIGH, MEDIUM, LOW) based on defined criteria (e.g., budget fit, timeline, service alignment).
   - Flags any missing information required before a formal proposal can be made.

5. **Action Agent**
   - Reviews the qualification summary and determines the optimal next step (e.g., Schedule Discovery Call, Send Pricing Packet).
   - Drafts a professional, contextual email for the sales representative to review, approve, and send.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS v4, React Router, Lucide Icons, Axios.
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite, LangChain, LangGraph.

## Local Setup

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `uvicorn main:app --reload` (Runs on port 8000)

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (Runs on port 5173)

Ensure that `.env` files are configured appropriately with API keys if running locally with active LLM integrations.
