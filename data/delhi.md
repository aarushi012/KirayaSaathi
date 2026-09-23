# Rental Clause Benchmark — Delhi

> **Status: DRAFT, NOT VERIFIED.** Compiled from secondary legal-explainer sources and case-law summaries, not cross-checked against the India Code bare act or a lawyer. Per the project's own rule (context.md, §8), this file must be verified against official sources before it is ingested into the vector DB or shown to a user as a citation. Anywhere a figure looks precise (a rupee amount, a number of months), treat it as a **candidate value to confirm**, not a fact to cite as-is.

## Ingestion metadata (for chunking)
- `jurisdiction`: Delhi
- `doc_type`: benchmark
- `language`: en
- `primary_state_law`: Delhi Rent Control Act, 1958 (DRCA) — **but see coverage gap below**
- `central_laws_referenced`: Transfer of Property Act 1882; Registration Act 1908; Indian Stamp Act 1899; Indian Contract Act 1872; Model Tenancy Act 2021 (not adopted by Delhi — reference only)

## Coverage gap the system must know about
The DRCA's eviction-protection and rent-control machinery only applies to premises let at or below a rent ceiling — commonly cited as **₹3,500/month**, fixed by the 1988 amendment (VERIFY current figure — this has not been revised in decades and most sources still quote it, but confirm against the bare act). **Most present-day Delhi rentals sit above this threshold and fall outside the Act entirely**, meaning they're governed by the plain contract plus the Transfer of Property Act, not by DRCA's tenant protections. A clause classifier should first ask: is the rent under the DRCA ceiling? If yes, DRCA grounds/procedure apply. If no, ordinary contract law applies and DRCA-style protections cannot be assumed.

## Clause-by-clause benchmark

### 1. Rent and escalation
- **Standard:** Rent amount and any escalation (e.g., annual increase of a stated %) fixed by mutual agreement in the contract, since most agreements sit outside DRCA rent-fixing.
- **Unusual:** Escalation clauses with no cap or with increases tied to an undefined index.
- Source: DRCA rent-fixing provisions apply only to premises inside the rent ceiling; above it, Indian Contract Act 1872 governs. — *VERIFY*

### 2. Security deposit and refund
- **Candidate benchmark:** up to 2 months' rent (residential) / up to 6 months' rent (non-residential), the figure attributed to Delhi's 2020-era rent-law modernisation move and echoed by the Model Tenancy Act framework.
- **Flag as Unusual/Unfair:** deposits materially above this (e.g., 6–10 months' rent for a residential flat, which is common informal practice in Delhi) — note this is *market practice*, not necessarily unlawful for premises outside DRCA, so verdict should say "unusual/exceeds recommended benchmark" rather than "illegal" unless the specific legal basis is confirmed.
- Source: secondary summaries citing a 2020 DRCA-adjacent reform and the Model Tenancy Act. — **VERIFY**: whether this cap is actually binding law in Delhi or only a non-binding recommendation.

### 3. Lock-in period
- **Standard:** A fixed minimum stay period (often 6–11 months) during which neither party can terminate without penalty is a normal contractual term, not addressed by DRCA.
- **Flag as Unfair:** a lock-in that binds only the tenant (landlord can terminate anytime, tenant cannot) — one-sided lock-ins are a classic "unfair" pattern worth flagging even without a specific statutory citation.

### 4. Notice period and termination
- **Standard (DRCA-covered premises):** Termination must follow DRCA's eviction procedure — landlord cannot terminate by notice alone; must show a statutory ground before the Rent Controller.
- **Standard (outside DRCA):** Notice period as agreed in the contract; 30 days is common practice but not a statutory minimum found in this research pass. — *VERIFY under Transfer of Property Act §106 default notice periods for leases of immovable property.*
- **Standard practice:** rent is conventionally due by the 15th of the month unless the agreement states otherwise.

### 5. Eviction terms
- **Standard (DRCA-covered premises):** Landlord must obtain an eviction order from the Rent Controller on a ground listed under DRCA §14 (e.g., arrears of rent, subletting without consent, misuse, bona fide personal requirement). A tenant who defaults on rent gets one chance to cure by paying/depositing arrears within a Controller-set timeframe (§15); this protection is lost if the tenant defaults again for three consecutive months after using it once.
- **Standard (outside DRCA):** Eviction proceeds as a civil suit for possession under ordinary contract/property law; no rent-control "grounds" requirement.
- **Flag as Unfair:** any clause purporting to let a landlord re-enter and remove a tenant's possessions without court process ("self-help eviction") — this is broadly disfavoured across Indian tenancy law regardless of jurisdiction.
- Source: Delhi Rent Control Act, 1958, §§14–15 (Chapter III). — sections confirmed present in the Act; exact current wording not independently re-verified here.

### 6. Maintenance and repairs
- No DRCA-specific provision was surfaced in this research pass for outside-ceiling premises; **VERIFY** via Transfer of Property Act §108 (rights and liabilities of lessor/lessee) for the general default rule on who repairs what absent a contract term.
- **Standard practice:** structural repairs = landlord's responsibility; minor/day-to-day upkeep = tenant's responsibility, as a contractual default.

### 7. Utilities and charges
- No Delhi-specific statutory provision found; treat as a plain contractual term.
- **Flag as Unfair:** clauses letting a landlord disconnect water/electricity to pressure a tenant during a dispute (this pattern is treated as unlawful "self-help" across most Indian tenancy regimes).

### 8. Subletting
- **Standard:** Subletting without landlord's written consent is a recognised ground for eviction under DRCA §14 / §16 (restrictions on subletting).
- Source: DRCA §16. — *VERIFY exact text.*

### 9. Landlord entry and privacy
- No explicit DRCA provision surfaced; **flag as Unusual/Unfair** any clause allowing entry without prior notice except for genuine emergencies — this is a widely used fairness benchmark even without a Delhi-specific citation.

### 10. Registration and stamp duty
- Leases under the Registration Act, 1908 generally require registration if the term exceeds 11 months/1 year (VERIFY exact threshold and Delhi-specific stamp schedule under the Indian Stamp Act 1899 / Delhi stamp rules).
- **Common practice:** 11-month agreements are widely used in Delhi specifically to avoid mandatory registration, same pattern as Bangalore and Pune.

### 11. Penalties and fines
- No Delhi-specific penalty clause benchmark surfaced; treat contractual late-fee/damage clauses under general Contract Act "reasonable compensation" principles (Indian Contract Act 1872, §74 — penalty vs. genuine pre-estimate of loss). **VERIFY.**

### 12. Dispute resolution
- **Standard (DRCA-covered):** Disputes go to the Rent Controller, not a civil court, for DRCA matters.
- **Standard (outside DRCA):** Ordinary civil court jurisdiction, unless the agreement specifies arbitration.

## Open verification items (do not ingest as fact until checked)
1. Exact current DRCA rent ceiling (₹3,500 figure is old and may have been revised or judicially reinterpreted).
2. Whether the 2-month/6-month security deposit cap is binding law in Delhi or an unadopted recommendation.
3. Transfer of Property Act §106 default notice period as it applies to Delhi leases outside DRCA.
4. Current Delhi stamp duty schedule and registration threshold for residential leases.
