import { describe, expect, it } from "vitest";

import {
  detectMimeType,
  detectMimeTypeFromBuffer,
  resolveDocumentMimeType,
} from "@/lib/document-extract/text-source";

describe("resolveDocumentMimeType", () => {
  it("detects PDF from magic bytes when the URL and headers are generic", () => {
    const buffer = Buffer.from("%PDF-1.4\n%âãÏÓ");

    expect(
      resolveDocumentMimeType(
        "https://abc123.ufs.sh/f/invoice",
        "application/octet-stream",
        buffer
      )
    ).toBe("application/pdf");
  });

  it("uses a client mime hint for UploadThing URLs without a file extension", () => {
    const buffer = Buffer.from("not a pdf");

    expect(
      resolveDocumentMimeType(
        "https://abc123.ufs.sh/f/invoice",
        "application/octet-stream",
        buffer,
        "application/pdf"
      )
    ).toBe("application/pdf");
  });

  it("does not default unknown octet-stream responses to image/png", () => {
    expect(
      detectMimeType("https://abc123.ufs.sh/f/invoice", "application/octet-stream")
    ).toBe("image/png");
  });
});

describe("detectMimeTypeFromBuffer", () => {
  it("returns null for non-PDF buffers", () => {
    expect(detectMimeTypeFromBuffer(Buffer.from("hello"))).toBeNull();
  });
});
