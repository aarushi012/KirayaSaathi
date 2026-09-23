import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist';

async function testExtraction() {
  const data = new Uint8Array(fs.readFileSync('public/sample_lease.pdf'));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  console.log('PDF loaded successfully! Total pages:', pdf.numPages);
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const str = content.items.map(item => item.str).join(' ');
    fullText += str + '\n';
  }
  
  console.log('--- Extracted Text ---');
  console.log(fullText.trim());
  console.log('--- Length ---', fullText.trim().length);
}

testExtraction().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});