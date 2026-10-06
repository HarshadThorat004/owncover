import { addDays, startOfDay } from "date-fns";
import { describe, expect, it } from "vitest";

import {
  buildNeedsYouItems,
  needsYouSectionSubtitle,
  primaryProductAttentionReason,
} from "@/lib/product-attention";
import { EXPIRING_SOON_DAYS } from "@/constants/warranty";

const today = startOfDay(new Date("2026-10-04T12:00:00.000Z"));

function product(
  overrides: Partial<Parameters<typeof buildNeedsYouItems>[0][number]> & {
    id: string;
    name: string;
  }
) {
  return {
    brand: "GOBOULT",
    model: null,
    category: null,
    retailer: null,
    serialNumber: "SN-1",
    invoiceNumber: "INV-1",
    purchaseAmount: "999",
    purchaseDate: today,
    warrantyExpiry: addDays(today, EXPIRING_SOON_DAYS),
    extendedExpiry: null,
    extendedType: null,
    ...overrides,
  };
}

describe("primaryProductAttentionReason", () => {
  it("shows serial missing without also showing expiring", () => {
    const row = product({
      id: "a",
      name: "Watch",
      serialNumber: "  ",
      warrantyExpiry: addDays(today, 5),
    });

    expect(
      primaryProductAttentionReason(row, false)?.label
    ).toBe("Serial missing");
  });

  it("prefers duplicate over serial and expiring", () => {
    const row = product({
      id: "a",
      name: "Watch",
      serialNumber: "",
      warrantyExpiry: addDays(today, 5),
    });

    expect(primaryProductAttentionReason(row, true)?.kind).toBe("duplicate");
  });
});

describe("buildNeedsYouItems", () => {
  it("returns one reason per product", () => {
    const items = buildNeedsYouItems([
      product({
        id: "1",
        name: "Watch",
        serialNumber: "",
        warrantyExpiry: addDays(today, 5),
      }),
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]?.reason.label).toBe("Serial missing");
  });

  it("flags both rows in a duplicate pair", () => {
    const base = product({ id: "1", name: "Watch" });
    const twin = product({ id: "2", name: "Watch" });

    const items = buildNeedsYouItems([base, twin]);
    expect(items).toHaveLength(2);
    expect(items.every((item) => item.reason.kind === "duplicate")).toBe(true);
  });
});

describe("needsYouSectionSubtitle", () => {
  it("uses a single-line subtitle when only serial is present", () => {
    const items = buildNeedsYouItems([
      product({ id: "1", name: "Watch", serialNumber: "" }),
    ]);

    expect(needsYouSectionSubtitle(items)).toBe("A missing serial");
  });
});
