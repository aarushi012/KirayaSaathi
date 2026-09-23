"""
Tenancy Legal Compliance Tools for KirayaSaathi Agent.
Performs deterministic, rule-based, and statutory checks across state tenancy acts.
"""

import re
from typing import Dict, Any, Optional, List

try:
    from backend.rag import rag_engine
except ImportError:
    from rag import rag_engine

# Statutory Norms Map for quick tool references
STATE_NORMS = {
    "delhi": {
        "max_deposit_months": 2,
        "standard_notice_days": 30,
        "standard_lock_in_months": 3,
        "max_annual_escalation_pct": 10.0,
        "act_name": "Delhi Rent Control Act / Model Tenancy Guidelines"
    },
    "punjab": {
        "max_deposit_months": 2,
        "standard_notice_days": 30,
        "standard_lock_in_months": 3,
        "max_annual_escalation_pct": 8.0,
        "act_name": "Punjab Rent Act, 1995"
    },
    "chandigarh": {
        "max_deposit_months": 2,
        "standard_notice_days": 30,
        "standard_lock_in_months": 3,
        "max_annual_escalation_pct": 7.0,
        "act_name": "East Punjab Extension to Chandigarh Act & UT Bylaws"
    },
    "haryana": {
        "max_deposit_months": 2,
        "standard_notice_days": 30,
        "standard_lock_in_months": 3,
        "max_annual_escalation_pct": 10.0,
        "act_name": "Haryana Urban Rent Control Act"
    },
    "bangalore": {
        "max_deposit_months": 3, # Model Tenancy guideline cap (historically 10)
        "standard_notice_days": 30,
        "standard_lock_in_months": 3,
        "max_annual_escalation_pct": 8.0,
        "act_name": "Karnataka Rent Act & Bengaluru Urban Tenancy Customs"
    },
    "pune": {
        "max_deposit_months": 3,
        "standard_notice_days": 30,
        "standard_lock_in_months": 3,
        "max_annual_escalation_pct": 10.0,
        "act_name": "Maharashtra Rent Control Act (Leave & License Framework)"
    }
}


def get_state_norm(state: str) -> Dict[str, Any]:
    st = (state or "delhi").lower().strip()
    return STATE_NORMS.get(st, STATE_NORMS["delhi"])


def validate_security_deposit(
    deposit_amount: float,
    monthly_rent: float,
    state: str = "delhi"
) -> Dict[str, Any]:
    """
    Evaluates requested security deposit against Model Tenancy benchmarks and state practices.
    """
    if monthly_rent <= 0:
        return {
            "status": "UNKNOWN",
            "message": "Monthly rent not specified; unable to calculate deposit multiple."
        }

    multiple = deposit_amount / monthly_rent
    norm = get_state_norm(state)
    max_months = norm["max_deposit_months"]

    if multiple > max_months:
        return {
            "status": "HIGH_ATTENTION",
            "deposit_multiple": round(multiple, 1),
            "benchmark_limit": max_months,
            "message": f"Security deposit is {round(multiple, 1)} months of rent, exceeding the {max_months}-month Model Tenancy benchmark for {state.capitalize()}.",
            "suggestion": f"Could we align the security deposit with standard {max_months}-month guidelines under the Model Tenancy framework?"
        }
    elif multiple > max_months - 1:
        return {
            "status": "STANDARD_BALANCED",
            "deposit_multiple": round(multiple, 1),
            "benchmark_limit": max_months,
            "message": f"Deposit of {round(multiple, 1)} months is within standard market limits for {state.capitalize()}."
        }
    else:
        return {
            "status": "LOW_ATTENTION",
            "deposit_multiple": round(multiple, 1),
            "benchmark_limit": max_months,
            "message": f"Deposit is moderate and tenant-friendly ({round(multiple, 1)} month rent)."
        }


def validate_notice_period(notice_days: int, state: str = "delhi") -> Dict[str, Any]:
    """
    Verifies that the contract notice period complies with state statutory minimums (typically 30 days).
    """
    norm = get_state_norm(state)
    std_days = norm["standard_notice_days"]

    if notice_days < std_days:
        return {
            "status": "HIGH_ATTENTION",
            "notice_days": notice_days,
            "standard_days": std_days,
            "message": f"Notice period of {notice_days} days is shorter than the standard {std_days}-day notice requirement in {state.capitalize()}.",
            "suggestion": f"Would it be possible to provide a standard {std_days}-day written notice period for either party?"
        }
    elif notice_days > 60:
        return {
            "status": "MEDIUM_ATTENTION",
            "notice_days": notice_days,
            "standard_days": std_days,
            "message": f"Notice period of {notice_days} days is unusually long for a residential tenancy.",
            "suggestion": "Could we consider a standard 30 to 45 days written notice for mutual flexibility?"
        }
    else:
        return {
            "status": "STANDARD_BALANCED",
            "notice_days": notice_days,
            "standard_days": std_days,
            "message": f"Notice period of {notice_days} days aligns with standard tenancy practices."
        }


def validate_lock_in_period(lock_in_months: int, total_lease_months: int = 11, state: str = "delhi") -> Dict[str, Any]:
    """
    Checks if lock-in period is disproportionately restrictive.
    """
    norm = get_state_norm(state)
    std_lock = norm["standard_lock_in_months"]

    if lock_in_months > 6:
        return {
            "status": "HIGH_ATTENTION",
            "lock_in_months": lock_in_months,
            "standard_months": std_lock,
            "message": f"Lock-in period of {lock_in_months} months restricts tenant mobility severely.",
            "suggestion": "Could we reduce the lock-in period to a standard 3 months with an exception for job/study relocations?"
        }
    elif lock_in_months > 3:
        return {
            "status": "MEDIUM_ATTENTION",
            "lock_in_months": lock_in_months,
            "standard_months": std_lock,
            "message": f"Lock-in of {lock_in_months} months is on the higher side of normal.",
            "suggestion": "Could we include a standard relocation clause allowing early exit with 30-day notice in case of job transfer?"
        }
    else:
        return {
            "status": "STANDARD_BALANCED",
            "lock_in_months": lock_in_months,
            "standard_months": std_lock,
            "message": f"Lock-in period of {lock_in_months} months is standard."
        }


def inspect_landlord_entry_clause(clause_text: str, state: str = "delhi") -> Dict[str, Any]:
    """
    Evaluates whether landlord entry clause respects tenant quiet enjoyment and 24h notice rules.
    """
    text_lower = clause_text.lower()
    has_unannounced = bool(re.search(r'(without\s+(any\s+)?prior\s+notice|at\s+any\s+time|arbitrary)', text_lower))
    has_notice = bool(re.search(r'(24\s*(hours|hrs)|advance\s+notice|prior\s+written\s+notice)', text_lower))

    if has_unannounced and not has_notice:
        return {
            "status": "HIGH_ATTENTION",
            "concerns": ["Unannounced entry", "Lack of 24h advance notice requirement"],
            "message": f"Clause permits unannounced landlord access, violating tenant quiet enjoyment standards in {state.capitalize()}.",
            "suggestion": "Would it be possible to define a reasonable notice period of at least 24 hours in writing before non-emergency property visits?"
        }
    else:
        return {
            "status": "STANDARD_BALANCED",
            "message": "Landlord entry clause includes reasonable notice or emergency qualifiers."
        }


def analyze_painting_and_deduction_clause(clause_text: str, state: str = "delhi") -> Dict[str, Any]:
    """
    Checks for automatic non-refundable repainting or turnover deductions upon move-out.
    """
    text_lower = clause_text.lower()
    has_painting_deduction = bool(re.search(r'(paint(ing)?|whitewash|turnover|deep\s*clean)', text_lower))
    has_automatic_forfeit = bool(re.search(r'(automatic(ally)?|mandatory|regardless|deduct\s+1\s+month|forfeit)', text_lower))

    if has_painting_deduction and has_automatic_forfeit:
        return {
            "status": "HIGH_ATTENTION",
            "concerns": ["Automatic painting charge", "No wear-and-tear exemption"],
            "message": f"Mandatory move-out repainting fee without proof of damage is non-standard under {state.capitalize()} tenancy guidelines.",
            "suggestion": "Could we agree that deductions will only reflect actual documented repairs against receipts if walls show damage beyond normal wear and tear?"
        }
    elif has_painting_deduction:
        return {
            "status": "MEDIUM_ATTENTION",
            "message": "Painting clause present; ensure normal wear and tear is exempt from tenant liability."
        }
    else:
        return {
            "status": "STANDARD_BALANCED",
            "message": "No predatory repainting deduction identified."
        }


def query_state_rent_act(query: str, state: str = "delhi") -> str:
    """
    Tool to query the RAG knowledge base for specific statutory sections.
    """
    matches = rag_engine.retrieve_relevant_laws(query=query, state=state, top_k=2)
    if not matches:
        return f"No specific statutory citations found for {query} in {state.capitalize()}."

    snippets = []
    for m in matches:
        snippets.append(f"[{m['state']} - {m['section_title']}]: {m['content']}")

    return "\n\n".join(snippets)
