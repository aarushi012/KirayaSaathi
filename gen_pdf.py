import os

os.makedirs('public', exist_ok=True)
pdf_content = b'''%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 215 >>
stream
BT
/F1 12 Tf
72 700 Td
(RESIDENTIAL LEASE AGREEMENT) Tj
0 -24 Td
(1. SECURITY DEPOSIT: Tenant deposits 2500 dollars. Deductions for normal wear and tear permitted.) Tj
0 -24 Td
(2. ENTRY: Landlord may enter at any time without notice for inspection.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000502 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
573
%%EOF'''

with open('public/sample_lease.pdf', 'wb') as f:
    f.write(pdf_content)
print('Generated public/sample_lease.pdf')