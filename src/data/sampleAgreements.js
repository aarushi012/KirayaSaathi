/**
 * Sample Rental Agreements & Predefined Analysis for Hackathon Demo Mode.
 * Contains realistic examples of:
 * - Rent
 * - Security deposit
 * - Lock-in period
 * - Notice period
 * - Maintenance
 * - Landlord access
 * - Late payment
 * - Termination
 */

export const BUNDLED_DEMO_AGREEMENT_TEXT = `RESIDENTIAL LEASE & TENANCY AGREEMENT

This Agreement is entered into on October 15, 2026, by and between Evergreen Horizon Realty ("Landlord") and prospective resident ("Tenant") for the premises located at Unit 504, 1200 Beacon Boulevard.

1. MONTHLY RENT & DUE DATE
Tenant shall pay Landlord a monthly rent of $2,400.00 USD, payable in advance on the 1st day of each calendar month via authorized electronic bank transfer.

2. SECURITY DEPOSIT & CONDITIONS
Tenant shall deposit the sum of $3,600.00 upon lease signing. Landlord reserves the absolute right to deduct mandatory unit turnover fees, carpet re-steaming charges, and administrative repainting costs upon move-out regardless of normal wear and tear. Any remaining balance will be returned within 60 days following move-out inspection.

3. MANDATORY LOCK-IN PERIOD
Both parties agree to a strict mandatory lock-in period of 6 months from the commencement date. Tenant may not terminate the lease or vacate the premises under any circumstances during this initial 6-month lock-in period.

4. NOTICE PERIOD FOR VACATING
Following the expiration of the lock-in period, either party may terminate this tenancy by providing at least 60 days prior written notice via certified mail to the other party.

5. MAINTENANCE & MINOR REPAIRS
Tenant agrees to bear the full expense of all plumbing repairs, air conditioning servicing, and minor appliance fixes up to $250.00 per occurrence, including repairs necessitated by age or pre-existing equipment wear.

6. LANDLORD ACCESS & PROPERTY ENTRY
Landlord and their authorized agents retain the right to enter the leased premises at any time and without prior notice to inspect the property, perform arbitrary checks, or show the apartment to prospective buyers.

7. LATE FEES & PAYMENT DELAYS
If rent is not received by 11:59 PM on the 3rd day of the month, Tenant shall incur an immediate late charge of 10% of monthly rent ($240.00) plus an additional fee of $20.00 for each subsequent day until paid in full.

8. EARLY TERMINATION & PENALTIES
In the event Tenant vacates prior to the expiration of the full 12-month term, Tenant shall forfeit the full security deposit ($3,600.00) and shall remain liable for an additional two (2) months rent ($4,800.00) as liquidated damages.`;

export const PREDEFINED_DEMO_ANALYSIS = {
  title: 'Sample Residential Lease (Demo Mode)',
  isDemoMode: true,
  isLiveAI: false,
  aiProvider: 'Demo Engine (Pre-loaded Sample)',
  numPages: 2,
  summary: 'This residential agreement contains 8 structured clauses for an apartment lease at $2,400/month. The contract includes several strict conditions regarding unannounced landlord access, turnover deductions from the security deposit, and substantial early departure penalties that warrant tenant attention.',
  total_clauses_analyzed: 8,
  totalClauses: 8,
  low_attention: 1,
  standardCount: 1,
  medium_attention: 3,
  moderateCount: 3,
  high_attention: 4,
  highAttentionCount: 4,
  overallRating: 'Moderate to High Attention Needed',
  ratingColor: 'amber',
  key_points: [
    '4 high-attention clauses identified regarding deposit deductions, landlord entry, repairs, and termination penalties.',
    '3 medium-attention terms regarding lock-in period, 60-day notice, and daily late fee compounding.',
    'Clear $2,400/month rent schedule outlined with electronic payment terms.'
  ],
  agreement_at_a_glance: {
    summary: 'This 12-month residential lease for Unit 504 specifies a monthly rent of $2,400 and a $3,600 security deposit. It imposes a 6-month lock-in period and requires 60 days written notice to vacate. Key areas of concern include immediate landlord entry without advance notice, out-of-pocket repair burdens for pre-existing defects up to $250, and full deposit forfeiture for early departure.',
    financial_terms: {
      rent: '$2,400.00/month (Due on 1st)',
      security_deposit: '$3,600.00 (Subject to deductions)',
      lock_in_period: '6 months mandatory',
      notice_period: '60 days prior written notice'
    },
    important_dates: [
      'Agreement Date: October 15, 2026',
      'Lock-in Duration: 6 months mandatory',
      'Lease Term: 12 months fixed'
    ],
    top_attention_clauses: [
      'Landlord Entry Without Notice (HIGH)',
      'Security Deposit Deductions & 60-Day Return (HIGH)',
      'Early Termination Penalty & Deposit Loss (HIGH)',
      'Tenant Repair Costs for Pre-existing Wear (HIGH)'
    ]
  },
  clauses: [
    {
      id: 1,
      clause_title: 'Monthly Rent & Due Date',
      title: 'Monthly Rent & Due Date',
      category: 'Rent',
      attention_level: 'LOW',
      attentionLevel: 'Standard',
      original_text: 'Tenant shall pay Landlord a monthly rent of $2,400.00 USD, payable in advance on the 1st day of each calendar month via authorized electronic bank transfer.',
      originalText: 'Tenant shall pay Landlord a monthly rent of $2,400.00 USD, payable in advance on the 1st day of each calendar month via authorized electronic bank transfer.',
      simple_explanation: 'You agree to pay $2,400 rent on the 1st day of every month through electronic bank transfer.',
      simplifiedText: 'You agree to pay $2,400 rent on the 1st day of every month through electronic bank transfer.',
      reason: 'Clear commercial rent terms with standard electronic payment schedule.',
      negotiation_suggestion: 'Could we confirm the preferred electronic payment portal and whether automated receipts will be provided?',
      negotiationTip: 'Could we confirm the preferred electronic payment portal and whether automated receipts will be provided?',
      suggestedQuestion: 'Could we confirm the preferred electronic payment portal and whether automated receipts will be provided?'
    },
    {
      id: 2,
      clause_title: 'Security Deposit & Turnover Deductions',
      title: 'Security Deposit & Turnover Deductions',
      category: 'Security Deposit',
      attention_level: 'HIGH',
      attentionLevel: 'May Require Attention',
      original_text: 'Tenant shall deposit the sum of $3,600.00 upon lease signing. Landlord reserves the absolute right to deduct mandatory unit turnover fees, carpet re-steaming charges, and administrative repainting costs upon move-out regardless of normal wear and tear. Any remaining balance will be returned within 60 days following move-out inspection.',
      originalText: 'Tenant shall deposit the sum of $3,600.00 upon lease signing. Landlord reserves the absolute right to deduct mandatory unit turnover fees, carpet re-steaming charges, and administrative repainting costs upon move-out regardless of normal wear and tear. Any remaining balance will be returned within 60 days following move-out inspection.',
      simple_explanation: 'You must pay a $3,600 deposit, but the landlord allows automatic deductions for repainting and turnover cleaning even if you leave the apartment in good shape, with a 60-day delay for refunds.',
      simplifiedText: 'You must pay a $3,600 deposit, but the landlord allows automatic deductions for repainting and turnover cleaning even if you leave the apartment in good shape, with a 60-day delay for refunds.',
      reason: 'Standard tenancy norms customarily protect deposits from normal wear-and-tear deductions and specify refund timelines between 14 and 30 days.',
      negotiation_suggestion: 'Could we clarify that the deposit will not be deducted for normal wear and tear, and adjust the return timeline to 21 days?',
      negotiationTip: 'Could we clarify that the deposit will not be deducted for normal wear and tear, and adjust the return timeline to 21 days?',
      suggestedQuestion: 'Could we clarify that the deposit will not be deducted for normal wear and tear, and adjust the return timeline to 21 days?'
    },
    {
      id: 3,
      clause_title: 'Mandatory Lock-in Period',
      title: 'Mandatory Lock-in Period',
      category: 'Lock-in Period',
      attention_level: 'MEDIUM',
      attentionLevel: 'Consider Discussing',
      original_text: 'Both parties agree to a strict mandatory lock-in period of 6 months from the commencement date. Tenant may not terminate the lease or vacate the premises under any circumstances during this initial 6-month lock-in period.',
      originalText: 'Both parties agree to a strict mandatory lock-in period of 6 months from the commencement date. Tenant may not terminate the lease or vacate the premises under any circumstances during this initial 6-month lock-in period.',
      simple_explanation: 'You are committed to staying and paying rent for at least the first 6 months with no option to leave early during that time.',
      simplifiedText: 'You are committed to staying and paying rent for at least the first 6 months with no option to leave early during that time.',
      reason: 'A strict lock-in period restricts your flexibility if you experience job changes, medical issues, or unforeseen relocation.',
      negotiation_suggestion: 'Would it be possible to include an early-exit exception for unforeseen job relocation with 30 days notice?',
      negotiationTip: 'Would it be possible to include an early-exit exception for unforeseen job relocation with 30 days notice?',
      suggestedQuestion: 'Would it be possible to include an early-exit exception for unforeseen job relocation with 30 days notice?'
    },
    {
      id: 4,
      clause_title: 'Notice Period for Vacating',
      title: 'Notice Period for Vacating',
      category: 'Notice Period',
      attention_level: 'MEDIUM',
      attentionLevel: 'Consider Discussing',
      original_text: 'Following the expiration of the lock-in period, either party may terminate this tenancy by providing at least 60 days prior written notice via certified mail to the other party.',
      originalText: 'Following the expiration of the lock-in period, either party may terminate this tenancy by providing at least 60 days prior written notice via certified mail to the other party.',
      simple_explanation: 'After 6 months, you or the landlord must give 60 days advance written notice by certified mail before ending the tenancy.',
      simplifiedText: 'After 6 months, you or the landlord must give 60 days advance written notice by certified mail before ending the tenancy.',
      reason: 'A 60-day notice requirement is longer than the standard 30-day notice window typical in residential leases.',
      negotiation_suggestion: 'Would you consider adjusting the required move-out notice window to a standard 30-day written notice?',
      negotiationTip: 'Would you consider adjusting the required move-out notice window to a standard 30-day written notice?',
      suggestedQuestion: 'Would you consider adjusting the required move-out notice window to a standard 30-day written notice?'
    },
    {
      id: 5,
      clause_title: 'Maintenance & Minor Repairs Obligation',
      title: 'Maintenance & Minor Repairs Obligation',
      category: 'Maintenance',
      attention_level: 'HIGH',
      attentionLevel: 'May Require Attention',
      original_text: 'Tenant agrees to bear the full expense of all plumbing repairs, air conditioning servicing, and minor appliance fixes up to $250.00 per occurrence, including repairs necessitated by age or pre-existing equipment wear.',
      originalText: 'Tenant agrees to bear the full expense of all plumbing repairs, air conditioning servicing, and minor appliance fixes up to $250.00 per occurrence, including repairs necessitated by age or pre-existing equipment wear.',
      simple_explanation: 'You are responsible for paying up to $250 per repair for AC, plumbing, or appliances, even if the breakdown was caused by pre-existing age or defect before you moved in.',
      simplifiedText: 'You are responsible for paying up to $250 per repair for AC, plumbing, or appliances, even if the breakdown was caused by pre-existing age or defect before you moved in.',
      reason: 'Landlords are customarily responsible for maintaining pre-existing appliances and major structural systems unless damaged by tenant misuse.',
      negotiation_suggestion: 'Could we specify that the tenant is only responsible for minor repairs caused by tenant misuse rather than pre-existing equipment age?',
      negotiationTip: 'Could we specify that the tenant is only responsible for minor repairs caused by tenant misuse rather than pre-existing equipment age?',
      suggestedQuestion: 'Could we specify that the tenant is only responsible for minor repairs caused by tenant misuse rather than pre-existing equipment age?'
    },
    {
      id: 6,
      clause_title: 'Landlord Access & Unannounced Entry',
      title: 'Landlord Access & Unannounced Entry',
      category: 'Landlord Entry',
      attention_level: 'HIGH',
      attentionLevel: 'May Require Attention',
      original_text: 'Landlord and their authorized agents retain the right to enter the leased premises at any time and without prior notice to inspect the property, perform arbitrary checks, or show the apartment to prospective buyers.',
      originalText: 'Landlord and their authorized agents retain the right to enter the leased premises at any time and without prior notice to inspect the property, perform arbitrary checks, or show the apartment to prospective buyers.',
      simple_explanation: 'The landlord states they may enter your apartment at any time without giving you advance notice for inspections or showings.',
      simplifiedText: 'The landlord states they may enter your apartment at any time without giving you advance notice for inspections or showings.',
      reason: 'Tenants are entitled to privacy and quiet enjoyment. Advance notice of at least 24 hours is standard for non-emergency entry.',
      negotiation_suggestion: 'Would it be possible to define a reasonable notice period of at least 24 hours in writing before non-emergency property visits?',
      negotiationTip: 'Would it be possible to define a reasonable notice period of at least 24 hours in writing before non-emergency property visits?',
      suggestedQuestion: 'Would it be possible to define a reasonable notice period of at least 24 hours in writing before non-emergency property visits?'
    },
    {
      id: 7,
      clause_title: 'Late Payment Penalties & Daily Fee',
      title: 'Late Payment Penalties & Daily Fee',
      category: 'Late Payment',
      attention_level: 'MEDIUM',
      attentionLevel: 'Consider Discussing',
      original_text: 'If rent is not received by 11:59 PM on the 3rd day of the month, Tenant shall incur an immediate late charge of 10% of monthly rent ($240.00) plus an additional fee of $20.00 for each subsequent day until paid in full.',
      originalText: 'If rent is not received by 11:59 PM on the 3rd day of the month, Tenant shall incur an immediate late charge of 10% of monthly rent ($240.00) plus an additional fee of $20.00 for each subsequent day until paid in full.',
      simple_explanation: 'Paying rent after the 3rd triggers an immediate $240 penalty plus an extra $20 charge for each additional day it remains unpaid.',
      simplifiedText: 'Paying rent after the 3rd triggers an immediate $240 penalty plus an extra $20 charge for each additional day it remains unpaid.',
      reason: 'A short 3-day grace period combined with both a 10% fee and daily compounding charges can quickly accumulate large penalties.',
      negotiation_suggestion: 'Could we agree on a standard 5-day grace period and a flat 5% late fee without daily compounding charges?',
      negotiationTip: 'Could we agree on a standard 5-day grace period and a flat 5% late fee without daily compounding charges?',
      suggestedQuestion: 'Could we agree on a standard 5-day grace period and a flat 5% late fee without daily compounding charges?'
    },
    {
      id: 8,
      clause_title: 'Early Termination & Total Deposit Forfeiture',
      title: 'Early Termination & Total Deposit Forfeiture',
      category: 'Termination',
      attention_level: 'HIGH',
      attentionLevel: 'May Require Attention',
      original_text: 'In the event Tenant vacates prior to the expiration of the full 12-month term, Tenant shall forfeit the full security deposit ($3,600.00) and shall remain liable for an additional two (2) months rent ($4,800.00) as liquidated damages.',
      originalText: 'In the event Tenant vacates prior to the expiration of the full 12-month term, Tenant shall forfeit the full security deposit ($3,600.00) and shall remain liable for an additional two (2) months rent ($4,800.00) as liquidated damages.',
      simple_explanation: 'Leaving before the 12-month lease ends means you lose all of your $3,600 security deposit and must also pay an extra $4,800 penalty.',
      simplifiedText: 'Leaving before the 12-month lease ends means you lose all of your $3,600 security deposit and must also pay an extra $4,800 penalty.',
      reason: 'Charging both full deposit forfeiture and 2 months of additional rent is an unusually severe dual penalty for early lease departure.',
      negotiation_suggestion: 'Could we consider a standard lease-break policy of 1 month rent with reasonable landlord efforts to find a replacement tenant?',
      negotiationTip: 'Could we consider a standard lease-break policy of 1 month rent with reasonable landlord efforts to find a replacement tenant?',
      suggestedQuestion: 'Could we consider a standard lease-break policy of 1 month rent with reasonable landlord efforts to find a replacement tenant?'
    }
  ]
};

export const sampleAgreements = [
  {
    id: 'sample-hackathon-demo',
    name: 'Hackathon Demo Lease (8 Clauses)',
    type: 'Comprehensive Demo Agreement',
    badge: '⚡ Recommended for Demo',
    badgeColor: 'indigo',
    description: 'Realistic residential lease covering rent, deposit, lock-in, notice, maintenance, landlord access, late payment, and termination.',
    text: BUNDLED_DEMO_AGREEMENT_TEXT,
    predefinedResult: PREDEFINED_DEMO_ANALYSIS
  },
  {
    id: 'sample-high-risk',
    name: 'Lease with Strict Clauses',
    type: 'High Attention / Strict',
    badge: 'Contains Flagged Terms',
    badgeColor: 'amber',
    description: 'A residential lease containing non-refundable deductions, unannounced landlord entry, and heavy tenant repair obligations.',
    text: `RESIDENTIAL LEASE AGREEMENT

1. PREMISES & TERM
The Landlord agrees to rent to the Tenant the apartment located at 742 Evergreen Terrace, Apt 4B, for a fixed term of 12 months commencing on October 1, 2026.

2. SECURITY DEPOSIT & FORFEITURE
The Tenant shall deposit the sum of $2,500 upon execution of this agreement. The Landlord reserves the absolute right to deduct any amounts deemed necessary for general unit repainting, carpet replacement, and routine administrative turnover costs upon vacancy, regardless of normal wear and tear. Any remaining balance shall be refunded within 90 days after departure.

3. LANDLORD ENTRY & INSPECTIONS
The Landlord or their authorized contractors may enter the premises at any time without prior written or oral notice for inspections, showing the property to prospective buyers, or arbitrary checks.

4. MAINTENANCE & STRUCTURAL REPAIRS
The Tenant shall be solely responsible for all maintenance, servicing, and repair costs up to $500 per incident for all appliances, plumbing fixtures, and air conditioning systems, even if malfunction arises from age or pre-existing defects.

5. AUTOMATIC LEASE RENEWAL & ESCALATION
This Lease shall automatically renew for a successive 12-month period unless Tenant provides certified written notice at least 90 days prior to expiration. Upon renewal, the monthly rent shall automatically increase by 15% without further negotiation.

6. GUESTS & OCCUPANCY RESTRICTIONS
No overnight guest may stay on the premises for more than two (2) consecutive nights per month without prior written landlord approval. Unauthorized overnight stays will incur an immediate $100 penalty fee per night.

7. TERMINATION & EARLY EXIT PENALTY
If Tenant terminates the lease early for any reason, Tenant forfeits 100% of the security deposit and remains liable for the entire remaining rent balance for the duration of the term unless a replacement tenant pays a higher rental rate.`
  },
  {
    id: 'sample-standard',
    name: 'Standard Fair Urban Lease',
    type: 'Standard / Balanced',
    badge: 'Standard Terms',
    badgeColor: 'emerald',
    description: 'A typical balanced rental contract with standard 24h notice clauses, security deposit protection, and routine maintenance terms.',
    text: `STANDARD APARTMENT LEASE AGREEMENT

1. TERM OF TENANCY
This lease begins on November 1, 2026, and continues on a month-to-month basis or fixed 1-year term with mutual option to renew upon 30 days notice.

2. SECURITY DEPOSIT
Tenant agrees to deposit one month's rent ($1,800) as security. The deposit will be held in an escrow account. Normal wear and tear will not be deducted. Balance returned with itemized receipts within 21 days of vacating.

3. ACCESS TO PREMISES
Landlord shall provide at least 24 hours prior written notice before entering the premises for routine maintenance or property viewings, except in verifiable emergencies (e.g., active water leak or fire).

4. REPAIRS AND HABITABILITY
Landlord is responsible for major structural, plumbing, heating, and appliance repairs not caused by tenant negligence. Tenant is responsible for minor light bulb replacements and keeping the unit clean.

5. QUIET ENJOYMENT & GUESTS
Tenant is entitled to quiet enjoyment of the premises. Guests are permitted for up to 14 consecutive days within any 6-month period.`
  }
];