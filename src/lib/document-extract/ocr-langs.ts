import { createWorker } from "tesseract.js";

export const OCR_LANGUAGES = "eng+hin";
export const OCR_LANGUAGES_FALLBACK = "eng";

type OcrRuntime = {
  isBrowser: boolean;
};

export function getOcrCachePath(
  env: Record<string, string | undefined> = process.env,
  runtime: OcrRuntime = { isBrowser: typeof window !== "undefined" }
) {
  if (runtime.isBrowser) {
    return undefined;
  }

  // Vercel serverless is read-only except /tmp.
  if (env.VERCEL === "1") {
    return "/tmp";
  }

  return undefined;
}

function workerOptions() {
  const cachePath = getOcrCachePath();

  return {
    logger: () => undefined,
    ...(cachePath ? { cachePath } : {}),
  };
}

export async function createOcrWorker() {
  const options = workerOptions();

  try {
    return await createWorker(OCR_LANGUAGES, 1, options);
  } catch (error) {
    console.warn("OCR_LANGS_HINDI_UNAVAILABLE", error);
    return createWorker(OCR_LANGUAGES_FALLBACK, 1, options);
  }
}
