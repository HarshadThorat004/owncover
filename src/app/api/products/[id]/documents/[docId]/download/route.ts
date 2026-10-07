import { NextRequest } from "next/server";

import { jsonError } from "@/lib/api";
import {
  contentDispositionAttachment,
  documentDownloadFilename,
} from "@/lib/document-download";
import { logDocumentAccess } from "@/lib/document-access-log";
import { assertProductAccess } from "@/lib/product-access";
import { isAllowedRemoteUrl } from "@/lib/url-allowlist";

type Params = {
  params: Promise<{ id: string; docId: string }>;
};

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id, docId } = await params;
    const access = await assertProductAccess(id);

    if (access.error || !access.product) {
      return jsonError(access.error, access.status);
    }

    const doc = access.product.documents.find((item) => item.id === docId);

    if (!doc) {
      return jsonError("Document not found", 404);
    }

    if (!isAllowedRemoteUrl(doc.fileUrl)) {
      return jsonError("Download not available for this file", 400);
    }

    const upstream = await fetch(doc.fileUrl, { cache: "no-store" });

    if (!upstream.ok) {
      return jsonError("Could not fetch file", 502);
    }

    const buffer = await upstream.arrayBuffer();
    const filename = documentDownloadFilename(
      doc.documentType,
      doc.fileUrl,
      doc.fileType
    );

    await logDocumentAccess({
      userId: access.user.id,
      productId: access.product.id,
      kind: "document",
      documentId: doc.id,
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
    console.error("DOCUMENT_DOWNLOAD_ERROR", error);
    return jsonError("Download failed");
  }
}
