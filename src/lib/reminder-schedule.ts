import { isAfter, isBefore, startOfDay, subDays } from "date-fns";

import {
  CRITICAL_EXPIRING_DAYS,
  EXPIRING_SOON_DAYS,
  LAST_DAY_REMINDER_DAYS,
} from "@/constants/warranty";

export type ReminderScheduleItem = {
  id: "30" | "7" | "1" | "end";
  label: string;
  date: Date;
  state: "scheduled" | "today" | "passed";
};

export function getReminderSchedule(
  expiry: Date,
  now = new Date()
): ReminderScheduleItem[] {
  const today = startOfDay(now);
  const end = startOfDay(expiry);

  const rows: Omit<ReminderScheduleItem, "state">[] = [
    {
      id: "30",
      label: "30-day reminder",
      date: subDays(end, EXPIRING_SOON_DAYS),
    },
    {
      id: "7",
      label: "7-day reminder",
      date: subDays(end, CRITICAL_EXPIRING_DAYS),
    },
    {
      id: "1",
      label: "Day-before reminder",
      date: subDays(end, LAST_DAY_REMINDER_DAYS),
    },
    {
      id: "end",
      label: "Cover ends",
      date: end,
    },
  ];

  return rows.map((row) => {
    const day = startOfDay(row.date);
    let state: ReminderScheduleItem["state"] = "scheduled";
    if (isBefore(day, today)) state = "passed";
    else if (!isAfter(day, today)) state = "today";
    return { ...row, state };
  });
}
