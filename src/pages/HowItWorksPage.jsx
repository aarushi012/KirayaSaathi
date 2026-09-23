import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, 
  Binary, 
  AlertTriangle, 
  MessageSquareQuote, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  HelpCircle, 
  ChevronDown, 
  Zap,
  Scale
} from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';

export default function HowItWorksPage({ onTryDemo }) {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      number: '01',
      title: 'Upload Rental Agreement',
      subtitle: 'PDF extraction & OCR support',
      description: 'Upload your rental agreement PDF directly in your browser or paste contract clauses. All document parsing happens securely in memory with zero cloud file storage.',
      icon: UploadCloud,
      badgeBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      topBar: 'from-indigo-500 via-indigo-400 to-indigo-600',
      features: ['In-browser PDF parsing', 'Multi-page extraction', 'Zero permanent storage']
    },
    {
      number: '02',
      title: 'AI Reads & Categorizes Clauses',
      subtitle: 'Structured legal decomposition',
      description: 'Our AI engine breaks the legal document into structured, recognizable categories: Security Deposit, Lock-in Period, Repairs & Maintenance, Entry & Inspection, and Escalation.',
      icon: Binary,
      badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      topBar: 'from-cyan-500 via-cyan-400 to-blue-500',
      features: ['Automatic category tagging', 'Standard vs Non-standard matching', 'State law comparison']
    },
    {
      number: '03',
      title: 'Identifies Potential Concerns & Red Flags',
      subtitle: 'Unbalanced term detection',
      description: 'Terms that may unfairly burden the tenant—such as arbitrary deductions, zero-notice landlord inspections, or unfair lock-in penalties—are surfaced with severity ratings.',
      icon: AlertTriangle,
      badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      topBar: 'from-amber-500 via-amber-400 to-orange-500',
      features: ['High / Medium / Low severity tags', 'Clear reasoning why it matters', 'Model Tenancy Act cross-check']
    },
    {
      number: '04',
      title: 'Get Actionable Negotiation Scripts',
      subtitle: 'Polite tenant empowerment',
      description: 'Receive simplified plain-English explanations and respectful, copy-paste counter-proposals to discuss with your landlord or broker before putting pen to paper.',
      icon: MessageSquareQuote,
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      topBar: 'from-emerald-500 via-emerald-400 to-teal-500',
      features: ['1-Click copy messages', 'Courteous tone of voice', 'Drafted replacement clauses']
    }
  ];

  const pipelineStages = [
    { title: 'PDF Ingestion', desc: 'Client-side PDF.js extracts raw text without transmitting PDF files.', icon: FileText },
    { title: 'Jurisdiction Mapping', desc: 'Applies specific state tenancy norms (Delhi DRC Act, Karnataka RERA, Maharashtra Rent Control).', icon: Scale },
    { title: 'Gemini AI Intelligence', desc: 'Analyzes clauses against legal guidelines, identifying risks and plain-language summaries.', icon: Cpu },
    { title: 'Tenant Insights', desc: 'Produces a tenant friendliness score, red flag list, and WhatsApp-ready counter-proposals.', icon: Sparkles }
  ];

  const faqs = [
    {
      q: 'Does KirayaSaathi upload or store my agreement on external servers?',
      a: 'No. Document parsing is handled locally in your browser using PDF.js. Only the extracted text is processed for analysis, ensuring maximum privacy and zero permanent storage of your personal documents.'
    },
    {
      q: 'Which Indian states and rental laws are supported?',
      a: 'KirayaSaathi includes knowledge base rules for Delhi (Delhi Rent Control Act / MTA), Karnataka / Bangalore, Maharashtra / Pune (Maharashtra Rent Control Act), Haryana / Gurgaon, and Punjab & Chandigarh, as well as the national Model Tenancy Act (MTA).'
    },
    {
      q: 'Can I use this for non-residential or commercial leases?',
      a: 'KirayaSaathi is primarily optimized for residential rental and lease agreements (11-month agreements, standard residential tenancy contracts). It effectively parses commercial leases for basic terms, but recommendations are calibrated for tenants.'
    },
    {
      q: 'Is the output legal advice?',
      a: 'KirayaSaathi is an educational and negotiation empowerment tool designed to help you understand your agreement. It provides legal awareness and informational insights, but does not replace formal legal counsel.'
    }
  ];

  return (
    <div className="py-12 md:py-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Process & Technology Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
            How <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">KirayaSaathi</span> Works
          </h1>

          <p className="mt-4 text-[#B8C4D6] text-base sm:text-lg leading-relaxed">
            From complicated 15-page legal paperwork to complete contract clarity and polite negotiation points in under 30 seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Start Analyzing Now</span>
            </Link>

            <button
              type="button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Try Instant Demo</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Step Cards */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 6, 8)}
                  onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
                  className="relative bg-gradient-to-b from-[#1B2942] via-[#1B2942]/90 to-[#142039] rounded-2xl p-6 sm:p-7 border border-[rgba(130,150,190,0.22)] hover:border-[rgba(130,150,190,0.45)] flex flex-col justify-between group shadow-xl shadow-black/20 overflow-hidden cursor-default transition-all duration-300 hover:shadow-indigo-500/10"
                >
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${step.topBar} opacity-75 group-hover:opacity-100 transition-opacity`} />
                  
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 p-3 rounded-xl border flex items-center justify-center ${step.badgeBg} shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#142039] border border-[rgba(130,150,190,0.2)] text-[#B8C4D6]">
                        <span className="text-[#8FA0B8] text-[10px]">STEP</span>
                        <span>{step.number}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#F8FAFC] mb-1 group-hover:text-indigo-200 transition-colors">
                      {step.title}
                    </h3>
                    <div className="text-xs font-semibold text-cyan-400 mb-3">
                      {step.subtitle}
                    </div>
                    <p className="text-[#B8C4D6] text-xs sm:text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[rgba(130,150,190,0.15)]">
                      {step.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-[#E2E8F0]">
                          <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[rgba(130,150,190,0.12)] flex items-center justify-between text-xs text-[#8FA0B8]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      Automated & Verified
                    </span>
                    {idx < 3 && <ArrowRight className="w-4 h-4 text-indigo-400 hidden lg:block" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline / Architecture Diagram */}
        <div className="mb-24 p-8 sm:p-10 rounded-3xl bg-[#1B2942]/80 border border-[rgba(130,150,190,0.22)] shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Under The Hood: AI Pipeline
            </h2>
            <p className="text-sm text-[#B8C4D6] mt-2">
              How KirayaSaathi processes complex legal language into tenant-friendly insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineStages.map((stage, sIdx) => {
              const Icon = stage.icon;
              return (
                <div key={sIdx} className="p-5 rounded-2xl bg-[#142039]/90 border border-[rgba(130,150,190,0.18)] relative flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-mono font-bold text-indigo-400 mb-1">STAGE {sIdx + 1}</div>
                    <h4 className="text-base font-bold text-[#F8FAFC] mb-2">{stage.title}</h4>
                    <p className="text-xs text-[#B8C4D6] leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div 
                  key={fIdx}
                  className="rounded-2xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.2)] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#202F49] transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#F8FAFC]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#B8C4D6] leading-relaxed border-t border-[rgba(130,150,190,0.12)] bg-[#142039]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-[#1B2942] to-cyan-900/60 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-3">
            Ready to review your rental agreement?
          </h3>
          <p className="text-sm text-[#B8C4D6] max-w-xl mx-auto mb-6">
            Get instant clause breakdown, safety score, and negotiation scripts in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyze My Agreement</span>
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#142039] hover:bg-[#202F49] border border-[rgba(130,150,190,0.25)] text-[#E2E8F0] font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
