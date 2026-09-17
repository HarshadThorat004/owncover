import { getCoverageStatus } from "@/lib/coverage";

export const WEEKLY_DIGEST_TYPE = "weekly_digest";

export type DigestProduct = {
  id: string;
  name: string;
  brand: string | null;
  serialNumber: string | null;
  warrantyExpiry: Date | string | null;
  extendedExpiry?: Date | string | null;
  extendedType?: string | null;
};

export type DigestLine = {
  id: string;
  name: string;
  detail: string;
};

export type WeeklyDigest = {
  expiring: DigestLine[];
  missingSerial: DigestLine[];
  inboundDrafts: number;
};

export function isoWeekKey(date = new Date()) {
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const year = utc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function isMissingSerial(serialNumber?: string | null) {
  return !serialNumber?.trim();
}

function productLabel(product: DigestProduct) {
  return [product.name, product.brand].filter(Boolean).join(" · ");
}

export function buildWeeklyDigest(
  products: DigestProduct[],
  inboundDrafts: number,
  now = new Date()
): WeeklyDigest | null {
  const expiring: DigestLine[] = [];
  const missingSerial: DigestLine[] = [];

  for (const product of products) {
    if (getCoverageStatus(product, now) === "expiring") {
      expiring.push({
        id: product.id,
        name: productLabel(product),
        detail: "Cover ends within 30 days",
      });
    }

    if (isMissingSerial(product.serialNumber)) {
      missingSerial.push({
        id: product.id,
        name: productLabel(product),
        detail: "Serial missing — the desk will ask",
      });
    }
  }

  const digest: WeeklyDigest = {
    expiring,
    missingSerial,
    inboundDrafts: Math.max(0, inboundDrafts),
  };

  if (!digestHasWork(digest)) {
    return null;
  }

  return digest;
}

export function digestHasWork(digest: WeeklyDigest) {
  return (
    digest.expiring.length > 0 ||
    digest.missingSerial.length > 0 ||
    digest.inboundDrafts > 0
  );
}
