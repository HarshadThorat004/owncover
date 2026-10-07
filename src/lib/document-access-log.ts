import { prisma } from "@/lib/prisma";

export type DocumentAccessKind = "document" | "invoice" | "claim_pack";

/** Records who downloaded which file. Never blocks or fails the download. */
export async function logDocumentAccess(entry: {
  userId: string;
  productId: string;
  kind: DocumentAccessKind;
  documentId?: string;
}) {
  try {
    await prisma.documentAccessLog.create({
      data: {
        userId: entry.userId,
        productId: entry.productId,
        kind: entry.kind,
        documentId: entry.documentId ?? null,
      },
    });
  } catch (error) {
    console.warn("DOCUMENT_ACCESS_LOG_FAILED", error);
  }
}
