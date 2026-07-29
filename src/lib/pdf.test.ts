import { describe, expect, it } from "vitest";
import { createMortgagePdf } from "./pdf";

describe("PDF export", () => {
  it("creates a valid branded PDF with the production URL", async () => {
    const blob = createMortgagePdf({
      title: "Payment plan",
      subtitle: "CAD planning estimate",
      generated: "Generated July 28, 2026",
      lines: [["Payment", "$2,950.77"]],
      disclaimer: "Planning estimate only.",
      sourceUrl: "https://mortgage.utilitas.app"
    });
    const content = new TextDecoder().decode(await blob.arrayBuffer());
    expect(blob.type).toBe("application/pdf");
    expect(content.startsWith("%PDF-1.4")).toBe(true);
    expect(content).toContain("https://mortgage.utilitas.app");
    expect(content).toContain("Mortgage Compass");
    expect(content).toContain("%%EOF");
  });
});
