import React from 'react';
import { Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-[#121D33] border-t border-[#2A3B5C]/60 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#8FA0B8]">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-[#B8C4D6]">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Legal Disclaimer:</span>
        </div>
        <p className="text-[#8FA0B8]">
          This tool provides informational assistance and is not a substitute for professional legal advice.
        </p>
      </div>
    </div>
  );
}