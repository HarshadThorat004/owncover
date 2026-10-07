import { isPdfAsset } from "@/lib/warranty";

export function documentDownloadFilename(
  documentType: string,
  fileUrl: string,
  fileType?: string | null
) {
  const base = documentType
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);

  const safeBase = base || "document";

  if (isPdfAsset(fileUrl, fileType)) {
    return `${safeBase}.pdf`;
  }

  const fromUrl = fileUrl.match(/\.(jpe?g|png|webp|gif|heic)(\?|$)/i)?.[1];
  if (fromUrl) {
    return `${safeBase}.${fromUrl.toLowerCase()}`;
  }

  if (fileType?.startsWith("image/")) {
    const ext = fileType.split("/")[1]?.replace("jpeg", "jpg");
    if (ext) return `${safeBase}.${ext}`;
  }

  return `${safeBase}.bin`;
}

export function contentDispositionAttachment(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_");
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
