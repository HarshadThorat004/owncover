import { describe, expect, it } from "vitest";

import { getReminderSchedule } from "@/lib/reminder-schedule";

describe("getReminderSchedule", () => {
  it("places 30, 7, and 1-day reminders before cover ends", () => {
    const expiry = new Date("2026-10-10T00:00:00.000Z");
    const now = new Date("2026-09-01T00:00:00.000Z");
    const items = getReminderSchedule(expiry, now);

    expect(items.map((item) => item.id)).toEqual(["30", "7", "1", "end"]);
    expect(items[0]?.state).toBe("scheduled");
    expect(items[3]?.id).toBe("end");
  });

  it("marks past reminder windows as passed", () => {
    const expiry = new Date("2026-09-10T00:00:00.000Z");
    const now = new Date("2026-09-20T00:00:00.000Z");
    const items = getReminderSchedule(expiry, now);

    expect(items.every((item) => item.state === "passed")).toBe(true);
  });
});
