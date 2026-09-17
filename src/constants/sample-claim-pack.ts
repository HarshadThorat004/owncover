import type { ClaimPackProduct } from "@/lib/exports/claim-pack";

/** Fictional serial used on the public sample pack and the first-run vault TV. */
export const SAMPLE_PRODUCT_SERIAL = "SAMPLE-TV-0000";

/** Fictional product for the public sample pack. Not a real claim. */
export const SAMPLE_CLAIM_PACK_PRODUCT: ClaimPackProduct = {
  name: "43-inch 4K LED television",
  brand: "Example",
  model: "EX-43UHD-A",
  category: "tv_audio",
  retailer: "National electronics retailer",
  serialNumber: SAMPLE_PRODUCT_SERIAL,
  invoiceNumber: "SAMPLE/GST/2024-25/1842",
  purchaseAmount: "32990",
  purchaseDate: new Date("2024-11-12T00:00:00.000Z"),
  warrantyExpiry: new Date("2026-11-12T00:00:00.000Z"),
  extendedExpiry: new Date("2027-11-12T00:00:00.000Z"),
  extendedType: "store",
  notes:
    "Sample only — fictional serial and invoice. Print a pack like this for your own product. Do not leave originals at the desk.",
  renewalAvailable: false,
  renewalNotes: null,
  invoiceImage: null,
  documents: [
    {
      fileUrl: "https://example.invalid/sample-invoice.pdf",
      fileType: "pdf",
      documentType: "GST tax invoice",
    },
    {
      fileUrl: "https://example.invalid/sample-warranty.pdf",
      fileType: "pdf",
      documentType: "Warranty card",
    },
  ],
  packKind: "sample",
};
