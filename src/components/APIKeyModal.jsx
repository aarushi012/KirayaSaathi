import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Bot, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { getActiveApiKey, saveCustomApiKey } from '../services/aiService';

export default function APIKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [keyInput, setKeyInput] = useState(() => getActiveApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [testingStatus, setTestingStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasEnvKey = Boolean(envKey && envKey.trim().length > 5);

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      saveCustomApiKey('');
      setTestingStatus('success');
      setStatusMessage('Switched to Demo Engine mode.');
      if (onKeyUpdated) onKeyUpdated();
      setTimeout(() => onClose(), 800);
      return;
    }

    setTestingStatus('testing');
    setStatusMessage('Testing connection to Gemini 1.5 Flash...');

    try {
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(keyInput.trim())}`;
      const res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK' }] }]
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Invalid API Key or Quota Exceeded`);
      }

      saveCustomApiKey(keyInput.trim());
      setTestingStatus('success');
      setStatusMessage('Connected successfully to Google Gemini 1.5 Flash!');
      if (onKeyUpdated) onKeyUpdated();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setTestingStatus('error');
      setStatusMessage(err.message || 'Failed to connect to Gemini API. Please check your key.');
    }
  };

  const handleResetToDemo = () => {
    saveCustomApiKey('');
    setKeyInput('');
    setTestingStatus('success');
    setStatusMessage('Switched to Demo Engine mode.');
    if (onKeyUpdated) onKeyUpdated();
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1B2942] border border-[#2A3B5C] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2A3B5C]/60 flex items-center justify-between bg-[#142039]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/15 rounded-lg text-indigo-400 border border-indigo-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">AI Engine Configuration</h3>
              <p className="text-xs text-[#8FA0B8]">Configure Live Google Gemini or use Demo Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8FA0B8] hover:text-[#F8FAFC] hover:bg-[#202F49] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleTestAndSave} className="p-6 space-y-5">
          
          {/* Status Badge */}
          <div className="p-3.5 rounded-xl bg-[#142039] border border-[#2A3B5C]/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {getActiveApiKey() ? (
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
              ) : (
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 ring-4 ring-amber-500/20" />
              )}
              <span className="text-xs font-semibold text-[#F8FAFC]">
                {getActiveApiKey() ? 'Live Gemini AI Active' : 'Demo Rule Engine Active'}
              </span>
            </div>
            <span className="text-[11px] text-[#8FA0B8]">
              {hasEnvKey ? 'Loaded from .env' : 'Configurable'}
            </span>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#B8C4D6]">
              Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#142039] border border-[#2A3B5C] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#8FA0B8] focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#8FA0B8] hover:text-[#F8FAFC]"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[11px] text-[#8FA0B8] flex items-center gap-1 pt-1">
              <span>Need a key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-0.5"
              >
                Get free Gemini API Key <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </p>
          </div>

          {/* Test Status Feedback */}
          {statusMessage && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
              testingStatus === 'success' 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                : testingStatus === 'error'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
            }`}>
              {testingStatus === 'testing' && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
              {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {testingStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2A3B5C]/60">
            <button
              type="button"
              onClick={handleResetToDemo}
              className="text-xs text-[#8FA0B8] hover:text-[#F8FAFC]"
            >
              Use Demo Engine
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#202F49] hover:bg-[#283B5E] text-xs font-semibold text-[#B8C4D6] transition-colors border border-[#2A3B5C]/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={testingStatus === 'testing'}
                className="inline-flex items-center px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors disabled:opacity-50"
              >
                {testingStatus === 'testing' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Save & Test
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}