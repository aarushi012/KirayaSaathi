import React from 'react';
import { Link } from 'react-router-dom';
import ResultsDashboard from '../components/ResultsDashboard';
import { FileSearch, UploadCloud, Zap, ArrowRight } from 'lucide-react';

export default function ResultsPage({
  analysisResult,
  rawExtractedText,
  onBackToUpload,
  onOpenNegotiationModal,
  onOpenKeyModal,
  onTryDemo,
  selectedStateId,
  onSelectState
}) {
  if (analysisResult) {
    return (
      <div className="py-6 sm:py-10 animate-fadeIn">
        <ResultsDashboard
          analysisData={analysisResult}
          rawExtractedText={rawExtractedText}
          onBackToUpload={onBackToUpload}
          onOpenNegotiationModal={onOpenNegotiationModal}
          onOpenKeyModal={onOpenKeyModal}
          onTryDemo={onTryDemo}
          selectedStateId={selectedStateId}
          onSelectState={onSelectState}
        />
      </div>
    );
  }

  return (
    <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-5">
          <FileSearch className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-3">
          No Agreement Analyzed Yet
        </h2>
        <p className="text-sm text-[#B8C4D6] max-w-md mx-auto mb-8">
          Upload your rental agreement PDF or run our 1-click instant demo to generate a comprehensive AI clause breakdown.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Agreement</span>
          </Link>
          <button
            type="button"
            onClick={onTryDemo}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Try Demo Agreement</span>
          </button>
        </div>
      </div>
    </div>
  );
}
