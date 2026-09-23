/**
 * State & City Rental Jurisdiction Configurations for KirayaSaathi
 * Supports: Punjab, Chandigarh, Delhi, Haryana, Bangalore, Pune
 */

export const SUPPORTED_STATES = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    stateName: 'Delhi',
    badge: 'Delhi Rent Act',
    iconEmoji: '🏛️',
    act: 'Delhi Rent Control Act & Model Tenancy Framework',
    depositNorm: '1–2 Months Rent',
    noticeNorm: '1 Month Written Notice',
    escalationNorm: '5%–10% Annual Escalation',
    agreementType: '11-Month Lease / Registered Rent Agreement',
    policeVerification: 'Mandatory via Delhi Police Portal',
    paintingClauseNorm: 'Tenant pays only for actual damage beyond normal wear & tear',
    summary: 'Standard 11-month agreements with 1-2 months security deposit and 30-day notice periods.'
  },
  {
    id: 'punjab',
    name: 'Punjab',
    stateName: 'Punjab',
    badge: 'Punjab Rent Act',
    iconEmoji: '🌾',
    act: 'Punjab Rent Act, 1995 / East Punjab Urban Rent Restriction Act',
    depositNorm: '1–2 Months Rent',
    noticeNorm: '1–2 Months Written Notice',
    escalationNorm: '5%–8% Annual Escalation',
    agreementType: '11-Month Tenancy or Registered Lease',
    policeVerification: 'Mandatory Local Police Verification',
    paintingClauseNorm: 'Owner bears routine maintenance; tenant covers operational day-to-day upkeep',
    summary: 'Clear tenant protection against arbitrary eviction and unauthorized mid-term rent hikes.'
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    stateName: 'Chandigarh',
    badge: 'UT Tenancy Rules',
    iconEmoji: '🏙️',
    act: 'East Punjab Urban Rent Restriction (Extension to Chandigarh) Act & UT Administration Rules',
    depositNorm: '1–2 Months Rent',
    noticeNorm: '1 Month Written Notice',
    escalationNorm: '5%–7% Annual Escalation',
    agreementType: '11-Month Agreement with UT Stamp Duty',
    policeVerification: 'Mandatory via Chandigarh Police Tenant Verification',
    paintingClauseNorm: 'Standard move-out inspection without blanket non-refundable forfeiture',
    summary: 'Strict municipal bylaws on sub-letting, tenant verification, and separate sub-metering.'
  },
  {
    id: 'haryana',
    name: 'Haryana',
    stateName: 'Haryana',
    badge: 'Haryana Urban Rent Act',
    iconEmoji: '🏭',
    act: 'Haryana Urban (Control of Rent and Eviction) Act & Gurugram/Faridabad Tenancy Norms',
    depositNorm: '1–2 Months Rent',
    noticeNorm: '1 Month Written Notice',
    escalationNorm: '5%–10% Annual Escalation',
    agreementType: '11-Month Agreement or e-Stamping',
    policeVerification: 'Mandatory Tenant Verification in Gated Societies',
    paintingClauseNorm: 'RWA society maintenance & club fees should be clearly split in the contract',
    summary: 'Focuses on gated community RWA maintenance splitting, lock-in terms, and deposit escrow.'
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    stateName: 'Bangalore (Bengaluru)',
    badge: 'Karnataka Rent Act',
    iconEmoji: '💻',
    act: 'Karnataka Rent Act & Bengaluru Urban Tenancy Customs',
    depositNorm: '2–3 Months Rent (Model Tenancy Cap)',
    noticeNorm: '1–2 Months Written Notice',
    escalationNorm: '5%–8% Annual Escalation',
    agreementType: '11-Month Agreement on e-Stamp Paper',
    policeVerification: 'City Police Tenant Registration',
    paintingClauseNorm: 'Watch out for automatic 1-month painting deduction; negotiate actual wear-and-tear basis',
    summary: 'Balances high security deposit demands (historically 10 months, now negotiated to 2-3 months) with painting fee clauses.'
  },
  {
    id: 'pune',
    name: 'Pune',
    stateName: 'Pune',
    badge: 'Maharashtra Rent Control',
    iconEmoji: '🏰',
    act: 'Maharashtra Rent Control Act, 1999 (Leave & License Framework)',
    depositNorm: '2–3 Months Rent',
    noticeNorm: '1 Month Written Notice',
    escalationNorm: '5%–10% Annual Escalation',
    agreementType: '11-Month Registered Leave & License Agreement',
    policeVerification: 'Mandatory Maharashtra Police / e-KYC Verification',
    paintingClauseNorm: 'Documented inventory handover; deduction only for verifiable damages',
    summary: 'Requires formal Leave and License agreements registered with the Sub-Registrar & digital police verification.'
  }
];

export const DEFAULT_STATE_ID = 'delhi';

export function getJurisdictionById(id) {
  if (!id) return SUPPORTED_STATES[0];
  const found = SUPPORTED_STATES.find(s => s.id.toLowerCase() === id.toLowerCase());
  return found || SUPPORTED_STATES[0];
}
