# Rental Clause Benchmark — Chandigarh

> **Status: DRAFT, NOT VERIFIED, with a specific naming conflict flagged below.** Compiled from case-law summaries and secondary sources, not cross-checked against the India Code bare act or UT gazette. Verify before production ingestion (context.md §8).

## Ingestion metadata
- `jurisdiction`: Chandigarh
- `doc_type`: benchmark
- `language`: en
- `primary_law`: East Punjab Urban Rent Restriction Act, 1949 — **as extended to Chandigarh**, not a standalone Chandigarh act (see naming conflict below)
- `central_laws_referenced`: Transfer of Property Act 1882; Registration Act 1908; Indian Stamp Act 1899; Capital of Punjab (Development and Regulation) Act 1952 (context-specific, governs Chandigarh property generally)

## Naming conflict the team must resolve before ingestion
context.md flags Chandigarh as "VERIFY which rent law applies." Research in this pass surfaced **two inconsistent accounts**:

1. **Multiple High Court case-law sources** (the more authoritative type of source) consistently describe the applicable law as the **East Punjab Urban Rent Restriction Act, 1949**, extended to the Union Territory of Chandigarh by the **East Punjab Urban Rent Restriction (Extension to Chandigarh) Act, 1974**, and further amended for Chandigarh specifically by a **1982 amendment Act** (referenced in one judgment as "Act No. 2 of 1985" for the assent/commencement date). Eviction petitions in Chandigarh are filed under this Act's §13 before the local Rent Controller.
2. **A small number of non-legal blog sources** refer instead to a standalone **"Chandigarh Rent Control Act, 2001."** This title did not appear in any case-law or government source found in this pass, and may be a misidentification by those blogs (possibly confusing it with an unrelated 2001 notification or amendment date).

**Do not ingest either as settled fact.** Confirm the correct citation against India Code / the Chandigarh Administration's gazette notifications before this file is used to generate citations for users. If account (1) is confirmed, cite the Act as "East Punjab Urban Rent Restriction Act, 1949 (as extended and amended for Chandigarh)," not as a separate Chandigarh-only statute.

## Coverage gap: the rent-ceiling notification
A **2002 Chandigarh Administration notification** reportedly removed properties with monthly rent **above ₹1,500** from the Act's coverage, leaving such tenancies to be governed purely by the private contract (so a contractual notice period, e.g. two months, controls termination rather than the Act's statutory grounds). This figure is now over two decades old and, given inflation in Chandigarh rents, **almost certainly needs updating** — **VERIFY the current threshold** before using it to decide whether a given lease is Act-covered or contract-only.

## Clause-by-clause benchmark

### 1. Rent and escalation
- **If Act-covered (rent below the current threshold):** rent-fixing/"fair rent" mechanics under EPURRA apply, similar to Punjab.
- **If above the threshold:** rent and escalation are purely contractual.

### 2. Security deposit and refund
- No Chandigarh-specific statutory cap surfaced; a secondary source states deposits "should be reasonable" and refundable after damage deductions, which reads as a general fairness principle rather than a specific enacted cap — **VERIFY**.

### 3. Lock-in period
- Contractual term; same fairness benchmark as other jurisdictions.

### 4. Notice period and termination
- **If Act-covered:** landlord must apply to the Rent Controller and prove a statutory ground (same §13 grounds as Punjab — arrears, subletting, material alteration, nuisance, personal bona fide need, etc.), and cannot terminate by notice alone.
- **If above the rent threshold (contract-only):** the notice period stated in the lease controls; two months was cited as an example in secondary sources describing this regime, but this is illustrative, not a mandated minimum.
- **Standard, regardless of regime:** a landlord cannot forcibly evict a tenant without serving a legal eviction notice and following due process; unlawful self-help eviction is not permitted.

### 5. Eviction terms
- **If Act-covered:** grounds mirror EPURRA §13 as applied in Punjab (see punjab.md) — arrears of rent, unauthorised subletting, material alteration, nuisance, tenant ceasing to occupy, landlord's bona fide personal necessity, service-tenancy termination.
- **If above the threshold:** eviction proceeds as a civil suit under Order 7 Rule 1, CPC (i.e., ordinary civil procedure, not the Rent Controller's summary process) when the Rent Act does not apply.
- Enforcement of an eviction decree, if the tenant does not vacate, follows execution proceedings under Order 21, CPC, potentially with police assistance.
- **Flag as Unfair:** any clause allowing the landlord to bypass legal process (self-help eviction, lock-changing, forcible removal) — impermissible under both regimes.

### 6. Maintenance and repairs
- Follows the same EPURRA tenant-repair-and-deduct mechanism as Punjab where the Act applies; otherwise a contractual default (**VERIFY**).

### 7. Utilities and charges
- No Chandigarh-specific provision found; apply the general norm against utility cut-off as a pressure tactic.

### 8. Subletting
- **If Act-covered:** unauthorised subletting is a recognised eviction ground, as in Punjab.

### 9. Landlord entry and privacy
- No specific statutory text surfaced; secondary sources state a landlord "cannot enter without prior notice unless there is an emergency" — treat as a fairness benchmark pending a firmer legal source.

### 10. Registration and stamp duty
- Governed by the Registration Act 1908 and Indian Stamp Act 1899 with the Chandigarh/Punjab stamp schedule — **VERIFY current rates**, as UT stamp schedules are periodically revised by notification.

### 11. Penalties and fines
- No Chandigarh-specific penalty figure surfaced distinct from the general Punjab EPURRA framework — treat as inherited from punjab.md pending confirmation that Chandigarh's extension/amendment carried the same penalty provisions forward unchanged.

### 12. Dispute resolution
- **If Act-covered:** Rent Controller, Chandigarh, in the first instance, with revision/appeal to the Punjab & Haryana High Court.
- **If above the threshold:** ordinary civil court, unless the lease specifies arbitration.

## Open verification items
1. Resolve the naming conflict (EPURRA-as-extended vs. a purported standalone "Chandigarh Rent Control Act, 2001") against an authoritative source.
2. Confirm the current rent-ceiling threshold for Act coverage (₹1,500, set in 2002, is almost certainly outdated).
3. Confirm current stamp duty/registration thresholds for Chandigarh leases.
4. Confirm whether the Model Tenancy Act framework has been adopted for Chandigarh in any recent notification.
