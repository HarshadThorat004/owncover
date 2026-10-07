import {
  getCoverageStatus,
  getEffectiveCover,
  type CoverProduct,
} from "@/lib/coverage";
import {
  findDuplicateProductIds,
  type ProductDuplicateFields,
} from "@/lib/product-duplicates";
import { getDaysRemaining } from "@/lib/warranty";
import { isMissingSerial } from "@/lib/weekly-digest";

export type ProductAttentionKind = "duplicate" | "serial" | "expiring";

export type ProductAttentionReason = {
  kind: ProductAttentionKind;
  label: string;
  daysRemaining?: number | null;
  coverLabel?: string;
};

export type ProductForAttention = ProductDuplicateFields &
  CoverProduct & {
    id: string;
    serialNumber?: string | null;
  };

const KIND_ORDER: Record<ProductAttentionKind, number> = {
  duplicate: 0,
  serial: 1,
  expiring: 2,
};

export function primaryProductAttentionReason(
  product: ProductForAttention,
  isDuplicate: boolean
): ProductAttentionReason | null {
  if (isDuplicate) {
    return { kind: "duplicate", label: "Possible duplicate" };
  }

  if (isMissingSerial(product.serialNumber)) {
    return { kind: "serial", label: "Serial missing" };
  }

  if (getCoverageStatus(product) === "expiring") {
    const cover = getEffectiveCover(product);
    const daysRemaining = cover ? getDaysRemaining(cover.date) : null;
    return {
      kind: "expiring",
      label:
        daysRemaining != null
          ? `${daysRemaining}d left · ${cover?.label ?? "cover"}`
          : "Cover ending within 30 days",
      daysRemaining,
      coverLabel: cover?.label,
    };
  }

  return null;
}

export type NeedsYouItem<T extends ProductForAttention = ProductForAttention> = {
  product: T;
  reason: ProductAttentionReason;
};

export function buildNeedsYouItems<T extends ProductForAttention>(
  products: T[]
): NeedsYouItem<T>[] {
  const duplicateIds = findDuplicateProductIds(products);
  const items: NeedsYouItem<T>[] = [];

  for (const product of products) {
    const reason = primaryProductAttentionReason(
      product,
      duplicateIds.has(product.id)
    );
    if (reason) items.push({ product, reason });
  }

  items.sort(
    (a, b) =>
      KIND_ORDER[a.reason.kind] - KIND_ORDER[b.reason.kind] ||
      a.product.name.localeCompare(b.product.name)
  );

  return items;
}

export function needsYouSectionSubtitle(items: NeedsYouItem[]): string {
  if (items.length === 0) return "";

  const kinds = new Set(items.map((item) => item.reason.kind));
  const parts: string[] = [];

  if (kinds.has("duplicate")) parts.push("a possible duplicate");
  if (kinds.has("serial")) parts.push("a missing serial");
  if (kinds.has("expiring")) parts.push("cover ending within 30 days");

  if (parts.length === 1) {
    const single = parts[0]!;
    return single.charAt(0).toUpperCase() + single.slice(1);
  }

  const last = parts.pop();
  return `${parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}, or ${last}`;
}

export function countNeedsYouProducts(products: ProductForAttention[]): number {
  return buildNeedsYouItems(products).length;
}

export function productNeedsAttention(
  product: ProductForAttention,
  duplicateIds: Set<string>
): boolean {
  return (
    primaryProductAttentionReason(product, duplicateIds.has(product.id)) !==
    null
  );
}

export type ProductListFilter = "all" | "active" | "attention" | "expired";

export function matchesProductListFilter(
  product: ProductForAttention,
  filter: ProductListFilter,
  duplicateIds: Set<string>
): boolean {
  if (filter === "all") return true;

  const status = getCoverageStatus(product);

  if (filter === "active") {
    return status === "active";
  }

  if (filter === "attention") {
    return productNeedsAttention(product, duplicateIds);
  }

  if (filter === "expired") {
    return status === "expired";
  }

  return true;
}

export function compareProductsForList(
  a: ProductForAttention,
  b: ProductForAttention,
  filter: ProductListFilter,
  duplicateIds: Set<string>
): number {
  if (filter === "attention") {
    const reasonA = primaryProductAttentionReason(
      a,
      duplicateIds.has(a.id)
    );
    const reasonB = primaryProductAttentionReason(
      b,
      duplicateIds.has(b.id)
    );
    const kindA = reasonA?.kind ?? "expiring";
    const kindB = reasonB?.kind ?? "expiring";
    const byKind = KIND_ORDER[kindA] - KIND_ORDER[kindB];
    if (byKind !== 0) return byKind;

    const aExpiry = getEffectiveCover(a)?.date;
    const bExpiry = getEffectiveCover(b)?.date;
    if (aExpiry && bExpiry) {
      return getDaysRemaining(aExpiry) - getDaysRemaining(bExpiry);
    }
    return a.name.localeCompare(b.name);
  }

  const aExpiry = getEffectiveCover(a)?.date;
  const bExpiry = getEffectiveCover(b)?.date;
  if (!aExpiry) return 1;
  if (!bExpiry) return -1;
  return getDaysRemaining(aExpiry) - getDaysRemaining(bExpiry);
}
