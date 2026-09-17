import { describe, expect, it } from "vitest";

import { getOcrCachePath } from "@/lib/document-extract/ocr-langs";

describe("OCR cache path", () => {
  it("leaves the default cache in the browser", () => {
    expect(
      getOcrCachePath({ VERCEL: "1" }, { isBrowser: true })
    ).toBeUndefined();
  });

  it("writes traineddata to /tmp on Vercel", () => {
    expect(getOcrCachePath({ VERCEL: "1" }, { isBrowser: false })).toBe("/tmp");
  });

  it("keeps the default cache for local Node", () => {
    expect(getOcrCachePath({}, { isBrowser: false })).toBeUndefined();
  });
});
