import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { logDocumentAccess } from "@/lib/document-access-log";
import { buildClaimPackPdf } from "@/lib/exports/claim-pack";
import { attachmentFilename, slugifyFilename } from "@/lib/exports/format";
import { assertProductOwner } from "@/lib/product-access";
import { isSampleVaultProduct } from "@/lib/sample-vault-product";

export const runtime = "nodejs";
export const maxDuration = 30;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const access = await assertProductOwner(id);

    if (access.error || !access.product) {
      return jsonError(access.error, access.status);
    }

    const product = access.product;
    const bytes = await buildClaimPackPdf({
      name: product.name,
      brand: product.brand,
      model: product.model,
      category: product.category,
      retailer: product.retailer,
      serialNumber: product.serialNumber,
      invoiceNumber: product.invoiceNumber,
      purchaseAmount: product.purchaseAmount,
      purchaseDate: product.purchaseDate,
      warrantyExpiry: product.warrantyExpiry,
      extendedExpiry: product.extendedExpiry,
      extendedType: product.extendedType,
      notes: product.notes,
      renewalAvailable: product.renewalAvailable,
      renewalNotes: product.renewalNotes,
      invoiceImage: product.invoiceImage,
      documents: product.documents.map((doc) => ({
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        documentType: doc.documentType,
      })),
      packKind: isSampleVaultProduct(product) ? "sample" : "live",
    });

    const filename = `${slugifyFilename(product.name)}-claim-pack.pdf`;

    await logDocumentAccess({
      userId: access.user.id,
      productId: product.id,
      kind: "claim_pack",
    });

    return new NextResponse(Buffer.from(bytes), {
      headers: attachmentFilename(filename, "application/pdf"),
    });
  } catch (error) {
    console.error("CLAIM_PACK_ERROR", error);
    return jsonError("Failed to build claim pack");
  }
}
