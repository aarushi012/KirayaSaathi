/**
 * AI Analysis Service for Rental Agreement Checker
 * Supports Google Gemini API with structured JSON output, strict legal safety constraints,
 * and an explicit "Agreement at a Glance" non-hallucinatory extraction.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

import { getJurisdictionById } from '../data/jurisdictions';

export const ALLOWED_CATEGORIES = [
  'Rent',
  'Security Deposit',
  'Lock-in Period',
  'Notice Period',
  'Termination',
  'Maintenance',
  'Repairs',
  'Utilities',
  'Late Payment',
  'Penalties',
  'Subletting',
  'Landlord Entry',
  'Renewal',
  'Rent Increase',
  'Pets',
  'Guests',
  'Other'
];

export function getActiveApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }
  const customKey = localStorage.getItem('rental_checker_gemini_key');
  if (customKey && customKey.trim().length > 5) {
    return customKey.trim();
  }
  return null;
}

export function saveCustomApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('rental_checker_gemini_key', key.trim());
  } else {
    localStorage.removeItem('rental_checker_gemini_key');
  }
}

const SYSTEM_PROMPT = `
You are a senior legal-assistance AI specializing in residential tenancy agreements.
Your task is to analyze the provided rental agreement clause by clause for a prospective tenant.

CRITICAL LEGAL SAFETY & TONE RULES:
1. You are an informational assistance tool, NOT a lawyer. You do NOT provide legal advice.
2. NEVER say:
   - "This clause is illegal."
   - "This clause is definitely unfair."
   - "This landlord is violating the law."
3. INSTEAD ALWAYS use neutral, cautious phrasing such as:
   - "May require attention"
   - "Potential concern"
   - "Consider clarifying this clause"
   - "Consider discussing this term with the landlord"
4. CRITICAL NON-HALLUCINATION RULE:
   Only display information that is ACTUALLY PRESENT in the provided agreement text.
   If a financial term, date, or condition is NOT explicitly mentioned in the text, you MUST output:
   "Not specified in the agreement."
   DO NOT guess, assume, or invent missing values.
5. NEGOTIATION SCRIPTS:
   For every clause marked MEDIUM or HIGH attention, generate a short, polite sentence (UNDER 50 WORDS) that the tenant can use with the landlord (e.g. "Could we clarify...", "Would it be possible to...").

RESPONSE FORMAT:
You MUST respond with a single valid JSON object strictly matching this schema:
{
  "summary": "Brief 2-3 sentence overview of the agreement balance and key takeaways for the tenant.",
  "total_clauses_analyzed": 0,
  "low_attention": 0,
  "medium_attention": 0,
  "high_attention": 0,
  "key_points": [
    "Short bullet point summarizing a main highlight or concern"
  ],
  "agreement_at_a_glance": {
    "summary": "One-paragraph simple summary describing the agreement.",
    "financial_terms": {
      "rent": "Explicit amount (e.g. '$1,800/month') OR 'Not specified in the agreement.'",
      "security_deposit": "Explicit amount (e.g. '$2,500') OR 'Not specified in the agreement.'",
      "lock_in_period": "Explicit duration (e.g. '12 months') OR 'Not specified in the agreement.'",
      "notice_period": "Explicit notice requirement (e.g. '90 days written notice') OR 'Not specified in the agreement.'"
    },
    "important_dates": [
      "Explicit start date, end date, or lease duration mentioned in text (or 'Not specified in the agreement.')"
    ],
    "top_attention_clauses": [
      "Short summary of top clauses that deserve closest tenant attention"
    ]
  },
  "clauses": [
    {
      "clause_title": "Short descriptive title of the clause",
      "original_text": "Exact quote of the clause from the provided text",
      "category": "One of the allowed categories",
      "simple_explanation": "Clear, plain English translation for a tenant with zero legal jargon",
      "attention_level": "LOW | MEDIUM | HIGH",
      "reason": "Clear explanation of why this level was assigned, adhering to legal safety wording",
      "negotiation_suggestion": "Polite tenant script under 50 words (e.g., 'Could we clarify...')"
    }
  ]
}
`;

export async function analyzeAgreementWithAI(rawAgreementText, options = {}) {
  if (!rawAgreementText || !rawAgreementText.trim()) {
    throw new Error('Agreement text is empty.');
  }

  const apiKey = getActiveApiKey();
  const selectedState = options.selectedState || 'delhi';
  const jurisdiction = getJurisdictionById(selectedState);

  // 1. First attempt to call the Python Grok RAG Agent Backend API
  try {
    const backendResult = await callPythonBackendAPI(rawAgreementText, selectedState, apiKey);
    if (backendResult && backendResult.clauses && backendResult.clauses.length > 0) {
      return {
        ...backendResult,
        selectedJurisdiction: jurisdiction,
        timestamp: new Date().toISOString()
      };
    }
  } catch (backendErr) {
    // If backend is offline, silently proceed to client-side pipeline
    console.info('Python backend not reachable or returned error; using client-side engine:', backendErr.message);
  }

  // 2. Client-side Live Gemini AI (if key is set)
  if (apiKey) {
    try {
      const liveResult = await callGeminiAPI(rawAgreementText, apiKey, jurisdiction);
      return {
        ...liveResult,
        isLiveAI: true,
        aiProvider: 'Google Gemini (gemini-1.5-flash)',
        selectedJurisdiction: jurisdiction,
        timestamp: new Date().toISOString()
      };
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to rule engine:', apiError);
      if (options.forceLive) {
        throw apiError;
      }
      const fallbackResult = generateDemoAnalysis(rawAgreementText);
      return {
        ...fallbackResult,
        isLiveAI: false,
        fallbackReason: apiError.message || 'Switched to Demo Engine.',
        aiProvider: 'Demo Engine (Rule-based Analysis)',
        selectedJurisdiction: jurisdiction,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 3. Fallback client-side rule engine
  const demoResult = generateDemoAnalysis(rawAgreementText);
  return {
    ...demoResult,
    isLiveAI: false,
    aiProvider: 'Demo Engine (Rule-based Analysis)',
    selectedJurisdiction: jurisdiction,
    timestamp: new Date().toISOString()
  };
}

async function callPythonBackendAPI(text, state, apiKey) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/analyze';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for local check

  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      state: state,
      apiKey: apiKey || undefined
    }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return await response.json();
}

async function callGeminiAPI(text, apiKey, jurisdiction) {
  const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`;
  const jurisName = jurisdiction?.name || 'Delhi NCR';
  const jurisAct = jurisdiction?.act || 'Model Tenancy Act';

  const prompt = `Analyze the following residential rental agreement text clause by clause for jurisdiction: ${jurisName} (${jurisAct}).
Local Rental Benchmarks for ${jurisName}:
- Standard Security Deposit: ${jurisdiction?.depositNorm || '1–2 Months'}
- Notice Period Norm: ${jurisdiction?.noticeNorm || '1 Month'}
- Annual Escalation Norm: ${jurisdiction?.escalationNorm || '5%–10%'}
- Tenancy Framework: ${jurisdiction?.agreementType || 'Standard 11-Month Lease'}

Rental Agreement Text:
${text}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }]
      }
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.2
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error && errJson.error.message) {
        errorDetail = errJson.error.message;
      }
    } catch {
      // ignore JSON parse error
    }

    if (response.status === 400 || response.status === 403) {
      throw new Error(`Gemini API Error: Invalid API key or permission denied (${errorDetail})`);
    }
    if (response.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please try again in a few moments.');
    }
    throw new Error(`Gemini API Error: ${errorDetail}`);
  }

  const data = await response.json();
  const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawContent) {
    throw new Error('Received an empty response from Gemini AI.');
  }

  try {
    const parsed = JSON.parse(rawContent);
    return normalizeAIResponse(parsed);
  } catch {
    console.error('Failed to parse Gemini JSON output:', rawContent);
    throw new Error('AI response could not be parsed as structured JSON.');
  }
}

function normalizeAIResponse(parsed) {
  const rawClauses = Array.isArray(parsed.clauses) ? parsed.clauses : [];

  const clauses = rawClauses.map((c, index) => {
    let category = c.category;
    if (!ALLOWED_CATEGORIES.includes(category)) {
      category = findClosestCategory(c.clause_title || '', c.category || 'Other');
    }

    let attentionLevel = (c.attention_level || 'LOW').toUpperCase();
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(attentionLevel)) {
      attentionLevel = 'LOW';
    }

    const suggestion = c.negotiation_suggestion || 'Could we please clarify this clause in writing before signing?';

    return {
      id: index + 1,
      clause_title: c.clause_title || `Clause ${index + 1}`,
      title: c.clause_title || `Clause ${index + 1}`,
      original_text: c.original_text || 'Original text unavailable',
      originalText: c.original_text || 'Original text unavailable',
      category: category,
      simple_explanation: c.simple_explanation || 'No explanation provided.',
      simplifiedText: c.simple_explanation || 'No explanation provided.',
      attention_level: attentionLevel,
      attentionLevel: mapLevelToUiString(attentionLevel),
      reason: c.reason || 'Standard operational clause.',
      negotiation_suggestion: suggestion,
      negotiationTip: suggestion,
      suggestedQuestion: suggestion
    };
  });

  const lowCount = clauses.filter(c => c.attention_level === 'LOW').length;
  const mediumCount = clauses.filter(c => c.attention_level === 'MEDIUM').length;
  const highCount = clauses.filter(c => c.attention_level === 'HIGH').length;

  // Extract or normalize agreement_at_a_glance
  const glance = parsed.agreement_at_a_glance || {};
  const fin = glance.financial_terms || {};

  const agreementAtAGlance = {
    summary: glance.summary || parsed.summary || 'Summary of key agreement terms.',
    financial_terms: {
      rent: fin.rent || 'Not specified in the agreement.',
      security_deposit: fin.security_deposit || 'Not specified in the agreement.',
      lock_in_period: fin.lock_in_period || 'Not specified in the agreement.',
      notice_period: fin.notice_period || 'Not specified in the agreement.'
    },
    important_dates: Array.isArray(glance.important_dates) && glance.important_dates.length > 0 
      ? glance.important_dates 
      : ['Not specified in the agreement.'],
    top_attention_clauses: Array.isArray(glance.top_attention_clauses) && glance.top_attention_clauses.length > 0
      ? glance.top_attention_clauses
      : clauses.filter(c => c.attention_level === 'HIGH').map(c => c.clause_title).slice(0, 3)
  };

  return {
    summary: parsed.summary || 'Summary of the agreement clauses.',
    total_clauses_analyzed: clauses.length,
    totalClauses: clauses.length,
    low_attention: lowCount,
    standardCount: lowCount,
    medium_attention: mediumCount,
    moderateCount: mediumCount,
    high_attention: highCount,
    highAttentionCount: highCount,
    key_points: Array.isArray(parsed.key_points) ? parsed.key_points : [],
    agreement_at_a_glance: agreementAtAGlance,
    overallRating: highCount >= 3 ? 'High Caution Recommended' : (highCount > 0 || mediumCount >= 2 ? 'Moderate Attention Needed' : 'Balanced & Standard'),
    ratingColor: highCount >= 3 ? 'rose' : (highCount > 0 || mediumCount >= 2 ? 'amber' : 'emerald'),
    clauses: clauses
  };
}

function mapLevelToUiString(lvl) {
  switch (lvl) {
    case 'HIGH':
      return 'May Require Attention';
    case 'MEDIUM':
      return 'Consider Discussing';
    default:
      return 'Standard';
  }
}

function findClosestCategory(title, fallback) {
  const t = title.toLowerCase();
  if (t.includes('deposit') || t.includes('security')) return 'Security Deposit';
  if (t.includes('rent') && t.includes('increase')) return 'Rent Increase';
  if (t.includes('rent') || t.includes('payment')) return 'Rent';
  if (t.includes('entry') || t.includes('access') || t.includes('inspect')) return 'Landlord Entry';
  if (t.includes('repair') || t.includes('damage')) return 'Repairs';
  if (t.includes('maintenance')) return 'Maintenance';
  if (t.includes('terminat') || t.includes('early exit')) return 'Termination';
  if (t.includes('notice')) return 'Notice Period';
  if (t.includes('lock-in') || t.includes('lock in')) return 'Lock-in Period';
  if (t.includes('renew')) return 'Renewal';
  if (t.includes('guest') || t.includes('visitor')) return 'Guests';
  if (t.includes('pet')) return 'Pets';
  if (t.includes('sublet')) return 'Subletting';
  if (t.includes('utility') || t.includes('electric') || t.includes('water')) return 'Utilities';
  if (t.includes('late')) return 'Late Payment';
  if (t.includes('penalt') || t.includes('fine')) return 'Penalties';
  return fallback || 'Other';
}

/**
 * Intelligent Demo Engine that analyzes real text and strictly checks for present terms.
 */
export function generateDemoAnalysis(rawText) {
  const cleaned = rawText.replace(/\r\n/g, '\n').trim();
  const rawBlocks = cleaned.split(/\n\s*\n+/).filter(b => {
    const text = b.trim();
    if (text.length < 15) return false;
    // Filter title block
    if (/^(RESIDENTIAL|STANDARD|APARTMENT|COMMERCIAL)\s+(LEASE|AGREEMENT|TENANCY)/i.test(text) && !/\d+\.\s+[A-Z]/i.test(text) && text.length < 250) {
      return false;
    }
    // Filter introductory parties/preamble paragraph if non-clause
    if (/^This (Agreement|Lease) is entered into/i.test(text) && !/\d+\.\s+[A-Z]/i.test(text)) {
      return false;
    }
    return true;
  });

  // Extract explicit financial terms directly from text (no guessing)
  let extractedRent = 'Not specified in the agreement.';
  let extractedDeposit = 'Not specified in the agreement.';
  let extractedLockIn = 'Not specified in the agreement.';
  let extractedNotice = 'Not specified in the agreement.';
  const extractedDates = [];

  // Match rent
  const rentMatch = cleaned.match(/(?:rent|monthly rent|rent of)\s*(?:is|shall be|of)?\s*(\$[\d,]+(?:\.\d\d)?|\d+[\s]*(?:dollars|USD|rupees|INR|\/month))/i);
  if (rentMatch) {
    extractedRent = rentMatch[1].trim();
  }

  // Match security deposit
  const depositMatch = cleaned.match(/(?:deposit|security deposit)\s*(?:of|sum of|is)?\s*(\$[\d,]+(?:\.\d\d)?|\d+[\s]*(?:dollars|USD|rupees|INR|months? rent))/i);
  if (depositMatch) {
    extractedDeposit = depositMatch[1].trim();
  }

  // Match lock-in
  const lockMatch = cleaned.match(/(?:lock-in|lock in period|minimum term)\s*(?:of|is|shall be)?\s*(\d+\s*(?:months|years|days))/i);
  if (lockMatch) {
    extractedLockIn = lockMatch[1].trim();
  }

  // Match notice period
  const noticeMatch = cleaned.match(/(\d+\s*days?\s*(?:prior\s*)?written\s*notice|\d+\s*days?\s*notice|\d+\s*months?\s*notice)/i);
  if (noticeMatch) {
    extractedNotice = noticeMatch[1].trim();
  }

  // Match dates / durations
  const termMatch = cleaned.match(/(?:fixed term of\s*\d+\s*months|commencing on\s*[A-Z][a-z]+\s*\d{1,2},?\s*\d{4}|begins on\s*[A-Z][a-z]+\s*\d{1,2},?\s*\d{4})/gi);
  if (termMatch && termMatch.length > 0) {
    termMatch.forEach(dm => extractedDates.push(dm.trim()));
  } else {
    extractedDates.push('Not specified in the agreement.');
  }

  const clauses = rawBlocks.map((block, idx) => {
    const lines = block.trim().split('\n');
    let title = `Clause ${idx + 1}`;
    let content = block.trim();

    const firstLine = lines[0].trim();
    if (firstLine.length < 90 && (/^\d+\.?/i.test(firstLine) || /^[A-Z\s]{4,}$/.test(firstLine) || /^(Section|Clause|Article)/i.test(firstLine))) {
      title = firstLine.replace(/^(\d+\.|\bSection \d+:?|\bClause \d+:?)/i, '').trim() || `Clause ${idx + 1}`;
      content = lines.slice(1).join('\n').trim() || firstLine;
    }

    const t = (title + ' ' + content).toLowerCase();
    
    let category = 'Other';
    let attention_level = 'LOW';
    let simple_explanation = 'Defines standard baseline tenancy rules for the property.';
    let reason = 'This clause uses standard residential lease phrasing.';
    let negotiation_suggestion = 'Could we confirm all listed dates and contact details in writing?';

    if (t.includes('deposit') || t.includes('security')) {
      category = 'Security Deposit';
      if (t.includes('forfeit') || t.includes('non-refundable') || t.includes('wear and tear') || t.includes('90 days') || t.includes('60 days')) {
        attention_level = 'HIGH';
        simple_explanation = 'The landlord permits deductions for general turnover, routine painting, or normal wear, and sets a long deposit return timeline.';
        reason = 'Standard tenancy norms generally prohibit deductions for ordinary wear and tear, and return windows are customarily 14 to 30 days.';
        negotiation_suggestion = 'Could we clarify the conditions under which the security deposit will be refunded and specify a 21-day timeline?';
      } else {
        attention_level = 'LOW';
        simple_explanation = 'Specifies the security deposit amount and refund terms.';
        reason = 'Standard security deposit clause protecting both parties.';
        negotiation_suggestion = 'Could we ensure a signed move-in condition report is attached to document existing conditions?';
      }
    } else if (t.includes('enter') || t.includes('access') || t.includes('inspection')) {
      category = 'Landlord Entry';
      if (t.includes('at any time') || t.includes('without notice') || t.includes('no notice') || t.includes('arbitrary')) {
        attention_level = 'HIGH';
        simple_explanation = 'The landlord reserves the right to enter your home at any time without advance written or verbal notice.';
        reason = 'Tenants are typically entitled to quiet enjoyment. A notice requirement (usually 24 hours) is standard for non-emergency visits.';
        negotiation_suggestion = 'Would it be possible to define a reasonable notice period of at least 24 hours for non-emergency property access?';
      } else {
        attention_level = 'LOW';
        simple_explanation = 'Establishes landlord access rights with advance notification requirements.';
        reason = 'Standard landlord inspection protocol.';
        negotiation_suggestion = 'Could we confirm the preferred hours for scheduled maintenance visits?';
      }
    } else if (t.includes('repair') || t.includes('maintenance') || t.includes('plumbing') || t.includes('appliance')) {
      category = t.includes('repair') ? 'Repairs' : 'Maintenance';
      if (t.includes('solely responsible') || t.includes('pre-existing') || t.includes('$500') || t.includes('defect') || t.includes('tenant shall pay')) {
        attention_level = 'HIGH';
        simple_explanation = 'You are asked to pay repair costs for appliances or fixtures even if breakdowns are caused by age or pre-existing flaws.';
        reason = 'Habitability and major pre-existing equipment repairs are customarily the responsibility of the property owner unless caused by tenant misuse.';
        negotiation_suggestion = 'Could we clarify that the tenant is only responsible for repairs resulting from tenant negligence rather than pre-existing equipment wear?';
      } else {
        attention_level = 'LOW';
        simple_explanation = 'Outlines routine maintenance responsibilities such as light bulbs and cleaning.';
        reason = 'Standard allocation of maintenance duties.';
        negotiation_suggestion = 'Could you confirm the procedure and contact person for reporting urgent maintenance requests?';
      }
    } else if (t.includes('renew') || t.includes('automatic') || t.includes('escalat') || t.includes('increase')) {
      category = t.includes('increase') || t.includes('escalat') ? 'Rent Increase' : 'Renewal';
      if (t.includes('15%') || t.includes('20%') || t.includes('90 days') || t.includes('automatic')) {
        attention_level = 'HIGH';
        simple_explanation = 'The lease automatically locks you into another year unless cancelled 90 days ahead, and rent will increase automatically by a fixed percentage.';
        reason = 'Long advance notice windows can be easy to miss, and double-digit automatic increases may surpass local market trends.';
        negotiation_suggestion = 'Would it be possible to adjust the renewal notice window to 30 days and discuss rent adjustments upon mutual review?';
      } else {
        attention_level = 'LOW';
        simple_explanation = 'Defines lease extension and expiration terms.';
        reason = 'Standard renewal procedure.';
        negotiation_suggestion = 'Could we clarify the deadline date for notifying you of our intent to renew?';
      }
    } else if (t.includes('lock-in') || t.includes('lock in')) {
      category = 'Lock-in Period';
      attention_level = 'MEDIUM';
      simple_explanation = 'This clause indicates that the tenant may be required to remain in the property for the specified lock-in period.';
      reason = 'The agreement sets a fixed lock-in period before early departure is permitted.';
      negotiation_suggestion = 'Ask whether the lock-in period can be reduced or whether an early-exit option can be added with reasonable notice.';
    } else if (t.includes('guest') || t.includes('visitor') || t.includes('overnight')) {
      category = 'Guests';
      if (t.includes('2 consecutive') || t.includes('$100') || t.includes('penalty') || t.includes('written approval')) {
        attention_level = 'MEDIUM';
        simple_explanation = 'Strict limits on overnight visitors with fines or mandatory written landlord approval for short stays.';
        reason = 'Restricting visitors to 2 nights per month may feel unusually restrictive for normal personal visits.';
        negotiation_suggestion = 'Would it be possible to permit occasional visiting guests up to 7 consecutive days without requiring prior written approval?';
      } else {
        attention_level = 'LOW';
        simple_explanation = 'Standard occupancy policy regarding long-term guests.';
        reason = 'Reasonable terms to prevent unapproved permanent sub-tenancy.';
        negotiation_suggestion = 'Could we confirm the visitor parking policy for weekend guests?';
      }
    } else if (t.includes('terminat') || t.includes('early exit') || t.includes('break lease')) {
      category = 'Termination';
      if (t.includes('100%') || t.includes('forfeit') || t.includes('entire remaining')) {
        attention_level = 'HIGH';
        simple_explanation = 'Leaving early incurs full loss of deposit plus ongoing liability for all remaining months of rent.';
        reason = 'Requiring both total deposit forfeiture and liability for the full remaining lease can be heavily punitive.';
        negotiation_suggestion = 'Could we consider adding a standard early-lease break fee of 1-2 months rent with landlord mitigation efforts?';
      } else {
        attention_level = 'MEDIUM';
        simple_explanation = 'Outlines notice and requirements for ending the tenancy.';
        reason = 'Standard early termination rules.';
        negotiation_suggestion = 'Would it be possible to include a clause allowing subletting to a qualified replacement tenant?';
      }
    } else if (t.includes('late') || t.includes('grace period')) {
      category = 'Late Payment';
      attention_level = t.includes('10%') || t.includes('immediate') ? 'MEDIUM' : 'LOW';
      simple_explanation = 'Specifies penalties or interest if rent is paid after the monthly due date.';
      reason = 'Common commercial clause to incentivize on-time payments.';
      negotiation_suggestion = 'Could we include a standard 3 to 5 day grace period before late charges are applied?';
    } else if (t.includes('rent') || t.includes('monthly')) {
      category = 'Rent';
      attention_level = 'LOW';
      simple_explanation = 'Outlines monthly rental amount, payment method, and due date.';
      reason = 'Core commercial term of the tenancy.';
      negotiation_suggestion = 'Could we confirm the preferred digital payment method and receipt confirmation timeline?';
    }

    return {
      id: idx + 1,
      clause_title: title,
      title: title,
      original_text: content,
      originalText: content,
      category: category,
      simple_explanation: simple_explanation,
      simplifiedText: simple_explanation,
      attention_level: attention_level,
      attentionLevel: mapLevelToUiString(attention_level),
      reason: reason,
      negotiation_suggestion: negotiation_suggestion,
      negotiationTip: negotiation_suggestion,
      suggestedQuestion: negotiation_suggestion
    };
  });

  const lowCount = clauses.filter(c => c.attention_level === 'LOW').length;
  const mediumCount = clauses.filter(c => c.attention_level === 'MEDIUM').length;
  const highCount = clauses.filter(c => c.attention_level === 'HIGH').length;

  const keyPoints = [];
  if (highCount > 0) keyPoints.push(`${highCount} clause(s) may require attention before signing.`);
  if (mediumCount > 0) keyPoints.push(`${mediumCount} clause(s) recommended for clarification with the landlord.`);
  keyPoints.push('All clauses parsed and categorized into simple plain-English summaries.');

  const topAttentionTitles = clauses
    .filter(c => c.attention_level === 'HIGH' || c.attention_level === 'MEDIUM')
    .map(c => `${c.clause_title} (${c.category})`)
    .slice(0, 3);

  const agreementAtAGlance = {
    summary: `This agreement contains ${clauses.length} structured clauses covering core tenancy responsibilities. ${highCount > 0 ? `${highCount} clause(s) contain strict conditions regarding deposits, entry, or penalties that deserve discussion before signing.` : 'The contract outlines standard and balanced terms.'}`,
    financial_terms: {
      rent: extractedRent,
      security_deposit: extractedDeposit,
      lock_in_period: extractedLockIn,
      notice_period: extractedNotice
    },
    important_dates: extractedDates,
    top_attention_clauses: topAttentionTitles.length > 0 ? topAttentionTitles : ['No high attention clauses identified.']
  };

  return {
    summary: `Analyzed ${clauses.length} clauses. Identified ${highCount} high-attention term(s) and ${mediumCount} term(s) worth discussing with the property manager.`,
    total_clauses_analyzed: clauses.length,
    totalClauses: clauses.length,
    low_attention: lowCount,
    standardCount: lowCount,
    medium_attention: mediumCount,
    moderateCount: mediumCount,
    high_attention: highCount,
    highAttentionCount: highCount,
    key_points: keyPoints,
    agreement_at_a_glance: agreementAtAGlance,
    overallRating: highCount >= 3 ? 'High Caution Recommended' : (highCount > 0 || mediumCount >= 2 ? 'Moderate Attention Needed' : 'Balanced & Standard'),
    ratingColor: highCount >= 3 ? 'rose' : (highCount > 0 || mediumCount >= 2 ? 'amber' : 'emerald'),
    clauses: clauses
  };
}