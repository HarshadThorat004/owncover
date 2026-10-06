import { startOfDay } from "date-fns";

export type ProductDuplicateFields = {
  name: string;
  brand?: string | null;
  model?: string | null;
  category?: string | null;
  retailer?: string | null;
  serialNumber?: string | null;
  invoiceNumber?: string | null;
  purchaseAmount?: string | null;
  purchaseDate?: Date | string | null;
  warrantyExpiry?: Date | string | null;
  extendedExpiry?: Date | string | null;
  extendedType?: string | null;
};

function normText(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function normAmount(value?: string | null) {
  return (value ?? "").replace(/,/g, "").trim().toLowerCase();
}

function normDate(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return startOfDay(date).toISOString().slice(0, 10);
}

/** Stable key when two vault rows represent the same physical product. */
export function productDuplicateFingerprint(
  product: ProductDuplicateFields
): string {
  return [
    normText(product.name),
    normText(product.brand),
    normText(product.model),
    normText(product.category),
    normText(product.retailer),
    normText(product.serialNumber),
    normText(product.invoiceNumber),
    normAmount(product.purchaseAmount),
    normDate(product.purchaseDate),
    normDate(product.warrantyExpiry),
    normDate(product.extendedExpiry),
    normText(product.extendedType),
  ].join("\u001f");
}

type IdentifiedProduct = ProductDuplicateFields & { id: string };

export function findDuplicateProductIds(products: IdentifiedProduct[]): Set<string> {
  const byKey = new Map<string, string[]>();

  for (const product of products) {
    const key = productDuplicateFingerprint(product);
    const bucket = byKey.get(key);
    if (bucket) bucket.push(product.id);
    else byKey.set(key, [product.id]);
  }

  const duplicateIds = new Set<string>();
  for (const ids of byKey.values()) {
    if (ids.length < 2) continue;
    for (const id of ids) duplicateIds.add(id);
  }

  return duplicateIds;
}

export function findDuplicateOfProduct(
  products: IdentifiedProduct[],
  candidate: ProductDuplicateFields,
  excludeProductId?: string
): IdentifiedProduct | null {
  const key = productDuplicateFingerprint(candidate);

  for (const product of products) {
    if (excludeProductId && product.id === excludeProductId) continue;
    if (productDuplicateFingerprint(product) === key) return product;
  }

  return null;
}
