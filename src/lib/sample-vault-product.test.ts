import { describe, expect, it } from "vitest";

import { SAMPLE_PRODUCT_SERIAL } from "@/constants/sample-claim-pack";
import {
  isSampleVaultProduct,
  sampleVaultProductCreateData,
} from "@/lib/sample-vault-product";

describe("sample vault product", () => {
  it("recognises the sample serial", () => {
    expect(isSampleVaultProduct({ serialNumber: SAMPLE_PRODUCT_SERIAL })).toBe(
      true
    );
    expect(isSampleVaultProduct({ serialNumber: "REAL-SN-1" })).toBe(false);
    expect(isSampleVaultProduct({ serialNumber: null })).toBe(false);
  });

  it("creates vault fields without document URLs", () => {
    const data = sampleVaultProductCreateData();

    expect(data.serialNumber).toBe(SAMPLE_PRODUCT_SERIAL);
    expect(data.name).toContain("television");
    expect(data.purchaseDate).toBeInstanceOf(Date);
    expect(data.warrantyExpiry).toBeInstanceOf(Date);
    expect(data.extendedExpiry).toBeInstanceOf(Date);
    expect(data.invoiceImage).toBeNull();
    expect(data.notes).toMatch(/Sample only/i);
    expect(data).not.toHaveProperty("documents");
    expect(JSON.stringify(data)).not.toMatch(/example\.invalid/);
  });
});
