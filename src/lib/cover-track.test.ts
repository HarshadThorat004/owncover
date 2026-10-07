import { addDays, startOfDay } from "date-fns";
import { describe, expect, it } from "vitest";

import { EXPIRING_SOON_DAYS } from "@/constants/warranty";

import {
  coverTrackProgress,
  formatCoverTimeLabel,
  getCoverTrackDisplay,
} from "@/lib/cover-track";

const now = startOfDay(new Date("2026-10-04T12:00:00.000Z"));

describe("getCoverTrackDisplay", () => {
  it("marks active cover with progress", () => {
    const purchase = addDays(now, -200);
    const expiry = addDays(now, 214);

    const display = getCoverTrackDisplay(
      {
        purchaseDate: purchase,
        warrantyExpiry: expiry,
      },
      now
    );

    expect(display.chip).toBe("Active");
    expect(display.coverSource).toBe("Manufacturer cover");
    expect(display.timeLabel).toContain("left");
    expect(display.progress).toBeGreaterThan(0);
  });

  it("marks expiring cover", () => {
    const display = getCoverTrackDisplay(
      {
        warrantyExpiry: addDays(now, 12),
      },
      now
    );

    expect(display.chip).toBe("Expiring");
    expect(display.timeLabel).toBe("12 days left");
  });
});

describe("formatCoverTimeLabel", () => {
  it("formats short remaining window", () => {
    expect(formatCoverTimeLabel(addDays(now, 5), now)).toBe("5 days left");
  });
});

describe("coverTrackProgress", () => {
  it("returns zero when expired", () => {
    expect(
      coverTrackProgress(null, addDays(now, -3), now)
    ).toBe(0);
  });

  it("uses purchase window when available", () => {
    const purchase = addDays(now, -300);
    const expiry = addDays(now, EXPIRING_SOON_DAYS);
    const progress = coverTrackProgress(purchase, expiry, now);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });
});
