"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, FileText } from "lucide-react";

import DocumentViewer, {
  isPdfDocument,
  type ViewerDocument,
} from "@/components/document-viewer";
import PdfPlaceholder from "@/components/pdf-placeholder";

type DocumentItem = {
  id: string;
  fileUrl: string;
  fileType: string;
  documentType: string;
};

type Props = {
  productId: string;
  documents: DocumentItem[];
  invoiceImage?: string | null;
};

export default function ProductDocuments({
  productId,
  documents,
  invoiceImage,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const viewerDocs: ViewerDocument[] = documents.map((doc) => ({
    id: doc.id,
    url: doc.fileUrl,
    title: doc.documentType,
    fileType: doc.fileType,
  }));

  const invoiceInDocuments =
    invoiceImage &&
    documents.some((doc) => doc.fileUrl === invoiceImage);

  if (documents.length === 0 && !invoiceImage) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
        <FileText className="mx-auto text-gray-600" size={28} />
        <p className="mt-3 text-sm font-medium text-gray-300">No documents yet</p>
        <p className="mt-1 text-xs text-gray-500">Add files from the edit page.</p>
      </div>
    );
  }

  return (
    <>
      {!invoiceInDocuments && invoiceImage ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <p className="text-sm font-medium text-white">Invoice image</p>
            <a
              href={`/api/products/${productId}/invoice/download`}
              className="premium-ghost inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-gray-200"
            >
              <Download size={14} />
              Download
            </a>
          </div>
          <div className="relative h-40">
            <Image
              src={invoiceImage}
              alt="Invoice"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((doc) => {
          const pdf = isPdfDocument({
            url: doc.fileUrl,
            fileType: doc.fileType,
          });

          return (
            <div
              key={doc.id}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/5 px-4 py-3">
                <p className="min-w-0 truncate text-sm font-medium text-white">
                  {doc.documentType}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={`/api/products/${productId}/documents/${doc.id}/download`}
                    className="premium-ghost inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-100"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gray-500 hover:text-gray-300"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Open
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveId(doc.id)}
                className="group relative block w-full text-left"
                aria-label={`View ${doc.documentType}`}
              >
                {pdf ? (
                  <PdfPlaceholder
                    sizeClassName="h-48"
                    label={doc.documentType}
                  />
                ) : (
                  <Image
                    src={doc.fileUrl}
                    alt={doc.documentType}
                    width={1200}
                    height={900}
                    className="h-48 w-full object-cover transition group-hover:opacity-90"
                    unoptimized
                  />
                )}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent pb-3 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs text-white">
                    Click to view
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <DocumentViewer
        documents={viewerDocs}
        activeId={activeId}
        open={activeId !== null}
        onClose={() => setActiveId(null)}
        onChange={setActiveId}
      />
    </>
  );
}
