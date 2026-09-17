import { describe, expect, it } from "vitest";

import { scanTagCopy } from "@/components/scan-field-badge";

describe("scan field tags", () => {
  it("explains a high-confidence scanned fill", () => {
    const copy = scanTagCopy({ confidence: "high", source: "qr" });
    expect(copy.label).toBe("Scanned");
    expect(copy.verify).toBe(false);
    expect(copy.meaning).toMatch(/reasonably sure/i);
    expect(copy.source).toMatch(/GST QR/i);
  });

  it("explains a verify tag when the scan is less sure", () => {
    const copy = scanTagCopy({ confidence: "medium", source: "regex" });
    expect(copy.label).toBe("Verify");
    expect(copy.verify).toBe(true);
    expect(copy.meaning).toMatch(/less sure/i);
    expect(copy.source).toMatch(/text on the document/i);
  });

  it("explains a derived warranty date", () => {
    const copy = scanTagCopy({
      confidence: "medium",
      source: "layout",
      derived: true,
    });
    expect(copy.label).toBe("Verify");
    expect(copy.meaning).toMatch(/calculated from the purchase date/i);
  });
});
