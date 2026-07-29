interface PdfDocument {
  title: string;
  subtitle: string;
  generated: string;
  lines: Array<[string, string]>;
  disclaimer: string;
  sourceUrl: string;
}

function ascii(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pdfText(value: string): string {
  return ascii(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

export function createMortgagePdf(document: PdfDocument): Blob {
  const content: string[] = [
    "0.071 0.149 0.2 rg",
    "0 700 612 92 re f",
    "1 0.98 0.94 rg",
    "BT",
    "/F2 22 Tf",
    "42 748 Td",
    `(${pdfText("Mortgage Compass")}) Tj`,
    "/F1 10 Tf",
    "0 -20 Td",
    `(${pdfText(document.sourceUrl)}) Tj`,
    "ET",
    "0.071 0.149 0.2 rg",
    "BT",
    "/F2 17 Tf",
    "42 654 Td",
    `(${pdfText(document.title)}) Tj`,
    "/F1 10 Tf",
    "0 -22 Td",
    `(${pdfText(document.subtitle)}) Tj`,
    "0 -16 Td",
    `(${pdfText(document.generated)}) Tj`
  ];

  for (const [label, value] of document.lines) {
    content.push(
      "0 -34 Td",
      "/F2 11 Tf",
      `(${pdfText(label)}) Tj`,
      "210 0 Td",
      "/F1 11 Tf",
      `(${pdfText(value)}) Tj`,
      "-210 0 Td"
    );
  }

  content.push(
    "0 -50 Td",
    "/F1 9 Tf",
    `(${pdfText(document.disclaimer)}) Tj`,
    "ET",
    "0.35 0.4 0.42 rg",
    "BT",
    "/F1 8 Tf",
    "42 42 Td",
    `(${pdfText(`Source application: ${document.sourceUrl}`)}) Tj`,
    "ET"
  );

  const stream = `${content.join("\n")}\n`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
  ];

  let output = "%PDF-1.4\n";
  const offsets = [0];
  const encoder = new TextEncoder();
  objects.forEach((object, index) => {
    offsets.push(encoder.encode(output).length);
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = encoder.encode(output).length;
  output += `xref\n0 ${objects.length + 1}\n`;
  output += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new Blob([encoder.encode(output)], { type: "application/pdf" });
}
