# Rental Clause Benchmark — Pune (Maharashtra)

> **Status: DRAFT, NOT VERIFIED.** Compiled from case-law summaries and secondary sources, not cross-checked against the India Code bare act. Verify before production ingestion (context.md §8).

## Ingestion metadata
- `jurisdiction`: Pune, Maharashtra
- `doc_type`: benchmark
- `language`: en
- `primary_state_law`: Maharashtra Rent Control Act, 1999 (Maharashtra Act No. 18 of 2000, in force from 31 March 2000) — consolidated the earlier Bombay Rents, Hotel and Lodging House Rates Control Act, 1947, the Hyderabad Houses (Rent, Eviction and Lease) Control Act, 1954, and other regional rent acts.
- `central_laws_referenced`: Transfer of Property Act 1882; Registration Act 1908; Maharashtra Stamp Act; Indian Contract Act 1872

## Coverage gap the system must know about — this is the single most important fact for Pune
Most present-day rentals in Pune (and Maharashtra generally) are **not structured as a "tenancy" under the Maharashtra Rent Control Act at all.** They are structured as an **11-month "Leave and License" agreement**, a distinct legal category under the Maharashtra Rent Control Act / Registration Act that deliberately does **not** create a tenancy, specifically so that neither party is bound by MRCA's tenant-protection and rent-control machinery. A "licensee" under a leave-and-license agreement has materially **fewer** statutory protections than a "tenant" under a genuine MRCA tenancy — most notably, no rent-control-style restriction on eviction grounds; the license simply expires on its stated term. A clause classifier should check the **agreement's own label** (tenancy vs. leave-and-license) before applying MRCA's tenant-eviction-grounds benchmark, because most of MRCA's Chapter III protections will not apply to a leave-and-license arrangement.

## Clause-by-clause benchmark

### 1. Rent and escalation
- **Under a genuine MRCA tenancy:** "standard rent" is fixed and a landlord charging rent above standard rent commits an offence (MRCA §7, cited in secondary sources — **VERIFY exact section**).
- **Under a leave-and-license agreement (the common case):** the license fee and any escalation is purely a matter of contract.

### 2. Security deposit and refund
- **Under MRCA:** deposits must be receipted, and the Act contains a deposit-refund provision (cited as §24 in one secondary source — **VERIFY**).
- **Under leave-and-license:** deposit amount and refund terms are contractual; Pune market practice commonly runs to several months' rent — no statutory cap was confirmed in this pass for licence arrangements specifically.

### 3. Lock-in period
- Contractual in both regimes; same fairness benchmark (a lock-in binding only one party is flag-worthy) applies.

### 4. Notice period and termination
- **Under a genuine MRCA tenancy:** landlord cannot terminate by notice alone — must show one of the Act's specified grounds and go through the prescribed procedure (Chapter III, "when landlord may recover possession").
- **Under leave-and-license:** the license simply ends on its stated term; renewal or early termination follows whatever the agreement itself says, commonly with a 30-day mutual notice clause in Pune practice — **VERIFY this is representative rather than assumed**.

### 5. Eviction terms
- **Under a genuine MRCA tenancy, recognised grounds** (subject to confirming exact current section numbers) include: unauthorised subletting or conversion of residential premises to commercial use; tenant default or misconduct; the landlord's need to carry out genuine repairs, demolition, or reconstruction (with specific procedural safeguards — e.g., after repairs, the landlord must offer the tenant first right to re-occupy, and the tenant has 30 days to accept and deposit one month's rent to hold that right); landlord's bona fide personal occupation need.
- **Under leave-and-license:** removal at the end of term does not require court-proven "grounds" in the same sense, since no tenancy exists — but the licensor still cannot forcibly remove a licensee without following due legal process; "self-help" eviction (changing locks, physically removing belongings) is unlawful protection against unlawful/forcible eviction (echoed in MRCA §22 for tenancies) and is a reasonable cross-cutting benchmark even for licences.
- Source: Maharashtra Rent Control Act, 1999, Chapter III (recovery-of-possession provisions) and §22 (protection against unlawful eviction) — sections referenced in secondary summaries; exact current wording **not independently re-verified**.
- **Flag as Unfair:** any clause allowing a landlord/licensor to re-enter and remove the occupant's belongings without notice or process, in either regime.

### 6. Maintenance and repairs
- **Under MRCA:** landlord has a duty to keep the premises in good repair (§14 area, per secondary summary); tenant may carry out repairs after giving written notice to the landlord and (per one summary) deduct the cost from rent — **VERIFY exact section and mechanics**.
- **Under leave-and-license:** purely contractual; Pune market convention typically puts minor repairs on the licensee and structural repairs on the licensor.

### 7. Utilities and charges
- **Under MRCA:** landlord is prohibited from cutting off or withholding an essential supply or service (a specific provision was referenced in the Act's section list) — a useful citable protection if confirmed.
- **Under leave-and-license:** same principle applied as a general fairness benchmark even without a direct citation.

### 8. Subletting
- **Under MRCA:** unauthorised subletting is a recognised ground for recovery of possession.
- **Under leave-and-license:** sub-licensing without the licensor's written consent is standard practice to prohibit contractually, and its absence (i.e., a licence silent on subletting) could itself be flagged as a gap.

### 9. Landlord entry and privacy
- **Under MRCA:** the Act contains an inspection-of-premises provision (§28 per one secondary summary, covering right to inspect, reasonable time, and prior notice requirements) — **VERIFY exact section and required notice period.**
- **Under leave-and-license:** apply the same fairness benchmark (notice required except emergencies).

### 10. Registration and stamp duty
- **Standard, and important:** MRCA requires tenancy agreements to be **compulsorily registered**; separately, Maharashtra law (under the Maharashtra Rent Control Act / Registration Act framework) also requires leave-and-license agreements to be **registered**, unlike the common informal practice in some other states of leaving 11-month agreements unregistered. **This is a meaningful state-specific difference to flag**: an 11-month Pune leave-and-license agreement that is not registered is a gap worth flagging even though "11 months, unregistered" is treated as normal practice elsewhere in India (e.g., Bangalore).
- **VERIFY** current Maharashtra stamp duty rates for leave-and-license agreements (commonly a small percentage of the license fee, historically low, e.g., a nominal rate for terms up to a stated period — figure not independently confirmed in this pass).

### 11. Penalties and fines
- MRCA's section list references penalty provisions for certain offences (e.g., charging rent above standard rent, "certain offences to be cognizable," offences by companies) — **VERIFY specific fine/imprisonment amounts**, none were confirmed with figures in this research pass.

### 12. Dispute resolution
- **Under MRCA:** disputes go through the Competent Authority set up under the Act (deemed a civil court for certain purposes; MRCA proceedings are deemed judicial proceedings).
- **Under leave-and-license:** disputes are typically civil-court or, if the agreement specifies it, arbitration matters.

## Open verification items
1. Confirm current MRCA section numbers for standard rent, deposit refund, repair-and-deduct, inspection notice, and penalty amounts (several are cited from secondary summaries, not the bare act, in this pass).
2. Confirm current Maharashtra stamp duty rate for leave-and-license agreements in Pune.
3. Confirm the precise legal boundary between "tenancy" and "leave-and-license" as Maharashtra courts currently apply it, since misclassifying a clause set against the wrong regime would produce a wrong Standard/Unusual/Unfair verdict.
