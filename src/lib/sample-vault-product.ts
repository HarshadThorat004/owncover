import {
  SAMPLE_CLAIM_PACK_PRODUCT,
  SAMPLE_PRODUCT_SERIAL,
} from "@/constants/sample-claim-pack";

export { SAMPLE_PRODUCT_SERIAL };

export function isSampleVaultProduct(product: {
  serialNumber?: string | null;
}) {
  return product.serialNumber === SAMPLE_PRODUCT_SERIAL;
}

/** Prisma fields for the first-run sample TV. No document URLs — those are fictional. */
export function sampleVaultProductCreateData() {
  const sample = SAMPLE_CLAIM_PACK_PRODUCT;

  return {
    name: sample.name,
    brand: sample.brand,
    model: sample.model,
    category: sample.category,
    retailer: sample.retailer,
    serialNumber: SAMPLE_PRODUCT_SERIAL,
    invoiceNumber: sample.invoiceNumber,
    purchaseAmount: sample.purchaseAmount,
    purchaseDate: sample.purchaseDate ? toDate(sample.purchaseDate) : null,
    warrantyExpiry: sample.warrantyExpiry ? toDate(sample.warrantyExpiry) : null,
    extendedExpiry: sample.extendedExpiry
      ? toDate(sample.extendedExpiry)
      : null,
    extendedType: sample.extendedType ?? "store",
    notes:
      "Sample only — fictional serial and invoice. Download a pack from this page, then delete this product and add your own GST bill.",
    renewalAvailable: false,
    renewalNotes: null,
    invoiceImage: null,
  };
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}
