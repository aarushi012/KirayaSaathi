import React from 'react';
import UploadSection from '../components/UploadSection';

export default function AnalyzePage({
  onFileSelected,
  onSampleSelected,
  onTextSubmit,
  onTryDemo,
  isProcessing,
  uploadError,
  onClearError,
  selectedStateId,
  onSelectState
}) {
  return (
    <div className="py-6 sm:py-10 animate-fadeIn">
      <UploadSection
        onFileSelected={onFileSelected}
        onSampleSelected={onSampleSelected}
        onTextSubmit={onTextSubmit}
        onTryDemo={onTryDemo}
        isProcessing={isProcessing}
        externalError={uploadError}
        onClearError={onClearError}
        selectedStateId={selectedStateId}
        onSelectState={onSelectState}
      />
    </div>
  );
}
