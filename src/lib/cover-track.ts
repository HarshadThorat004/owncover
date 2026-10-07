import {
  differenceInCalendarDays,
  formatDistanceStrict,
  startOfDay,
} from "date-fns";

import {
  getCoverageStatus,
  getEffectiveCover,
  type CoverProduct,
} from "@/lib/coverage";
export type CoverTrackChip = "Active" | "Expiring" | "Expired" | "Unknown";

export type CoverTrackDisplay = {
  chip: CoverTrackChip;
  coverSource: string;
  timeLabel: string;
  progress: number;
};

type Input = CoverProduct & {
  purchaseDate?: Date | string | null;
};

function asDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return startOfDay(date);
}

export function formatCoverTimeLabel(
  expiry: Date,
  now = new Date()
): string {
  const days = differenceInCalendarDays(expiry, now);

  if (days < 0) {
    const ago = Math.abs(days);
    if (ago === 1) return "Ended yesterday";
    if (ago <= 45) return "Ended recently";
    return `Ended ${formatDistanceStrict(expiry, now, { addSuffix: true })}`;
  }

  if (days === 0) return "Ends today";
  if (days === 1) return "1 day left";
  if (days <= 60) return `${days} days left`;

  return `${formatDistanceStrict(now, expiry)} left`;
}

export function coverTrackProgress(
  purchaseDate: Date | null,
  expiry: Date,
  now = new Date()
): number {
  const daysRemaining = differenceInCalendarDays(expiry, now);
  if (daysRemaining <= 0) return 0;

  if (purchaseDate) {
    const totalDays = differenceInCalendarDays(expiry, purchaseDate);
    if (totalDays > 0) {
      const pct = (daysRemaining / totalDays) * 100;
      return Math.min(100, Math.max(6, Math.round(pct)));
    }
  }

  return Math.min(100, Math.max(8, Math.round((daysRemaining / 365) * 100)));
}

export function getCoverTrackDisplay(
  product: Input,
  now = new Date()
): CoverTrackDisplay {
  const status = getCoverageStatus(product, now);
  const cover = getEffectiveCover(product, now);

  if (!cover) {
    return {
      chip: "Unknown",
      coverSource: "Cover dates",
      timeLabel: "Add warranty or store cover",
      progress: 0,
    };
  }

  const expiry = asDate(cover.date)!;
  const purchase = asDate(product.purchaseDate);

  const chip: CoverTrackChip =
    status === "expired"
      ? "Expired"
      : status === "expiring"
        ? "Expiring"
        : status === "active"
          ? "Active"
          : "Unknown";

  return {
    chip,
    coverSource: `${cover.label} cover`,
    timeLabel: formatCoverTimeLabel(expiry, now),
    progress: coverTrackProgress(purchase, expiry, now),
  };
}
