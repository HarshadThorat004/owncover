import { NextRequest } from "next/server";

import { jsonError } from "@/lib/api";
import {
  contentDispositionAttachment,
  documentDownloadFilename,
} from "@/lib/document-download";
import { logDocumentAccess } from "@/lib/document-access-log";
import { assertProductAccess } from "@/lib/product-access";
import { isAllowedRemoteUrl } from "@/lib/url-allowlist";
import { isPdfAsset } from "@/lib/warranty";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const access = await assertProductAccess(id);

    if (access.error || !access.product) {
      return jsonError(access.error, access.status);
    }

    const url = access.product.invoiceImage;

    if (!url) {
      return jsonError("No invoice file on this product", 404);
    }

    if (!isAllowedRemoteUrl(url)) {
      return jsonError("Download not available for this file", 400);
    }

    const alreadyListed = access.product.documents.some(
      (doc) => doc.fileUrl === url
    );
    if (alreadyListed) {
      return jsonError(
        "Invoice is already listed under Documents — use that download",
        409
      );
    }

    const upstream = await fetch(url, { cache: "no-store" });

    if (!upstream.ok) {
      return jsonError("Could not fetch file", 502);
    }

    const buffer = await upstream.arrayBuffer();
    const fileType = isPdfAsset(url) ? "pdf" : "image";
    const filename = documentDownloadFilename("Invoice", url, fileType);

    await logDocumentAccess({
      userId: access.user.id,
      productId: access.product.id,
      kind: "invoice",
    });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ??
          "application/octet-stream",
        "Content-Disposition": contentDispositionAttachment(filename),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("INVOICE_DOWNLOAD_ERROR", error);
    return jsonError("Download failed");
  }
}
