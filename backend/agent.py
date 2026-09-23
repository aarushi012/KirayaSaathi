"""
Tenancy Legal Analysis Agent for KirayaSaathi.
Orchestrates:
1. Clause segmentation & preprocessing
2. RAG retrieval against State Tenancy Knowledge Base
3. Compliance tool execution (deposit, notice, lock-in, entry, repairs)
4. Grok (xAI) LLM synthesis into structured UI report
"""

import re
import json
import logging
from typing import Dict, Any, List, Optional

try:
    from backend.llm import GrokLLM
    from backend.rag import rag_engine, StateTenancyRAG
    from backend import tools
except ImportError:
    from llm import GrokLLM
    from rag import rag_engine, StateTenancyRAG
    import tools

logger = logging.getLogger("kirayasaathi.agent")

AGENT_SYSTEM_PROMPT = """
You are KirayaSaathi's Senior Legal Assistance AI Agent specializing in Indian residential tenancy agreements.
Your role is to analyze a residential rental agreement clause-by-clause on behalf of a tenant, benchmarking against the specific state's tenancy laws and Model Tenancy Act principles.

CRITICAL BEHAVIORAL & SAFETY RULES:
1. You provide informational contract analysis, NOT formal legal advice.
2. NEVER say "This clause is illegal" or "The landlord is violating the law".
3. INSTEAD use objective SaaS phrasing:
   - "May require attention" / "High Attention"
   - "Consider discussing" / "Medium Attention"
   - "Standard & Balanced" / "Low Attention"
4. CRITICAL NON-HALLUCINATION RULE:
   - Only output facts explicitly present in the provided contract.
   - If a financial term or date is not in the text, output: "Not specified in the agreement."
   - Do not fabricate missing dates, rent amounts, or terms.
5. POLITE NEGOTIATION SCRIPTS:
   - For every clause flagged Medium or High attention, generate a polite, practical phrase under 50 words that a tenant can text or say to the landlord.

OUTPUT FORMAT:
You MUST respond with a single valid JSON object strictly matching this schema:
{
  "summary": "2-3 sentence overview of the agreement balance and key takeaways for the tenant in this state.",
  "total_clauses_analyzed": 8,
  "low_attention": 2,
  "medium_attention": 3,
  "high_attention": 3,
  "key_points": [
    "Bullet point highlighting main findings (deposit, entry, maintenance, exit)"
  ],
  "agreement_at_a_glance": {
    "summary": "One-paragraph simple summary describing the agreement.",
    "financial_terms": {
      "rent": "Explicit amount (e.g. ₹25,000/month) OR 'Not specified in the agreement.'",
      "security_deposit": "Explicit amount (e.g. ₹50,000) OR 'Not specified in the agreement.'",
      "lock_in_period": "Explicit duration (e.g. '3 months') OR 'Not specified in the agreement.'",
      "notice_period": "Explicit requirement (e.g. '30 days written notice') OR 'Not specified in the agreement.'"
    },
    "important_dates": [
      "Explicit start date, end date, or lease duration from text (or 'Not specified in the agreement.')"
    ],
    "top_attention_clauses": [
      "Short title of top clauses that deserve closest tenant attention"
    ]
  },
  "clauses": [
    {
      "id": 1,
      "clause_title": "Short descriptive title of the clause",
      "original_text": "Exact quote of the clause from the provided text",
      "category": "Rent | Security Deposit | Lock-in Period | Notice Period | Termination | Maintenance | Repairs | Landlord Entry | Late Payment | Rent Increase | Utilities | Subletting | Other",
      "simple_explanation": "Clear, plain English translation for a tenant with zero legal jargon",
      "attention_level": "LOW | MEDIUM | HIGH",
      "reason": "Clear explanation of why this level was assigned, referencing state benchmarks",
      "negotiation_suggestion": "Polite tenant script under 50 words (e.g., 'Could we clarify...')"
    }
  ]
}
"""


class TenancyLegalAgent:
    """
    Autonomous legal analysis agent orchestrating LLM, RAG, and tools.
    """

    def __init__(self, llm_client: Optional[GrokLLM] = None):
        self.llm = llm_client or GrokLLM()
        self.rag = rag_engine

    def segment_clauses(self, text: str) -> List[str]:
        """
        Splits agreement text into individual numbered or semantic clauses.
        """
        if not text:
            return []
        
        # Split by numbered items (e.g. 1., 2), Clause 1:, Section 1:, etc.)
        pattern = r'(?:\n\s*(?:\d+[\.\)]|[A-Za-z][\.\)]|Clause\s+\d+|Section\s+\d+|Article\s+\d+)|\n\n+)'
        chunks = re.split(pattern, text)
        cleaned = [c.strip() for c in chunks if len(c.strip()) > 20]
        if not cleaned:
            cleaned = [line.strip() for line in text.splitlines() if len(line.strip()) > 20]
        return cleaned or [text.strip()]

    def analyze_agreement(
        self,
        raw_text: str,
        state: str = "delhi",
        document_title: str = "Residential Lease Agreement"
    ) -> Dict[str, Any]:
        """
        Executes the end-to-end legal analysis pipeline.
        """
        state_key = (state or "delhi").lower().strip()
        state_norm = tools.get_state_norm(state_key)

        # 1. Retrieve Statutory State Law Context via RAG
        rag_context = self.rag.retrieve_relevant_laws(
            query="security deposit notice period landlord entry maintenance repairs lock-in eviction",
            state=state_key,
            top_k=4
        )

        rag_context_str = "\n\n".join([
            f"--- State Law Citation [{c['section_title']}] ---\n{c['content']}"
            for c in rag_context
        ])

        # 2. Extract quick numeric heuristics from text
        rent_match = re.search(r'(?:rent|monthly\s+fee|per\s+month)[^\d]{1,15}(?:₹|rs\.?|\$)?\s*([\d,]+)', raw_text, re.IGNORECASE)
        deposit_match = re.search(r'(?:deposit|security)[^\d]{1,15}(?:₹|rs\.?|\$)?\s*([\d,]+)', raw_text, re.IGNORECASE)
        
        heuristics_notes = []
        if rent_match and deposit_match:
            try:
                r_val = float(rent_match.group(1).replace(",", ""))
                d_val = float(deposit_match.group(1).replace(",", ""))
                dep_check = tools.validate_security_deposit(d_val, r_val, state=state_key)
                heuristics_notes.append(f"Security Deposit Heuristic Tool: {dep_check['message']}")
            except Exception:
                pass

        # Check landlord entry
        entry_check = tools.inspect_landlord_entry_clause(raw_text, state=state_key)
        if entry_check["status"] == "HIGH_ATTENTION":
            heuristics_notes.append(f"Landlord Entry Tool: {entry_check['message']}")

        # Check painting deduction
        paint_check = tools.analyze_painting_and_deduction_clause(raw_text, state=state_key)
        if paint_check["status"] == "HIGH_ATTENTION":
            heuristics_notes.append(f"Painting Clause Tool: {paint_check['message']}")

        heuristics_summary = "\n".join(heuristics_notes) if heuristics_notes else "All basic numeric covenants within normal ranges."

        # 3. Assemble User Prompt for Grok
        user_prompt = f"""
JURISDICTION UNDER EVALUATION:
- State / Region: {state_key.capitalize()}
- Governing Statute: {state_norm['act_name']}
- Standard Deposit Benchmark: {state_norm['max_deposit_months']} months rent
- Standard Notice Benchmark: {state_norm['standard_notice_days']} days notice
- Standard Lock-in Benchmark: {state_norm['standard_lock_in_months']} months

RELEVANT STATE STATUTORY CONTEXT (RAG RETRIEVAL):
{rag_context_str}

AUTOMATED COMPLIANCE TOOL FINDINGS:
{heuristics_summary}

RENTAL AGREEMENT RAW TEXT TO ANALYZE:
{raw_text}
"""

        # 4. Generate structured analysis via Grok LLM
        try:
            parsed_result = self.llm.generate_json_response(
                system_prompt=AGENT_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                temperature=0.2
            )
        except Exception as e:
            logger.warning(f"Grok API call failed ({e}). Running local RAG & statutory rule evaluation engine.")
            parsed_result = self._analyze_with_rule_engine(
                raw_text=raw_text,
                state_key=state_key,
                state_norm=state_norm,
                heuristics_notes=heuristics_notes,
                rag_docs=rag_context
            )

        # 5. Enrich & Normalize Output
        enriched = self._normalize_agent_output(parsed_result, state_key, document_title)
        return enriched

    def _analyze_with_rule_engine(
        self,
        raw_text: str,
        state_key: str,
        state_norm: Dict[str, Any],
        heuristics_notes: List[str],
        rag_docs: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Extracts clauses from text and applies deterministic legal tools and RAG benchmarks.
        """
        raw_clauses = self.segment_clauses(raw_text)
        analyzed_clauses = []

        # Find rent and deposit if present
        rent_match = re.search(r'(?:rent|monthly\s+fee)[^\d]{1,15}(?:₹|rs\.?|\$)?\s*([\d,]+)', raw_text, re.IGNORECASE)
        deposit_match = re.search(r'(?:deposit|security)[^\d]{1,15}(?:₹|rs\.?|\$)?\s*([\d,]+)', raw_text, re.IGNORECASE)
        rent_str = f"₹{rent_match.group(1)}/month" if rent_match else "Not explicitly specified"
        deposit_str = f"₹{deposit_match.group(1)}" if deposit_match else "Not explicitly specified"

        for idx, clause_text in enumerate(raw_clauses):
            c_low = clause_text.lower()
            title = f"Clause {idx + 1}"
            category = "General"
            attention = "LOW"
            reason = "Standard contractual term."
            neg_tip = "Clause appears standard and acceptable."

            if any(k in c_low for k in ["deposit", "security", "advance"]):
                category = "Security Deposit"
                title = "Security Deposit & Refund Terms"
                if "deduct" in c_low or "painting" in c_low or "non-refundable" in c_low or "10 month" in c_low or "6 month" in c_low:
                    attention = "HIGH"
                    reason = f"Security deposit terms require attention. Under {state_norm['act_name']}, deposit should ideally not exceed {state_norm['max_deposit_months']} months rent, and deductions must be itemized."
                    neg_tip = f"Could we align the security deposit with the standard {state_norm['max_deposit_months']}-month norm and confirm deductions require itemized bills?"
                else:
                    attention = "MEDIUM"
                    reason = f"Ensure deposit refund timelines (typically 30 days) are explicitly defined."
                    neg_tip = "Could we clarify the exact timeline for returning the deposit upon move-out?"

            elif any(k in c_low for k in ["enter", "entry", "inspect", "access", "visit"]):
                category = "Landlord Entry"
                title = "Landlord Entry & Privacy Rights"
                if "any time" in c_low or "without notice" in c_low or "unrestricted" in c_low:
                    attention = "HIGH"
                    reason = "Unannounced landlord entry violates tenant privacy rights. Statutory standards require minimum 24 hours prior written notice."
                    neg_tip = "Could we add that landlord visits require 24 hours prior notice at a mutually agreed time?"
                else:
                    attention = "LOW"
                    reason = "Entry terms appear balanced."

            elif any(k in c_low for k in ["notice", "evict", "terminate", "quit", "vacate"]):
                category = "Notice Period"
                title = "Termination & Notice Period"
                if "7 day" in c_low or "15 day" in c_low or "immediate" in c_low:
                    attention = "HIGH"
                    reason = f"Short notice periods heavily disadvantage the tenant. Standard practice in {state_key.capitalize()} is {state_norm['standard_notice_days']} days written notice."
                    neg_tip = f"Could we adjust the notice period to the standard {state_norm['standard_notice_days']} days for both parties?"
                else:
                    attention = "LOW"
                    reason = "Notice period terms are balanced."

            elif any(k in c_low for k in ["paint", "repainting", "wear and tear", "whitewash"]):
                category = "Maintenance & Painting"
                title = "Painting & Wear and Tear Deductions"
                if "mandatory" in c_low or "1 month" in c_low or "one month" in c_low or "deduct" in c_low:
                    attention = "HIGH"
                    reason = "Mandatory repainting deductions without proof of damage are unfair to tenants; normal wear and tear should not be charged."
                    neg_tip = "Could we clarify that painting deductions only apply if there is actual damage beyond normal wear and tear?"
                else:
                    attention = "MEDIUM"
                    reason = "Clarify maintenance responsibilities."
                    neg_tip = "Could we specify minor repairs vs structural maintenance split?"

            elif any(k in c_low for k in ["lock-in", "lock in", "lockin"]):
                category = "Lock-in Period"
                title = "Lock-in Period & Early Departure"
                attention = "MEDIUM"
                reason = "Review early exit penalties to avoid dual penalty (forfeiting deposit plus rent)."
                neg_tip = "Could we ensure that if a replacement tenant is found, early termination penalties are waived?"

            elif any(k in c_low for k in ["rent", "increase", "escalation"]):
                category = "Rent Escalation"
                title = "Rent & Annual Escalation"
                attention = "LOW"
                reason = f"Rent payment terms. Standard annual escalation in {state_key.capitalize()} is {state_norm['max_annual_escalation_pct']}%."
                neg_tip = "Ensure rent receipts or electronic transfer acknowledgement is provided monthly."

            analyzed_clauses.append({
                "id": idx + 1,
                "clause_title": title,
                "original_text": clause_text,
                "category": category,
                "simple_explanation": clause_text[:120] + "...",
                "attention_level": attention,
                "reason": reason,
                "negotiation_suggestion": neg_tip
            })

        high_c = sum(1 for c in analyzed_clauses if c["attention_level"] == "HIGH")
        med_c = sum(1 for c in analyzed_clauses if c["attention_level"] == "MEDIUM")
        low_c = sum(1 for c in analyzed_clauses if c["attention_level"] == "LOW")

        return {
            "summary": f"Analyzed {len(analyzed_clauses)} clauses under {state_norm['act_name']}. Identified {high_c} high-attention clauses and {med_c} moderate-attention clauses.",
            "total_clauses_analyzed": len(analyzed_clauses),
            "low_attention": low_c,
            "medium_attention": med_c,
            "high_attention": high_c,
            "key_points": [
                f"Governing statutory norm: {state_norm['act_name']}.",
                f"Security deposit benchmark: Maximum {state_norm['max_deposit_months']} months.",
                f"Standard notice period: {state_norm['standard_notice_days']} days written notice.",
                f"RAG knowledge base matches for {state_key.capitalize()}: {len(rag_docs)} benchmark references indexed."
            ],
            "agreement_at_a_glance": {
                "summary": f"Tenancy agreement evaluated against {state_key.capitalize()} statutory standards.",
                "financial_terms": {
                    "rent": rent_str,
                    "security_deposit": deposit_str,
                    "lock_in_period": f"{state_norm['standard_lock_in_months']} months",
                    "notice_period": f"{state_norm['standard_notice_days']} days"
                },
                "important_dates": ["Standard 11-month lease term"],
                "top_attention_clauses": [c["clause_title"] for c in analyzed_clauses if c["attention_level"] == "HIGH"][:3]
            },
            "clauses": analyzed_clauses
        }

    def _normalize_agent_output(
        self,
        raw_output: Dict[str, Any],
        state_key: str,
        document_title: str
    ) -> Dict[str, Any]:
        """
        Guarantees complete UI schema compatibility with KirayaSaathi.
        """
        clauses = raw_output.get("clauses", [])
        if not isinstance(clauses, list):
            clauses = []

        norm_clauses = []
        low_count = 0
        med_count = 0
        high_count = 0

        for idx, c in enumerate(clauses):
            lvl = str(c.get("attention_level", "LOW")).upper()
            if lvl not in ["LOW", "MEDIUM", "HIGH"]:
                lvl = "LOW"

            if lvl == "HIGH":
                high_count += 1
            elif lvl == "MEDIUM":
                med_count += 1
            else:
                low_count += 1

            norm_clauses.append({
                "id": c.get("id", idx + 1),
                "clause_title": c.get("clause_title") or f"Clause {idx + 1}",
                "original_text": c.get("original_text") or "",
                "category": c.get("category") or "Other",
                "simple_explanation": c.get("simple_explanation") or "Standard contractual provision.",
                "attention_level": lvl,
                "reason": c.get("reason") or "Evaluated against standard state tenancy provisions.",
                "negotiation_suggestion": c.get("negotiation_suggestion") or "Consider clarifying this term with the landlord."
            })

        state_norm = tools.get_state_norm(state_key)
        
        state_meta = {
            "id": state_key,
            "name": state_key.capitalize(),
            "act": state_norm["act_name"],
            "depositNorm": f"{state_norm['max_deposit_months']} Months Rent",
            "noticeNorm": f"{state_norm['standard_notice_days']} Days Notice",
            "escalationNorm": f"{state_norm['max_annual_escalation_pct']}% Annual",
            "badge": f"{state_key.capitalize()} Tenancy Norms"
        }

        fairness_score = max(25, min(98, 100 - (high_count * 16) - (med_count * 7)))

        rating = "Balanced & Standard"
        rating_color = "emerald"
        if high_count >= 3:
            rating = "High Attention Needed"
            rating_color = "rose"
        elif high_count > 0 or med_count >= 2:
            rating = "Moderate Attention Needed"
            rating_color = "amber"

        risks = []
        for c in norm_clauses:
            if c["attention_level"] in ["HIGH", "MEDIUM"]:
                risks.append({
                    "severity": "HIGH" if c["attention_level"] == "HIGH" else "MEDIUM",
                    "title": c["clause_title"],
                    "category": c["category"],
                    "explanation": c["reason"],
                    "recommendation": c["negotiation_suggestion"],
                    "originalClause": c["original_text"]
                })

        return {
            "title": document_title,
            "isLiveAI": self.llm.is_configured(),
            "aiProvider": f"Grok (xAI) + {state_key.capitalize()} RAG Agent" if self.llm.is_configured() else f"KirayaSaathi Rule Engine + {state_key.capitalize()} RAG",
            "fairnessScore": fairness_score,
            "overallScore": fairness_score,
            "summary": raw_output.get("summary") or "Comprehensive clause analysis completed.",
            "total_clauses_analyzed": len(norm_clauses),
            "totalClauses": len(norm_clauses),
            "low_attention": low_count,
            "standardCount": low_count,
            "medium_attention": med_count,
            "moderateCount": med_count,
            "high_attention": high_count,
            "highAttentionCount": high_count,
            "overallRating": rating,
            "ratingColor": rating_color,
            "risks": risks,
            "key_points": raw_output.get("key_points") or [
                f"Evaluated against {state_norm['act_name']}.",
                f"Standard security deposit limit for {state_key.capitalize()} is {state_norm['max_deposit_months']} months."
            ],
            "agreement_at_a_glance": raw_output.get("agreement_at_a_glance") or {
                "summary": raw_output.get("summary") or "Agreement overview.",
                "financial_terms": {
                    "rent": "As specified in agreement",
                    "security_deposit": "As specified in agreement",
                    "lock_in_period": f"{state_norm['standard_lock_in_months']} months",
                    "notice_period": f"{state_norm['standard_notice_days']} days"
                },
                "important_dates": ["As specified in agreement"],
                "top_attention_clauses": [c["clause_title"] for c in norm_clauses if c["attention_level"] == "HIGH"][:3]
            },
            "selectedJurisdiction": state_meta,
            "clauses": norm_clauses
        }


# Global Agent Singleton
tenancy_agent = TenancyLegalAgent()
