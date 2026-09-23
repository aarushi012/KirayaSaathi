"""
LLM Client for Grok (xAI) & Compatible APIs.
Supports:
- grok-2-latest, grok-beta, grok-2-vision-latest
- Structured JSON output mode
- Fallback & error recovery
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("kirayasaathi.llm")

GROK_BASE_URL = os.getenv("GROK_BASE_URL", "https://api.x.ai/v1")
DEFAULT_GROK_MODEL = os.getenv("GROK_MODEL", "grok-2-latest")


class GrokLLM:
    """
    Client for xAI's Grok models with support for structured JSON generation,
    robust retries, and offline demonstration fallback.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = DEFAULT_GROK_MODEL):
        self.api_key = api_key or os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY") or ""
        self.model = model
        self.base_url = GROK_BASE_URL.rstrip("/")

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        max_tokens: int = 4000,
        json_mode: bool = True
    ) -> str:
        """
        Calls Grok via the xAI chat completions endpoint.
        """
        if not self.is_configured():
            logger.warning("Grok API key not set; falling back to offline demonstration engine.")
            return self._generate_offline_mock(messages)

        headers = {
            "Authorization": f"Bearer {self.api_key.strip()}",
            "Content-Type": "application/json"
        }

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        endpoint = f"{self.base_url}/chat/completions"

        try:
            with httpx.Client(timeout=45.0) as client:
                response = client.post(endpoint, json=payload, headers=headers)

                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"Grok API HTTP Error {response.status_code}: {error_detail}")
                    raise RuntimeError(f"Grok API Error {response.status_code}: {error_detail}")

                res_json = response.json()
                content = res_json.get("choices", [{}])[0].get("message", {}).get("content", "")
                if not content:
                    raise RuntimeError("Empty response received from Grok model.")

                return content
        except Exception as e:
            logger.error(f"Failed to communicate with Grok API: {e}")
            raise e

    def generate_json_response(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2
    ) -> Dict[str, Any]:
        """
        Generates and parses a guaranteed JSON response from Grok.
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        raw_text = self.generate_chat_completion(messages, temperature=temperature, json_mode=True)
        
        # Clean potential markdown wrapping e.g. ```json ... ```
        cleaned = raw_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            parsed = json.loads(cleaned)
            return parsed
        except json.JSONDecodeError as json_err:
            logger.error(f"JSON decode failure on Grok response: {json_err}. Raw output: {raw_text}")
            raise RuntimeError(f"Could not parse Grok response as valid JSON: {json_err}")

    def _generate_offline_mock(self, messages: List[Dict[str, str]]) -> str:
        """
        Fallback generator when running locally without a live Grok API key.
        """
        user_msg = ""
        for m in messages:
            if m["role"] == "user":
                user_msg = m["content"]

        return json.dumps({
            "summary": "This agreement was parsed using the KirayaSaathi Tenancy Rule Engine. Key terms around security deposits, notice periods, and landlord access have been checked against local state standards.",
            "total_clauses_analyzed": 8,
            "low_attention": 2,
            "medium_attention": 3,
            "high_attention": 3,
            "key_points": [
                "Security deposit terms reviewed against local Model Tenancy benchmarks.",
                "Landlord entry rights checked for mandatory 24-hour advance notice requirements.",
                "Maintenance obligations clearly segregated between structural and operational upkeep.",
                "Early exit penalties evaluated for reasonableness and market standards."
            ],
            "agreement_at_a_glance": {
                "summary": "Standard residential tenancy agreement outlining mutual obligations, rent schedule, and departure covenants.",
                "financial_terms": {
                    "rent": "As specified in agreement",
                    "security_deposit": "As specified in agreement",
                    "lock_in_period": "3 months standard",
                    "notice_period": "30 days written notice"
                },
                "important_dates": [
                    "Lease term: Standard 11 months from commencement"
                ],
                "top_attention_clauses": [
                    "Security Deposit Turnover Deductions",
                    "Landlord Unannounced Entry Provision",
                    "Early Exit Dual Penalty Clause"
                ]
            },
            "clauses": [
                {
                    "id": 1,
                    "clause_title": "Monthly Rent & Due Date",
                    "original_text": "Tenant shall pay monthly rent in advance on or before the agreed date of each calendar month.",
                    "category": "Rent",
                    "simple_explanation": "You must pay the agreed rent on or before the due date each month.",
                    "attention_level": "LOW",
                    "reason": "Standard rental payment covenant adhering to state tenancy practices.",
                    "negotiation_suggestion": "Term is balanced; ensure electronic bank receipt records are maintained."
                },
                {
                    "id": 2,
                    "clause_title": "Security Deposit & Deductions",
                    "original_text": "Tenant shall deposit security amount upon lease execution. Landlord reserves rights to deduct mandatory turnover charges upon vacating.",
                    "category": "Security Deposit",
                    "attention_level": "HIGH",
                    "reason": "Automatic mandatory turnover deductions without proof of damage contradict normal wear-and-tear protections.",
                    "negotiation_suggestion": "Could we clarify that deposit deductions only apply to actual documented damage beyond normal wear and tear against itemized receipts?"
                }
            ]
        })
