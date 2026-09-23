import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ShieldAlert, 
  MessagesSquare, 
  FileCheck2, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Lock, 
  Eye, 
  Scale,
  UploadCloud
} from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';

export default function FeaturesPage({ onTryDemo }) {
  const [activeTab, setActiveTab] = useState('plain-english');
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const comparisonRows = [
    { feature: 'Clause-by-clause decomposition', traditional: 'Manual reading & guessing', kiraya: 'Automated AI categorization in 30s' },
    { feature: 'Plain-language translation', traditional: 'Complex legalese confusion', kiraya: 'Simple English summaries for every clause' },
    { feature: 'Hidden unfair term detection', traditional: 'Easily missed in fine print', kiraya: 'Color-coded High / Medium / Low severity tags' },
    { feature: 'Ready-made negotiation scripts', traditional: 'Uncomfortable asking or drafting', kiraya: 'Polite, respectful WhatsApp-ready questions' },
    { feature: 'State tenancy law cross-check', traditional: 'Requires hiring a legal advisor', kiraya: 'Built-in knowledge base (Delhi, MH, KA, HR, PB)' },
    { feature: 'Document Privacy', traditional: 'Sent to third-party brokers/lawyers', kiraya: 'In-browser PDF parsing with zero file storage' }
  ];

  const states = [
    { name: 'Delhi NCR', act: 'Delhi Rent Control Act & MTA', depositRule: 'Typically 1-2 months max under MTA', keyRisk: 'High non-refundable painting charges' },
    { name: 'Bangalore (KA)', act: 'Karnataka Rent Control Act', depositRule: 'Common demand 5-10 months; legal MTA push is 2 months', keyRisk: 'Exorbitant lock-in & painting deductions' },
    { name: 'Pune / Mumbai (MH)', act: 'Maharashtra Rent Control Act', depositRule: 'Strict Leave & License registration rules', keyRisk: 'Unilateral licensee termination clauses' },
    { name: 'Gurgaon / Haryana', act: 'Haryana Urban Rent Control Act', depositRule: 'Maintenance charges conflated with base rent', keyRisk: 'Electricity & diesel generator markup terms' },
    { name: 'Punjab & Chandigarh', act: 'East Punjab Urban Rent Restriction Act', depositRule: 'Fair rent determination provisions', keyRisk: 'Arbitrary annual 10%+ rent escalations' }
  ];

  return (
    <div className="py-12 md:py-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cutting-Edge AI Features</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
            Designed to Protect <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Renters</span>
          </h1>

          <p className="mt-4 text-[#B8C4D6] text-base sm:text-lg leading-relaxed">
            Discover all the intelligent tools KirayaSaathi uses to simplify legal terms, highlight risks, and balance rental power dynamics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>Analyze Agreement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Launch Demo</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24 [perspective:1200px]">
          
          {/* Feature 1 */}
          <div 
            onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 5, 8)}
            onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
            className="p-7 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1B2942] to-[#142039] border border-[rgba(130,150,190,0.22)] hover:border-indigo-500/40 transition-all shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400" />
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                Plain English
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Clause Explanation & Translation</h3>
            <p className="text-xs sm:text-sm text-[#B8C4D6] leading-relaxed mb-5">
              Translates dense legal jargon, indemnification conditions, and multi-line covenants into clear sentences you can understand instantly.
            </p>
            <div className="p-4 rounded-xl bg-[#142039] border border-[rgba(130,150,190,0.2)] space-y-2 text-xs font-mono">
              <div className="text-[11px] text-[#8FA0B8] flex justify-between">
                <span>CONTRACT CLAUSE:</span>
                <span className="text-rose-400">Dense Legalese</span>
              </div>
              <div className="text-slate-400 line-through text-[11px]">
                "The Tenant agrees to indemnify and hold harmless the Lessor against all wear, tear, or structural deterioration arising howsoever..."
              </div>
              <div className="text-teal-300 font-sans text-xs bg-teal-950/40 p-2.5 rounded-lg border border-teal-500/30">
                💡 <strong>KirayaSaathi Summary:</strong> You are not responsible for natural wear and tear or pre-existing building issues.
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 5, 8)}
            onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
            className="p-7 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1B2942] to-[#142039] border border-[rgba(130,150,190,0.22)] hover:border-amber-500/40 transition-all shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Red Flag Detection
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Unfair Clause & Risk Categorization</h3>
            <p className="text-xs sm:text-sm text-[#B8C4D6] leading-relaxed mb-5">
              Identifies heavily one-sided terms such as unannounced landlord entry, 100% deposit forfeiture, or extreme interest penalties on minor delays.
            </p>
            <div className="p-4 rounded-xl bg-[#142039] border border-[rgba(130,150,190,0.2)] space-y-2">
              <div className="text-[11px] text-[#8FA0B8] font-semibold">AUTOMATIC SEVERITY SCORING</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200">
                  <span>🚨 Landlord 0-hour unannounced entry</span>
                  <span className="font-bold text-rose-400">High Risk</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                  <span>⚠️ 1-month rent deduction for painting</span>
                  <span className="font-bold text-amber-400">Medium Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 5, 8)}
            onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
            className="p-7 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1B2942] to-[#142039] border border-[rgba(130,150,190,0.22)] hover:border-teal-500/40 transition-all shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 to-indigo-500" />
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <MessagesSquare className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/25">
                Negotiation Assistant
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Courteous Counter-Proposal Scripts</h3>
            <p className="text-xs sm:text-sm text-[#B8C4D6] leading-relaxed mb-5">
              Drafts respectful, polite questions and counter-clauses you can copy and message directly to the landlord or broker via WhatsApp or Email.
            </p>
            <div className="p-4 rounded-xl bg-[#142039] border border-[rgba(130,150,190,0.2)]">
              <div className="flex items-center justify-between text-[11px] text-[#8FA0B8] mb-2">
                <span>COPY-READY WHATSAPP MESSAGE</span>
                <button
                  type="button"
                  onClick={() => handleCopy('Hi Sir/Ma\'am, regarding clause 6, could we include a standard 24-hour advance notice before property viewings as per tenancy best practices?')}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/30 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <p className="text-xs text-cyan-200 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/30 italic">
                "Hi Sir/Ma'am, regarding clause 6, could we include a standard 24-hour advance notice before property viewings as per tenancy best practices?"
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div 
            onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 5, 8)}
            onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
            className="p-7 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1B2942] to-[#142039] border border-[rgba(130,150,190,0.22)] hover:border-cyan-500/40 transition-all shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                Holistic Score
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Tenant Friendliness Safety Score</h3>
            <p className="text-xs sm:text-sm text-[#B8C4D6] leading-relaxed mb-5">
              Calculates an overall 0-100 agreement safety index by weighing deposit conditions, lock-in fairness, maintenance splits, and notice rules.
            </p>
            <div className="p-4 rounded-xl bg-[#142039] border border-[rgba(130,150,190,0.2)] space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#F8FAFC]">Lease Health Index</span>
                <span className="text-emerald-400">82 / 100 Balanced</span>
              </div>
              <div className="w-full bg-[#1B2942] rounded-full h-2.5 overflow-hidden flex border border-[rgba(130,150,190,0.2)]">
                <div className="bg-emerald-400 h-full w-[75%]" />
                <div className="bg-amber-400 h-full w-[15%]" />
                <div className="bg-rose-400 h-full w-[10%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#8FA0B8]">
                <span>✅ 6 Fair Clauses</span>
                <span>⚠️ 2 Require Discussion</span>
                <span>🔴 1 High Concern</span>
              </div>
            </div>
          </div>

        </div>

        {/* State-Specific Legal Intelligence Section */}
        <div className="mb-24 p-8 sm:p-10 rounded-3xl bg-[#1B2942]/80 border border-[rgba(130,150,190,0.22)] shadow-2xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Multi-Jurisdiction Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              State-Specific Indian Tenancy Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[#B8C4D6] mt-2">
              Rental customs and legal frameworks vary widely between Indian metropolitan hubs. KirayaSaathi adapts its evaluation based on your city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {states.map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#142039]/90 border border-[rgba(130,150,190,0.2)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm sm:text-base text-[#F8FAFC]">{st.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {st.act.split('&')[0]}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-300 font-medium mb-2">
                    💰 Deposit Norm: {st.depositRule}
                  </div>
                  <div className="text-xs text-[#B8C4D6]">
                    ⚠️ <strong className="text-[#E2E8F0]">Common Issue:</strong> {st.keyRisk}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table: Manual Review vs KirayaSaathi */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Why KirayaSaathi is 10x Better
            </h2>
            <p className="text-xs sm:text-sm text-[#B8C4D6] mt-2">
              See how AI-powered clause analysis compares against traditional agreement signing.
            </p>
          </div>

          <div className="rounded-2xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#142039] border-b border-[rgba(130,150,190,0.2)] text-[#8FA0B8] uppercase text-[11px] tracking-wider">
                    <th className="p-4 sm:p-5">Capability</th>
                    <th className="p-4 sm:p-5 text-slate-400">Traditional Signing</th>
                    <th className="p-4 sm:p-5 text-indigo-300 bg-indigo-950/30">KirayaSaathi AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(130,150,190,0.12)]">
                  {comparisonRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#202F49]/40 transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#F8FAFC]">{row.feature}</td>
                      <td className="p-4 sm:p-5 text-[#8FA0B8] flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{row.traditional}</span>
                      </td>
                      <td className="p-4 sm:p-5 text-emerald-200 bg-indigo-950/20 font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{row.kiraya}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-[#1B2942] to-cyan-900/60 border border-indigo-500/30 text-center shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-3">
            Never sign an unbalanced lease again.
          </h3>
          <p className="text-sm text-[#B8C4D6] max-w-xl mx-auto mb-6">
            Upload your agreement PDF or try the demo to experience intelligent contract protection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyze Agreement</span>
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#142039] hover:bg-[#202F49] border border-[rgba(130,150,190,0.25)] text-[#E2E8F0] font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
