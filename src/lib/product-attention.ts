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
