import { NextRequest, NextResponse } from "next/server";

import { SAMPLE_CLAIM_PACK_PRODUCT } from "@/constants/sample-claim-pack";
import { jsonError, getRequestIp } from "@/lib/api";
import { buildClaimPackPdf } from "@/lib/exports/claim-pack";
import { consumeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const rateLimit = consumeRateLimit({
    key: `sample-pack:${getRequestIp(request)}`,
    limit: 40,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.success) {
    return jsonError("Too many sample pack downloads. Try again later.", 429);
  }

  try {
    const bytes = await buildClaimPackPdf(SAMPLE_CLAIM_PACK_PRODUCT);

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'inline; filename="owncover-sample-claim-pack.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("SAMPLE_PACK_ERROR", error);
    return jsonError("Failed to build sample claim pack");
  }
}
