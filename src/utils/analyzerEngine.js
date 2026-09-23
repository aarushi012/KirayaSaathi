export function analyzeAgreement(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error('Agreement text is empty.');
  }

  const clauses = parseClauses(rawText);
  const analyzedClauses = clauses.map((c, index) => evaluateClause(c, index + 1));

  const highAttentionCount = analyzedClauses.filter(c => c.attentionLevel === 'May Require Attention').length;
  const moderateCount = analyzedClauses.filter(c => c.attentionLevel === 'Consider Discussing').length;
  const standardCount = analyzedClauses.filter(c => c.attentionLevel === 'Standard').length;

  let tenantScore = 100 - (highAttentionCount * 18) - (moderateCount * 7);
  tenantScore = Math.max(25, Math.min(100, tenantScore));

  let overallRating = 'Balanced & Standard';
  let ratingColor = 'emerald';
  if (highAttentionCount >= 3 || tenantScore < 60) {
    overallRating = 'High Caution Recommended';
    ratingColor = 'rose';
  } else if (highAttentionCount > 0 || moderateCount >= 2 || tenantScore < 80) {
    overallRating = 'Moderate Attention Needed';
    ratingColor = 'amber';
  }

  const keyConcerns = analyzedClauses
    .filter(c => c.attentionLevel !== 'Standard')
    .map(c => ({
      clauseId: c.id,
      title: c.title,
      summary: c.reason,
      level: c.attentionLevel
    }));

  return {
    title: extractTitle(rawText),
    totalClauses: analyzedClauses.length,
    highAttentionCount,
    moderateCount,
    standardCount,
    tenantScore,
    overallRating,
    ratingColor,
    keyConcerns,
    clauses: analyzedClauses,
    timestamp: new Date().toISOString()
  };
}

function extractTitle(text) {
  const firstLine = text.trim().split('\n')[0].replace(/^#+\s*/, '').trim();
  if (firstLine.length > 5 && firstLine.length < 80) {
    return firstLine;
  }
  return 'Residential Lease Agreement';
}

function parseClauses(text) {
  const cleaned = text.replace(/\r\n/g, '\n').trim();
  const rawBlocks = cleaned.split(/\n\s*\n+/).filter(b => b.trim().length > 20);
  
  if (rawBlocks.length >= 2) {
    return rawBlocks.map((block, idx) => {
      const lines = block.trim().split('\n');
      let title = `Clause ${idx + 1}`;
      let content = block.trim();
      
      const firstLine = lines[0].trim();
      if (firstLine.length < 90 && (/^\d+\.?/i.test(firstLine) || /^[A-Z\s]{4,}$/.test(firstLine) || /^(Section|Clause|Article)/i.test(firstLine))) {
        title = firstLine.replace(/^(\d+\.|\bSection \d+:?|\bClause \d+:?)/i, '').trim() || `Clause ${idx + 1}`;
        content = lines.slice(1).join('\n').trim() || firstLine;
      }
      return { id: idx + 1, title, text: content };
    });
  }

  return [{
    id: 1,
    title: 'General Agreement Terms',
    text: cleaned
  }];
}

function evaluateClause(clause, id) {
  const t = (clause.title + ' ' + clause.text).toLowerCase();
  
  // 1. Unannounced entry / Privacy
  if (t.includes('at any time') && (t.includes('enter') || t.includes('inspection') || t.includes('access')) && (t.includes('without') || t.includes('no notice'))) {
    return {
      id,
      title: clause.title || 'Landlord Entry & Privacy',
      originalText: clause.text,
      simplifiedText: 'The landlord states they can enter your rented home at any hour without letting you know beforehand for inspections or viewings.',
      attentionLevel: 'May Require Attention',
      category: 'Privacy & Entry',
      reason: 'Standard residential leasing norms generally require at least 24 hours advance written notice prior to non-emergency visits to protect tenant privacy.',
      suggestedQuestion: 'Could we include a requirement for at least 24 hours prior written notice before non-emergency entries?',
      negotiationTip: 'Ask to amend this with standard language: "Except in active emergencies, Landlord will provide minimum 24 hours advance written notice before entering the premises."'
    };
  }

  // 2. Deposit Forfeiture / Wear and Tear
  if ((t.includes('deposit') || t.includes('security')) && (t.includes('wear and tear') || t.includes('painting') || t.includes('forfeit') || t.includes('turnover') || t.includes('90 days') || t.includes('60 days'))) {
    return {
      id,
      title: clause.title || 'Security Deposit Deductions',
      originalText: clause.text,
      simplifiedText: 'The landlord allows broad deductions from your deposit for routine repainting, administrative turnover, or normal usage, and allows a long timeline for refunding.',
      attentionLevel: 'May Require Attention',
      category: 'Security Deposit',
      reason: 'Tenants are typically not financially liable for ordinary wear and tear. A 90-day return window is also longer than common statutory benchmarks (often 14 to 30 days).',
      suggestedQuestion: 'Can we clarify that ordinary wear-and-tear will not be deducted, and specify a 21-day timeline with itemized receipts for any deductions?',
      negotiationTip: 'Request that deductions require documented receipts and photographs, and that normal wear and tear is explicitly excluded.'
    };
  }

  // 3. Maintenance / Tenant paying major repairs
  if ((t.includes('maintenance') || t.includes('repair') || t.includes('plumbing') || t.includes('appliance')) && (t.includes('solely responsible') || t.includes('tenant shall pay') || t.includes('$500') || t.includes('pre-existing') || t.includes('defect'))) {
    return {
      id,
      title: clause.title || 'Maintenance & Repair Obligations',
      originalText: clause.text,
      simplifiedText: 'You are being asked to pay for appliance and system repairs (such as air conditioning and plumbing) even if they break due to age or pre-existing flaws.',
      attentionLevel: 'May Require Attention',
      category: 'Maintenance & Repairs',
      reason: 'Landlords are customarily responsible for maintaining habitable premises and major infrastructure that existed before your tenancy, unless damage is caused by tenant misuse.',
      suggestedQuestion: 'Can we clarify that the landlord covers pre-existing equipment breakdowns and major structural/HVAC maintenance not caused by tenant misuse?',
      negotiationTip: 'Ask for a baseline move-in inspection report so you are not blamed for existing wear on appliances.'
    };
  }

  // 4. Automatic Renewal / Steep Escalation
  if ((t.includes('automatic') || t.includes('renew')) && (t.includes('15%') || t.includes('escalat') || t.includes('90 days') || t.includes('increase'))) {
    return {
      id,
      title: clause.title || 'Automatic Lease Renewal & Rent Hike',
      originalText: clause.text,
      simplifiedText: 'The lease automatically locks you into another full year unless you send notice 90 days in advance, and rent will jump by 15% automatically.',
      attentionLevel: 'May Require Attention',
      category: 'Lease Term & Renewal',
      reason: 'A 90-day notice requirement is easy to miss, and automatic 15% rent increases without market adjustment could result in above-market rates.',
      suggestedQuestion: 'Can we adjust the notice window to 30 or 60 days, and tie any renewal rate increase to local CPI or mutual agreement?',
      negotiationTip: 'Propose that the lease rolls into a month-to-month tenancy upon completion with 30 days notice.'
    };
  }

  // 5. Guests & Overnight restrictions
  if (t.includes('guest') || t.includes('overnight') || t.includes('occupan') || t.includes('visitor')) {
    const isStrict = t.includes('2 consecutive') || t.includes('approval') || t.includes('$100') || t.includes('penalty');
    return {
      id,
      title: clause.title || 'Guest & Occupancy Policy',
      originalText: clause.text,
      simplifiedText: 'Specifies rules and limitations regarding friends, family, or overnight visitors staying at the rental unit.',
      attentionLevel: isStrict ? 'Consider Discussing' : 'Standard',
      category: 'Occupancy & Guests',
      reason: isStrict ? 'Restricting guests to only 2 nights a month or charging instant fines may feel unusually restrictive for regular personal visits.' : 'Standard clause clarifying permitted occupancy limits.',
      suggestedQuestion: isStrict ? 'Would it be possible to allow standard guest stays up to 7 or 14 days without requiring pre-approval fees?' : 'Are there any parking permit procedures for weekend visitors?',
      negotiationTip: 'Clarify reasonable visit durations that do not interfere with quiet enjoyment.'
    };
  }

  // 6. Early Termination & Penalty
  if (t.includes('terminat') || t.includes('early exit') || t.includes('break lease') || t.includes('forfeit')) {
    const isHarsh = t.includes('100%') || t.includes('forfeit') || t.includes('entire remaining');
    return {
      id,
      title: clause.title || 'Early Termination & Penalties',
      originalText: clause.text,
      simplifiedText: 'Outlines what happens if you need to move out before the agreed lease term finishes.',
      attentionLevel: isHarsh ? 'May Require Attention' : 'Consider Discussing',
      category: 'Termination',
      reason: isHarsh ? 'Requiring both total deposit forfeiture and liability for the full remaining year rent can be very punitive.' : 'Outlines standard early termination requirements.',
      suggestedQuestion: 'Is there a standard early-lease break fee (such as 1 or 2 months rent) with landlord duty to mitigate damages?',
      negotiationTip: 'Ask to include a re-letting clause or right to find a qualified sublease.'
    };
  }

  return {
    id,
    title: clause.title || `Clause ${id}`,
    originalText: clause.text,
    simplifiedText: 'Defines standard baseline tenancy terms for the property premises and mutual expectations.',
    attentionLevel: 'Standard',
    category: 'General Terms',
    reason: 'This clause contains common operational wording standard in residential leasing agreements.',
    suggestedQuestion: 'No major modifications needed; verify that dates and contact information are accurate.',
    negotiationTip: 'Confirm all names, addresses, and payment instructions match expectations.'
  };
}