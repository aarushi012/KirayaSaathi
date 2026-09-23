import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function FileDropzone({ onAnalyzeFile, isProcessing, externalError, onClearError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localErrorMessage, setLocalErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Sync external error
  const activeError = externalError || localErrorMessage;

  const validateFile = (file) => {
    if (!file) return false;

    if (onClearError) onClearError();

    // Check if PDF by MIME type or extension
    const isPdfMime = file.type === 'application/pdf';
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdfMime && !isPdfExt) {
      setLocalErrorMessage('Invalid file format. Please upload a valid PDF document (.pdf).');
      setSelectedFile(null);
      return false;
    }

    // Check maximum 10 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLocalErrorMessage(`File is too large (${formatFileSize(file.size)}). Maximum allowed size is 10 MB.`);
      setSelectedFile(null);
      return false;
    }

    setLocalErrorMessage('');
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setLocalErrorMessage('');
    if (onClearError) onClearError();
  };

  const handleAnalyzeClick = () => {
    if (selectedFile && !isProcessing) {
      onAnalyzeFile(selectedFile);
    }
  };

  const handleDismissError = () => {
    setLocalErrorMessage('');
    if (onClearError) onClearError();
  };

  return (
    <div className="space-y-6 [perspective:1200px]">
      {/* Error Message Display */}
      {activeError && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-3 animate-fadeIn shadow-lg shadow-rose-950/30">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Notice</p>
            <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">{activeError}</p>
          </div>
          <button
            type="button"
            onClick={handleDismissError}
            className="text-rose-400 hover:text-rose-200 p-1 rounded hover:bg-rose-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Upload / Staged File Container */}
      {!selectedFile ? (
        <div
          onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 3.5, 6)}
          onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden will-change-transform ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/15 shadow-xl shadow-indigo-500/20 scale-[1.01]'
              : 'border-[rgba(130,150,190,0.25)] hover:border-indigo-400/70 hover:bg-[#202F49]/40 bg-[#142039]/60 hover:shadow-xl hover:shadow-black/20'
          }`}
        >
          <div className="card-glare-overlay pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-20" />

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleInputChange}
            disabled={isProcessing}
          />

          <div className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
            isDragging 
              ? 'scale-110 bg-indigo-500/25 border-indigo-400 text-cyan-300' 
              : 'bg-indigo-500/15 border-indigo-500/25 text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-500/20'
          }`}>
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300" />
          </div>

          <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-1 transition-colors">
            {isDragging ? 'Drop your agreement here' : 'Upload your rental agreement'}
          </h3>
          <p className="relative z-10 text-[#8FA0B8] text-sm mb-6">
            PDF files up to 10 MB
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/25 group-hover:shadow-indigo-600/40 hover:-translate-y-[2px] active:scale-[0.97] cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
              Choose PDF
            </button>
            <span className="text-xs text-[#8FA0B8]">or drag and drop your file here</span>
          </div>
        </div>
      ) : (
        <div 
          onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 3, 4)}
          onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
          className="relative overflow-hidden bg-[#142039]/90 rounded-2xl border border-indigo-500/40 p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn transition-all duration-300 will-change-transform cursor-default"
        >
          <div className="card-glare-overlay pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-20" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1B2942] border border-[rgba(130,150,190,0.2)]">
            
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 animate-fadeIn">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-[#F8FAFC] truncate">
                    {selectedFile.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 shrink-0">
                    PDF Ready
                  </span>
                </div>
                <p className="text-xs text-[#8FA0B8] mt-0.5 flex items-center gap-2">
                  <span>Size: <strong className="text-[#E2E8F0]">{formatFileSize(selectedFile.size)}</strong></span>
                  <span>•</span>
                  <span>Validated & Ready for Clause Analysis</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isProcessing}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#142039] hover:bg-[#202F49] text-[#E2E8F0] hover:text-white text-xs font-semibold border border-[rgba(130,150,190,0.2)] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Change File
              </button>
            </div>

          </div>

          {isProcessing ? (
            <div className="p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-3 text-indigo-300 font-semibold text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Extracting text & analyzing rental clauses...</span>
              </div>
              <div className="w-full bg-[#142039] rounded-full h-2 overflow-hidden max-w-md mx-auto">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-[#8FA0B8]">
                Parsing legal terminology into plain English translations
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-[#8FA0B8] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Document verified. Click to extract text and start clause-by-clause analysis.</span>
              </div>

              <button
                type="button"
                onClick={handleAnalyzeClick}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/45 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-2 text-indigo-200 group-hover:rotate-12 transition-transform duration-200" />
                <span>Analyze Agreement</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Trust Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(130,150,190,0.15)] text-[#B8C4D6] text-sm">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="font-medium text-[#E2E8F0]">Secure document processing</span>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="font-medium text-[#E2E8F0]">Clause-by-clause analysis</span>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="font-medium text-[#E2E8F0]">Simple explanations</span>
        </div>
      </div>
    </div>
  );
}