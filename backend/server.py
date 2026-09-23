"""
FastAPI Backend Server for KirayaSaathi.
Exposes:
- POST /api/analyze: Full contract analysis via Grok Agent + State Tenancy RAG + Tools
- POST /api/chat: Interactive Tenancy Q&A powered by RAG + Grok
- GET  /api/states: Metadata and statutory norms for Punjab, Chandigarh, Delhi, Haryana, Bangalore, Pune
- GET  /api/health: Health check
"""

import os
import sys
import logging
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from llm import GrokLLM
from rag import rag_engine
from agent import TenancyLegalAgent, tenancy_agent
import tools

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("kirayasaathi.server")

app = FastAPI(
    title="KirayaSaathi AI Legal Agent API",
    description="Backend AI service powered by Grok (xAI) and State Tenancy RAG vector knowledge base across 6 Indian jurisdictions.",
    version="2.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Schemas
class AnalyzeRequest(BaseModel):
    text: str
    state: str = "delhi"
    title: Optional[str] = "Rental Agreement"
    apiKey: Optional[str] = None


class ChatRequest(BaseModel):
    query: str
    state: str = "delhi"
    clauseContext: Optional[str] = None
    apiKey: Optional[str] = None


@app.get("/api/health")
def health_check():
    has_grok_key = bool(os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY"))
    return {
        "status": "online",
        "service": "KirayaSaathi AI Agent Backend",
        "llm_provider": "Grok (xAI)" if has_grok_key else "Offline Rule Engine (Demo)",
        "grok_configured": has_grok_key,
        "rag_chunks_indexed": len(rag_engine.chunks)
    }


@app.get("/api/states")
def get_supported_states():
    return {
        "states": [
            {
                "id": k,
                "name": k.capitalize(),
                "norms": v
            }
            for k, v in tools.STATE_NORMS.items()
        ]
    }


@app.post("/api/analyze")
def analyze_agreement_endpoint(payload: AnalyzeRequest):
    """
    Analyzes raw contract text against state tenancy laws using Grok AI Agent + RAG.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Contract text is required.")

    logger.info(f"Analyzing agreement for state: {payload.state}, text length: {len(payload.text)}")

    agent = tenancy_agent
    if payload.apiKey and len(payload.apiKey.strip()) > 5:
        custom_llm = GrokLLM(api_key=payload.apiKey.strip())
        agent = TenancyLegalAgent(llm_client=custom_llm)

    try:
        result = agent.analyze_agreement(
            raw_text=payload.text,
            state=payload.state,
            document_title=payload.title or "Rental Agreement"
        )
        return result
    except Exception as e:
        logger.error(f"Error during agreement analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
def tenancy_chat_endpoint(payload: ChatRequest):
    """
    Interactive Q&A assistant for tenant inquiries based on state laws.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query is required.")

    state_key = (payload.state or "delhi").lower()
    
    # 1. RAG retrieval for relevant statutes
    law_chunks = rag_engine.retrieve_relevant_laws(query=payload.query, state=state_key, top_k=3)
    context_text = "\n\n".join([f"[{c['section_title']}]: {c['content']}" for c in law_chunks])

    system_prompt = f"""
You are KirayaSaathi's Tenant Advisory Assistant for {state_key.capitalize()}.
You help prospective tenants understand their rights, negotiate unfair terms, and navigate state tenancy laws.

LEGAL KNOWLEDGE CONTEXT ({state_key.capitalize()}):
{context_text}

INSTRUCTIONS:
1. Provide a polite, practical, and clear answer under 150 words.
2. If relevant, provide a 1-sentence respectful script the tenant can send to their landlord.
3. Use friendly, empowering, and neutral legal-tech tone.
"""

    user_message = payload.query
    if payload.clauseContext:
        user_message = f"Clause under discussion: \"{payload.clauseContext}\"\n\nQuestion: {payload.query}"

    llm = GrokLLM(api_key=payload.apiKey) if payload.apiKey else GrokLLM()

    if llm.is_configured():
        try:
            answer = llm.generate_chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                json_mode=False
            )
            return {
                "answer": answer,
                "state": state_key.capitalize(),
                "citations": [c["section_title"] for c in law_chunks]
            }
        except Exception as e:
            logger.error(f"Grok chat failed: {e}")

    # Fallback response
    return {
        "answer": f"Under {state_key.capitalize()} tenancy practices, tenants are protected against arbitrary deductions and unannounced visits. For the best outcome, consider requesting written clarification from your landlord.",
        "state": state_key.capitalize(),
        "citations": [c["section_title"] for c in law_chunks]
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting KirayaSaathi Backend Server on port {port}...")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
