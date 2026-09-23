# Rental Clause Benchmark — Punjab

> **Status: DRAFT, NOT VERIFIED.** Compiled from case-law summaries and secondary sources, not cross-checked against the India Code bare act. Verify before production ingestion (context.md §8).

## Ingestion metadata
- `jurisdiction`: Punjab
- `doc_type`: benchmark
- `language`: en
- `primary_state_law`: East Punjab Urban Rent Restriction Act, 1949 (EPURRA) — commonly referred to loosely as the "Punjab Urban Rent Restriction Act, 1947," but the Act in current force, amended repeatedly up to 2001, is the 1949 Act.
- `central_laws_referenced`: Transfer of Property Act 1882; Registration Act 1908; Indian Stamp Act 1899; Indian Contract Act 1872

## Naming note for the team
context.md lists "Punjab Urban Rent Restriction Act, 1947" as the candidate source. Research in this pass consistently found the operative statute referred to in case law as the **East Punjab Urban Rent Restriction Act, 1949**, which itself refers back to a 1947 Act and has been amended many times since (including a 1985 amendment). **VERIFY** which exact title/year the India Code lists as currently in force before citing a specific act name to users.

## Clause-by-clause benchmark

### 1. Rent and escalation
- No fixed statutory escalation cap surfaced in this pass; rent revision generally follows the agreement, with the Rent Controller able to fix "fair rent" on application in a dispute.
- **VERIFY** fair-rent determination mechanics under EPURRA.

### 2. Security deposit and refund
- No EPURRA-specific deposit cap surfaced. Treat as a contractual term; flag deposits well above 2–3 months' rent as "exceeds common regional practice" rather than "illegal," pending verification.

### 3. Lock-in period
- Contractual term, not addressed by EPURRA. Same fairness benchmark as other jurisdictions: a lock-in binding only the tenant is a flag-worthy asymmetry.

### 4. Notice period and termination
- **Standard:** A landlord cannot terminate and recover possession merely by giving notice — EPURRA §13 requires the landlord to apply to the Rent Controller and prove one of the Act's specified grounds; the tenant remains a tenant even after a termination notice until the Controller orders eviction.
- Source: East Punjab Urban Rent Restriction Act, 1949, §13.

### 5. Eviction terms
- **Standard grounds recognised under EPURRA §13** (subject to verification of the current, amended text): arrears of rent; unauthorised subletting; material alteration reducing the value/utility of the premises; nuisance; tenant ceasing to occupy; landlord's bona fide personal necessity; termination of a service tenancy (premises let to an employee as part of their job) — subject to Industrial Disputes Act protections if the dismissal itself is contested; special provisions for landlords who are serving members of the armed forces.
- **Landlord accountability after a personal-need eviction:** if a landlord evicts a tenant on the ground of personal need but then does not occupy the property within a set period, or re-lets it to someone other than the evicted tenant within three years, the evicted tenant can apply to be restored to possession, and the landlord may face imprisonment up to six months or a fine up to ₹1,000 (or both) for letting it to a third party in that window.
- **Tenant protection against frivolous filings:** if the Controller finds a landlord's eviction application frivolous or vexatious, the Controller can order compensation to the tenant (an older, quite low statutory ceiling was cited in some case summaries — VERIFY the current amount, it has almost certainly been revised since the Act's early amendments).
- Source: East Punjab Urban Rent Restriction Act, 1949, §13 and related provisions (§13-A referenced in Chandigarh case law for a related mechanism). — sections confirmed to exist; exact current wording not independently re-verified.
- **Flag as Unfair:** any lease clause purporting to bypass the Rent Controller process entirely (e.g., "landlord may re-enter and change locks on 7 days' notice") — inconsistent with the Act's court-only eviction scheme.

### 6. Maintenance and repairs
- **Standard:** If a landlord fails to carry out necessary (non-structural) repairs, the tenant can apply to the Controller, who may direct the tenant to carry out the repairs and deduct the cost from rent payable.
- Source: EPURRA repair-default provision (section number not independently confirmed in this pass — **VERIFY**).

### 7. Utilities and charges
- No EPURRA-specific provision surfaced; treat utility cut-off during a dispute as a flag-worthy "self-help" pattern, consistent with the broader Indian tenancy-law norm against it.

### 8. Subletting
- **Standard:** Unauthorised subletting is itself a ground for eviction under §13 (see above).

### 9. Landlord entry and privacy
- No explicit EPURRA clause surfaced; apply the general fairness benchmark (notice required except emergencies).

### 10. Registration and stamp duty
- Governed by the Registration Act 1908 and Indian Stamp Act 1899 plus Punjab's state stamp schedule — **VERIFY** current Punjab-specific duty rates and the registration threshold (commonly 11 months/1 year as elsewhere in India).

### 11. Penalties and fines
- The one specific penalty figure surfaced (imprisonment up to 6 months / fine up to ₹1,000 for a landlord violating the personal-need re-letting restriction) is noted above under Eviction; **VERIFY** it is still the current amount, since older Rent Act penalty figures are frequently outdated by later amendments.

### 12. Dispute resolution
- **Standard:** Disputes go to the Rent Controller (not a plain civil court) in the first instance, with the standard right of judicial revision/appeal through the High Court.

## Open verification items
1. Confirm the exact currently-in-force title/year of the Act (1947 vs. 1949 naming) against India Code.
2. Confirm current compensation ceiling for frivolous eviction applications.
3. Confirm current Punjab stamp duty schedule for residential leases.
4. Confirm whether Punjab has issued any Model Tenancy Act-aligned amendment since 2021.
