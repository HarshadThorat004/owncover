import { describe, expect, it } from "vitest";

import {
  buildWeeklyDigest,
  isMissingSerial,
  isoWeekKey,
} from "@/lib/weekly-digest";

const now = new Date("2026-09-18T00:00:00.000Z");

describe("isoWeekKey", () => {
  it("uses ISO weeks in UTC", () => {
    expect(isoWeekKey(now)).toBe("2026-W38");
  });
});

describe("buildWeeklyDigest", () => {
  it("returns null when the vault needs no Monday mail", () => {
    expect(
      buildWeeklyDigest(
        [
          {
            id: "p1",
            name: "TV",
            brand: "Example",
            serialNumber: "SN-1",
            warrantyExpiry: new Date("2027-11-12T00:00:00.000Z"),
            extendedExpiry: null,
          },
        ],
        0,
        now
      )
    ).toBeNull();
  });

  it("lists expiring cover, missing serials, and inbound drafts", () => {
    const digest = buildWeeklyDigest(
      [
        {
          id: "exp",
          name: "Fridge",
          brand: "Example",
          serialNumber: "FR-1",
          warrantyExpiry: new Date("2026-10-02T00:00:00.000Z"),
          extendedExpiry: null,
        },
        {
          id: "nosn",
          name: "Phone",
          brand: null,
          serialNumber: "  ",
          warrantyExpiry: new Date("2028-01-01T00:00:00.000Z"),
          extendedExpiry: null,
        },
      ],
      2,
      now
    );

    expect(digest).not.toBeNull();
    expect(digest?.expiring.map((item) => item.id)).toEqual(["exp"]);
    expect(digest?.missingSerial.map((item) => item.id)).toEqual(["nosn"]);
    expect(digest?.inboundDrafts).toBe(2);
  });
});

describe("isMissingSerial", () => {
  it("treats blank serials as missing", () => {
    expect(isMissingSerial(null)).toBe(true);
    expect(isMissingSerial("  ")).toBe(true);
    expect(isMissingSerial("SN-1")).toBe(false);
  });
});
