import { describe, expect, it } from "vitest";

import {
  findDuplicateOfProduct,
  findDuplicateProductIds,
  productDuplicateFingerprint,
} from "@/lib/product-duplicates";

describe("productDuplicateFingerprint", () => {
  it("matches when core fields are the same", () => {
    const a = {
      name: "Smartwatch",
      brand: "GOBOULT",
      serialNumber: "ABC",
      invoiceNumber: "INV-9",
      purchaseDate: new Date("2026-01-01"),
      warrantyExpiry: new Date("2027-01-01"),
    };
    const b = {
      ...a,
      name: "  smartwatch ",
      brand: "goboult",
    };

    expect(productDuplicateFingerprint(a)).toBe(productDuplicateFingerprint(b));
  });
});

describe("findDuplicateProductIds", () => {
  it("returns every id in a duplicate group", () => {
    const ids = findDuplicateProductIds([
      {
        id: "1",
        name: "TV",
        brand: "LG",
        purchaseDate: null,
        warrantyExpiry: null,
        extendedExpiry: null,
      },
      {
        id: "2",
        name: "TV",
        brand: "LG",
        purchaseDate: null,
        warrantyExpiry: null,
        extendedExpiry: null,
      },
      {
        id: "3",
        name: "Phone",
        brand: "Samsung",
        purchaseDate: null,
        warrantyExpiry: null,
        extendedExpiry: null,
      },
    ]);

    expect([...ids].sort()).toEqual(["1", "2"]);
  });
});

describe("findDuplicateOfProduct", () => {
  it("ignores the product being edited", () => {
    const existing = {
      id: "keep",
      name: "Fridge",
      brand: "Samsung",
      purchaseDate: null,
      warrantyExpiry: null,
      extendedExpiry: null,
    };

    const match = findDuplicateOfProduct(
      [existing],
      {
        name: "Fridge",
        brand: "Samsung",
        purchaseDate: null,
        warrantyExpiry: null,
        extendedExpiry: null,
      },
      "keep"
    );

    expect(match).toBeNull();
  });
});
