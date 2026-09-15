import { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/lib/api";
import { isCronAuthorized } from "@/lib/cron-auth";
import { BRAND_CONTACT_EMAIL } from "@/constants/brand";
import {
  EmailSendError,
  friendlyEmailError,
  getEmailProviderStatus,
  sendTestEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const DEFAULT_TEST_TO = BRAND_CONTACT_EMAIL;

export async function POST(req: NextRequest) {
  try {
    if (!isCronAuthorized(req)) {
      return jsonError("Unauthorized", 401);
    }

    let to = DEFAULT_TEST_TO;

    try {
      const body = (await req.json()) as { to?: string };
      if (body?.to && typeof body.to === "string" && body.to.includes("@")) {
        to = body.to.trim();
      }
    } catch {
      // Empty body is fine — use default recipient
    }

    const status = getEmailProviderStatus();
    const result = await sendTestEmail(to);

    if (result.skipped) {
      return jsonError("RESEND_API_KEY is not configured", 503, {
        code: "resend_config",
      });
    }

    return jsonSuccess({
      success: true,
      to,
      id: result.id,
      emailSetup: {
        domainReady: status.domainReady,
        usingSharedSender: status.usingSharedSender,
        from: status.from,
        recommendedFrom: status.recommendedFrom,
      },
    });
  } catch (error) {
    console.error("TEST_EMAIL_ERROR", error);

    if (error instanceof EmailSendError) {
      const status =
        error.kind === "quota"
          ? 429
          : error.kind === "domain" || error.kind === "test_recipient"
            ? 403
            : 500;
      return jsonError(friendlyEmailError(error), status, {
        code: `resend_${error.kind}`,
      });
    }

    return jsonError(friendlyEmailError(error));
  }
}
