import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { extractFieldsFromText } from "@/lib/document-extract/field-extractors";

function loadInvoice(name: string) {
  return readFileSync(
    path.join(import.meta.dirname, "__fixtures__/marketplace", name),
    "utf8"
  );
}

describe("Amazon / Flipkart invoice training samples", () => {
  it("extracts Flipkart boAt Airdopes, not the platform-fee page", () => {
    const fields = extractFieldsFromText(loadInvoice("OD435754318223434200.txt"));

    expect(fields.retailer).toBe("Flipkart");
    expect(fields.purchaseDate).toBe("2025-10-17");
    expect(fields.purchaseAmount).toBe("1079");
    expect(fields.warrantyPeriod).toBe(12);
    expect(fields.brand.toLowerCase()).toMatch(/boat/);
    expect(fields.name.toLowerCase()).toMatch(/airdopes|boat/);
    expect(fields.sellerGstin).toBe("27AAECB1611P1ZN");
    expect(fields.invoiceNumber).toMatch(/OD435754318223434200|FAUS652601566864/);
    expect(fields.category).toBe("tv_audio");
  });

  it("extracts Flipkart Beardo trimmer instead of grocery/fee lines", () => {
    const fields = extractFieldsFromText(loadInvoice("OD436077107977816200.txt"));

    expect(fields.purchaseDate).toBe("2025-11-23");
    expect(fields.purchaseAmount).toBe("799");
    expect(fields.warrantyPeriod).toBe(12);
    expect(fields.brand).toBe("Beardo");
    expect(fields.name.toLowerCase()).toMatch(/beardo|ape/);
    expect(fields.sellerGstin).toBe("27AAXCS0655F1ZY");
    expect(fields.name.toLowerCase()).not.toMatch(/onion|convenience fee/);
  });

  it("extracts Flipkart GOBOULT smartwatch", () => {
    const fields = extractFieldsFromText(loadInvoice("OD436457178592200200.txt"));

    expect(fields.purchaseDate).toBe("2026-01-06");
    expect(fields.purchaseAmount).toBe("1899");
    expect(fields.warrantyPeriod).toBe(12);
    expect(fields.brand).toBe("GOBOULT");
    expect(fields.name.toLowerCase()).toMatch(/goboult|crown/);
    expect(fields.category).toBe("wearables");
    expect(fields.sellerGstin).toBe("27AAECS1679J1ZY");
  });

  it("extracts Flipkart realme buds, serial, and 1-year warranty", () => {
    const fields = extractFieldsFromText(loadInvoice("OD437023259438962200.txt"));

    expect(fields.purchaseDate).toBe("2026-03-13");
    expect(fields.purchaseAmount).toBe("1999");
    expect(fields.warrantyPeriod).toBe(12);
    expect(fields.brand).toBe("Realme");
    expect(fields.name.toLowerCase()).toMatch(/realme|buds/);
    expect(fields.serialNumber).toBe("25121992230300");
    expect(fields.sellerGstin).toBe("27AAJCM4219P1ZX");
  });

  it("extracts Flipkart Van Heusen watch warranty wrapped across lines", () => {
    const fields = extractFieldsFromText(loadInvoice("OD437699071925727500.txt"));

    expect(fields.purchaseDate).toBe("2026-05-30");
    expect(fields.purchaseAmount).toBe("1199");
    expect(fields.warrantyPeriod).toBe(12);
    expect(fields.brand).toBe("Van Heusen");
    expect(fields.name.toLowerCase()).toMatch(/van heusen|watch/);
    expect(fields.sellerGstin).toBe("27AAACX2827R1ZP");
  });

  it("extracts Flipkart Red Tape clogs and IMEI/SrNo from the goods invoice", () => {
    const fields = extractFieldsFromText(loadInvoice("OD438320798656055100.txt"));

    expect(fields.retailer).toBe("Flipkart");
    expect(fields.purchaseAmount).toBe("356");
    expect(fields.brand).toBe("Red Tape");
    expect(fields.name.toLowerCase()).toMatch(/red tape|clogs/);
    expect(fields.serialNumber).toBe("B26A2111405");
    expect(fields.sellerGstin).toBe("09AALCR5032R1ZN");
    expect(fields.purchaseDate).toMatch(/^2026-08-(10|11|18)$/);
    expect(fields.invoiceNumber).toMatch(
      /OD438320798656055100|LWAAAA9270966486|LWAAAA9270903883/
    );
  });

  it("extracts Amazon PUMA sneakers, not the COD-fee page", () => {
    const fields = extractFieldsFromText(loadInvoice("invoice_shoe.txt"));

    expect(fields.retailer).toBe("Amazon");
    expect(fields.purchaseAmount).toBe("1599");
    expect(fields.brand).toBe("Puma");
    expect(fields.name.toLowerCase()).toMatch(/puma|melanite|sneakers/);
    expect(fields.purchaseDate).toMatch(/^2026-08-(11|17)$/);
    expect(fields.invoiceNumber).toMatch(/404-1063669-6819555|CCX1-1804475/);
    expect(fields.sellerGstin).toBe("19AAJCC8517E1ZI");
    expect(fields.name.toLowerCase()).not.toMatch(/pay on delivery|cod/);
  });
});
