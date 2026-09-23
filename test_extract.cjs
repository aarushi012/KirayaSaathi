const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function testExtraction() {
  const data = new Uint8Array(fs.readFileSync('public/sample_lease.pdf'));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  console.log('PDF loaded, total pages:', pdf.numPages);
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const str = content.items.map(item => item.str).join(' ');
    fullText += str + '\n';
  }
  
  console.log('--- Extracted Text ---');
  console.log(fullText.trim());
  console.log('--- Total Length ---', fullText.trim().length);
}

testExtraction().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});