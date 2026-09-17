export function isoDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** UTC calendar day — same string on server and client. */
export function formatUtcDay(
  value: Date | string | null | undefined,
  empty = "—"
) {
  if (!value) return empty;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return empty;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function slugifyFilename(value: string, fallback = "product") {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || fallback;
}

export function attachmentFilename(name: string, contentType: string) {
  const escaped = name.replace(/["\\]/g, "_");
  return {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${escaped}"`,
    "Cache-Control": "no-store",
  };
}
