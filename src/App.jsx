import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import HowItWorks from './components/HowItWorks';
import FeaturesSection from './components/FeaturesSection';
import ResultsDashboard from './components/ResultsDashboard';
import DisclaimerBanner from './components/DisclaimerBanner';
import NegotiationSummaryModal from './components/NegotiationSummaryModal';
import APIKeyModal from './components/APIKeyModal';
import AIAnalysisLoadingScreen from './components/AIAnalysisLoadingScreen';
import DemoLaunchModal from './components/DemoLaunchModal';
import DemoEngineStatusModal from './components/DemoEngineStatusModal';
import AboutSection from './components/AboutSection';
import VideoBackground from './components/VideoBackground';
import { extractTextFromPDF } from './utils/pdfExtractor';
import { analyzeAgreementWithAI } from './services/aiService';
import { BUNDLED_DEMO_AGREEMENT_TEXT, PREDEFINED_DEMO_ANALYSIS } from './data/sampleAgreements';
import { getJurisdictionById, DEFAULT_STATE_ID } from './data/jurisdictions';
import { playSectionAnimation } from './utils/animationManager';
import { Scale } from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stagedResult, setStagedResult] = useState(null);
  const [analyzingFileMeta, setAnalyzingFileMeta] = useState({ name: 'rental_agreement.pdf', size: null });
  const [extractedRawText, setExtractedRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedStateId, setSelectedStateId] = useState(DEFAULT_STATE_ID);
  const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Instant 60-second Hackathon Demo Handler
  const handleTryDemo = () => {
    setIsProcessing(true);
    setUploadError('');
    setStagedResult(null);
    setAnalyzingFileMeta({
      name: 'sample_residential_lease.pdf',
      size: '24.5 KB'
    });

    const jurisdiction = getJurisdictionById(selectedStateId);

    setTimeout(() => {
      setExtractedRawText(BUNDLED_DEMO_AGREEMENT_TEXT);
      setStagedResult({
        ...PREDEFINED_DEMO_ANALYSIS,
        selectedJurisdiction: jurisdiction,
        timestamp: new Date().toISOString()
      });
    }, 900);
  };

  const handleFileSelected = async (file) => {
    setIsProcessing(true);
    setUploadError('');
    setStagedResult(null);
    setAnalyzingFileMeta({
      name: file.name,
      size: formatFileSize(file.size)
    });

    try {
      const extractionResult = await extractTextFromPDF(file);
      const rawText = extractionResult.text;
      setExtractedRawText(rawText);

      const result = await analyzeAgreementWithAI(rawText, { selectedState: selectedStateId });
      result.title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Rental Agreement';
      result.numPages = extractionResult.numPages;

      setStagedResult(result);
    } catch (err) {
      console.warn('Analysis failed:', err);
      const message = err.userMessage || err.message || 'We could not analyze this PDF. Please try another document.';
      setUploadError(message);
    }
  };

  const handleSampleSelected = async (sample) => {
    setIsProcessing(true);
    setUploadError('');
    setStagedResult(null);
    setAnalyzingFileMeta({
      name: `${sample.name}.pdf`,
      size: '18.4 KB'
    });

    try {
      setExtractedRawText(sample.text);
      if (sample.predefinedResult) {
        const jurisdiction = getJurisdictionById(selectedStateId);
        setTimeout(() => {
          setStagedResult({
            ...sample.predefinedResult,
            selectedJurisdiction: jurisdiction,
            title: sample.name,
            timestamp: new Date().toISOString()
          });
        }, 800);
      } else {
        const result = await analyzeAgreementWithAI(sample.text, { selectedState: selectedStateId });
        result.title = sample.name;
        setStagedResult(result);
      }
    } catch (err) {
      console.warn('Sample analysis failed:', err);
      setUploadError(err.message || 'Error analyzing sample agreement.');
    }
  };

  const handleTextSubmit = async (text) => {
    setIsProcessing(true);
    setUploadError('');
    setStagedResult(null);
    setAnalyzingFileMeta({
      name: 'pasted_agreement_text.txt',
      size: `${(new Blob([text]).size / 1024).toFixed(1)} KB`
    });

    try {
      setExtractedRawText(text);
      const result = await analyzeAgreementWithAI(text, { selectedState: selectedStateId });
      setStagedResult(result);
    } catch (err) {
      console.warn('Text analysis failed:', err);
      setUploadError(err.message || 'Error analyzing text.');
    }
  };

  const handleViewAnalysisResults = () => {
    if (stagedResult) {
      setAnalysisResult(stagedResult);
      setIsProcessing(false);
      setStagedResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setStagedResult(null);
    setIsProcessing(false);
    setUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    if (analysisResult) {
      setAnalysisResult(null);
    }
    setTimeout(() => {
      playSectionAnimation(id);
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121D33] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Global Full-Screen Cinematic Video Background */}
      <VideoBackground />

      {/* Header */}
      <Header
        onAnalyzeClick={() => scrollToSection('analyze')}
        onReset={handleReset}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onTryDemo={handleTryDemo}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {analysisResult ? (
          /* Dedicated AI Results Dashboard */
          <ResultsDashboard
            analysisData={analysisResult}
            rawExtractedText={extractedRawText}
            onBackToUpload={handleReset}
            onOpenNegotiationModal={() => setIsNegotiationModalOpen(true)}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
            onTryDemo={handleTryDemo}
            selectedStateId={selectedStateId}
            onSelectState={setSelectedStateId}
          />
        ) : (
          /* Landing & Upload Flow */
          <>
            <HeroSection
              onAnalyzeClick={() => scrollToSection('analyze')}
              onHowItWorksClick={() => scrollToSection('how-it-works')}
              onTryDemo={() => setIsDemoModalOpen(true)}
            />

            <UploadSection
              onFileSelected={handleFileSelected}
              onSampleSelected={handleSampleSelected}
              onTextSubmit={handleTextSubmit}
              onTryDemo={() => setIsDemoModalOpen(true)}
              isProcessing={isProcessing}
              externalError={uploadError}
              onClearError={() => setUploadError('')}
              selectedStateId={selectedStateId}
              onSelectState={setSelectedStateId}
            />

            <HowItWorks />

            <FeaturesSection />

            {/* About / Mission Section */}
            <AboutSection />
          </>
        )}
      </main>

      {/* Persistent Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Footer */}
      <footer className="bg-[#142039]/85 backdrop-blur-md py-8 border-t border-[rgba(130,150,190,0.15)] text-xs text-[#8FA0B8] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-[#F8FAFC]">KirayaSaathi</span>
            <span className="text-[#8FA0B8]">• College Hackathon MVP</span>
          </div>
          <div className="flex items-center gap-4 text-[#B8C4D6]">
            <span>Private & In-Browser</span>
            <span>•</span>
            <span>Tenant Empowerment Project</span>
          </div>
        </div>
      </footer>

      {/* Intermediate AI Analysis Pipeline Loading Experience */}
      {isProcessing && (
        <AIAnalysisLoadingScreen
          fileName={analyzingFileMeta.name}
          fileSize={analyzingFileMeta.size}
          isProcessing={isProcessing}
          error={uploadError}
          rawResult={stagedResult}
          onViewResults={handleViewAnalysisResults}
          onRetry={handleReset}
          onTryDemo={handleTryDemo}
        />
      )}

      {/* Demo Launch Modal */}
      <DemoLaunchModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDemo={handleTryDemo}
      />

      {/* Demo Engine Status Modal */}
      <DemoEngineStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onRunDemo={handleTryDemo}
      />

      {/* Negotiation Summary Modal */}
      <NegotiationSummaryModal
        analysisData={analysisResult}
        isOpen={isNegotiationModalOpen}
        onClose={() => setIsNegotiationModalOpen(false)}
      />

      {/* API Key / Engine Config Modal */}
      <APIKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeyUpdated={() => {
          // Re-trigger update if needed
        }}
      />

    </div>
  );
}