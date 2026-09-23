import * as pdfjsLib from 'pdfjs-dist';

// Use robust browser worker configuration
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
  }
}

/**
 * Custom error class with user-friendly messages
 */
export class PDFExtractionError extends Error {
  constructor(userFriendlyMessage, technicalDetails = null) {
    super(userFriendlyMessage);
    this.name = 'PDFExtractionError';
    this.userMessage = userFriendlyMessage;
    this.technicalDetails = technicalDetails;
  }
}

/**
 * Extracts structured text from a PDF file preserving paragraph and line structure.
 * @param {File | Blob | ArrayBuffer} fileInput
 * @returns {Promise<{ text: string, numPages: number, rawClauseText: string }>}
 */
export async function extractTextFromPDF(fileInput) {
  let pdf = null;

  try {
    let dataBuffer;
    if (fileInput instanceof ArrayBuffer) {
      dataBuffer = fileInput;
    } else if (fileInput && typeof fileInput.arrayBuffer === 'function') {
      dataBuffer = await fileInput.arrayBuffer();
    } else {
      throw new PDFExtractionError('Invalid file input provided for PDF processing.');
    }

    const loadingTask = pdfjsLib.getDocument({
      data: dataBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/',
    });

    pdf = await loadingTask.promise;
  } catch (err) {
    if (err.name === 'PasswordException') {
      throw new PDFExtractionError('This PDF is password-protected. Please upload an unprotected PDF.');
    }
    if (err.name === 'InvalidPDFException') {
      throw new PDFExtractionError('The file appears to be corrupted or is not a valid PDF.');
    }
    if (err instanceof PDFExtractionError) {
      throw err;
    }
    throw new PDFExtractionError(
      'Unable to open or read the PDF file. Please ensure the file is intact and try again.',
      err.message
    );
  }

  const numPages = pdf.numPages;
  if (numPages === 0) {
    throw new PDFExtractionError('The uploaded PDF contains 0 pages.');
  }

  const pageTexts = [];
  let totalCharacterCount = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const structuredPageText = processTextContent(textContent);
      const trimmed = structuredPageText.trim();
      
      if (trimmed.length > 0) {
        pageTexts.push(trimmed);
        totalCharacterCount += trimmed.replace(/\s+/g, '').length;
      }
    } catch (pageErr) {
      console.warn(`Error extracting text from page ${pageNum}:`, pageErr);
    }
  }

  // Check if no extractable text was found (scanned image PDF)
  if (totalCharacterCount < 30 || pageTexts.length === 0) {
    throw new PDFExtractionError(
      'This PDF appears to be scanned or image-based. OCR support will be added in the next version.'
    );
  }

  const fullText = pageTexts.join('\n\n');

  return {
    text: fullText,
    numPages,
    rawClauseText: fullText
  };
}

/**
 * Reconstructs layout and lines by sorting items by Y (top-down) and X (left-right).
 */
function processTextContent(textContent) {
  if (!textContent || !textContent.items || textContent.items.length === 0) {
    return '';
  }

  const items = textContent.items.filter(item => typeof item.str === 'string' && item.str.length > 0);

  if (items.length === 0) {
    return '';
  }

  items.sort((a, b) => {
    const yA = a.transform ? a.transform[5] : 0;
    const yB = b.transform ? b.transform[5] : 0;
    const xA = a.transform ? a.transform[4] : 0;
    const xB = b.transform ? b.transform[4] : 0;

    const yDiff = Math.abs(yA - yB);
    if (yDiff < 4) {
      return xA - xB;
    }
    return yB - yA;
  });

  const lines = [];
  let currentLine = [];
  let currentY = null;
  let previousY = null;
  const lineGapThreshold = 14;

  for (const item of items) {
    const itemY = item.transform ? item.transform[5] : 0;
    const str = item.str;

    if (currentY === null) {
      currentY = itemY;
      currentLine.push(str);
    } else if (Math.abs(itemY - currentY) < 4) {
      currentLine.push(str);
    } else {
      const lineStr = currentLine.join(' ').replace(/\s+/g, ' ').trim();
      if (lineStr.length > 0) {
        if (previousY !== null && Math.abs(currentY - itemY) > lineGapThreshold) {
          lines.push('');
        }
        lines.push(lineStr);
      }

      previousY = currentY;
      currentY = itemY;
      currentLine = [str];
    }
  }

  if (currentLine.length > 0) {
    const lineStr = currentLine.join(' ').replace(/\s+/g, ' ').trim();
    if (lineStr.length > 0) {
      lines.push(lineStr);
    }
  }

  return lines.join('\n');
}