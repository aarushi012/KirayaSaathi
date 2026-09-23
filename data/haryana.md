# Rental Clause Benchmark — Haryana

> **Status: DRAFT, NOT VERIFIED.** Compiled from case-law summaries and secondary sources, not cross-checked against the India Code bare act. Verify before production ingestion (context.md §8).

## Ingestion metadata
- `jurisdiction`: Haryana
- `doc_type`: benchmark
- `language`: en
- `primary_state_law`: Haryana Urban (Control of Rent and Eviction) Act, 1973 (HURCEA)
- `central_laws_referenced`: Transfer of Property Act 1882; Registration Act 1908; Indian Stamp Act 1899; Indian Contract Act 1872

## Coverage gap the system must know about
HURCEA applies only within Haryana's designated **urban areas** — not cantonment areas — and **exempts newly constructed buildings for the first 10 years from completion of construction** (a common feature in Indian state rent-control acts, meant to encourage new housing stock). A clause classifier should check both: (a) is the property in a covered urban area, and (b) is the building older than 10 years, before assuming HURCEA's tenant-protection machinery applies.

## Clause-by-clause benchmark

### 1. Rent and escalation
- **Standard:** "Fair rent" can be determined by the Controller/Rent Tribunal on application in a dispute; absent a dispute, the agreed rent governs.
- Source: HURCEA "fair rent" determination provisions — **VERIFY exact section**.

### 2. Security deposit and refund
- **Standard:** The Act requires a written tenancy agreement, and requires the landlord to issue a receipt for rent received — deposit-refund practice generally follows the agreement rather than a statutory cap. **VERIFY** whether Haryana has adopted a Model Tenancy Act-style deposit cap in any amendment since 2021.

### 3. Lock-in period
- Contractual term; same fairness benchmark as other jurisdictions applies (a one-sided lock-in binding only the tenant is flag-worthy).

### 4. Notice period and termination
- **Standard:** As with Punjab, a landlord cannot terminate by notice alone; eviction requires an application to, and order from, the Controller on a specified statutory ground.
- **Rent-deposit mechanism:** if a landlord refuses to accept or receipt rent tendered by the tenant, the tenant may apply to the Controller for leave to deposit the rent with the Controller's office; once accepted, this deposit is treated as payment to the landlord, and the Controller notifies the landlord and pays the amount over. This protects a tenant from being made to look like a defaulter by an uncooperative landlord.
- Source: Haryana Urban (Control of Rent and Eviction) Act, 1973, rent-deposit provision (section number not independently confirmed — **VERIFY**).

### 5. Eviction terms
- **Standard grounds** (subject to confirming exact current wording): default in rent payment; unauthorised subletting; damage to the property; landlord's bona fide personal need.
- **Landlord accountability after a personal-need eviction:** where a landlord (or an armed-forces-member landlord within specified time windows around retirement/discharge) evicts on personal-need grounds and then does not occupy the property within 12 months, or re-lets it to a different tenant, the Controller can direct that possession be restored to the originally evicted tenant.
- **Tenant protection against frivolous filings:** if the Controller finds an eviction application frivolous or vexatious, compensation up to ₹500 may be ordered payable to the tenant — **VERIFY this figure is still current**, given the Act is from 1973 and may have been amended.
- Source: Haryana Urban (Control of Rent and Eviction) Act, 1973 (Act No. 11 of 1973), sections on eviction procedure and Controller powers — exact numbering not independently re-verified in this pass.
- **Flag as Unfair:** any clause purporting to let the landlord evict without Controller involvement.

### 6. Maintenance and repairs
- No HURCEA-specific repair-default provision was distinctly surfaced in this pass (contrast with Punjab's EPURRA, which has one); **VERIFY** whether an equivalent provision exists in HURCEA, and fall back to Transfer of Property Act §108 default rules if not.

### 7. Utilities and charges
- No Haryana-specific statutory provision found; apply the general norm against utility disconnection as a pressure tactic during disputes.

### 8. Subletting
- **Standard:** Subletting without permission is a recognised ground for eviction (see above).

### 9. Landlord entry and privacy
- No explicit HURCEA clause surfaced; apply the general fairness benchmark (notice required except emergencies).

### 10. Registration and stamp duty
- Governed by the Registration Act 1908 and Indian Stamp Act 1899 plus Haryana's state stamp schedule — **VERIFY** current rates and thresholds.

### 11. Penalties and fines
- The ₹500 frivolous-application compensation figure noted above is the one specific figure surfaced; treat as a **candidate value pending verification**, not a citable fact.

### 12. Dispute resolution
- **Standard:** Disputes go to the Rent Controller in the first instance; the Act's procedure largely mirrors the Code of Civil Procedure, 1908 for matters not otherwise specified. No second appeal lies against certain classes of possession orders — **VERIFY exactly which orders this restriction covers**, since it materially affects a tenant's appeal rights and is an important thing to get right before citing it.

## Open verification items
1. Confirm which urban areas/municipalities in Haryana are currently notified as covered under HURCEA.
2. Confirm the current frivolous-application compensation ceiling (₹500 figure may be outdated).
3. Confirm whether an HURCEA repair-default mechanism exists, equivalent to Punjab's.
4. Confirm current Haryana stamp duty schedule for residential leases.
5. Confirm the scope of the "no second appeal" restriction on possession orders.
