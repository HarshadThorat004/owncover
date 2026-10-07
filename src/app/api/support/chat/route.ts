import { z } from "zod";

import { getRequestIp, jsonError, jsonSuccess } from "@/lib/api";
import { getSessionUser } from "@/lib/product-access";
import { getDashboardCounts } from "@/lib/products-query";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  buildSupportReply,
  isVaultQuestion,
  SUPPORT_CHAT_MAX_MESSAGE,
} from "@/lib/support-chat";

const bodySchema = z.object({
  message: z.string().trim().min(1).max(SUPPORT_CHAT_MAX_MESSAGE),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();

    const limit = consumeRateLimit({
      key: `support-chat:${user?.id ?? getRequestIp(req)}`,
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });

    if (!limit.success) {
      return jsonError("Too many messages. Try again in a few minutes.", 429);
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return jsonError(
        `Message must be 1–${SUPPORT_CHAT_MAX_MESSAGE} characters`,
        400
      );
    }

    const { message } = parsed.data;
    const vault =
      user && isVaultQuestion(message) ? await getDashboardCounts(user.id) : null;

    return jsonSuccess(buildSupportReply(message, vault));
  } catch (error) {
    console.error("SUPPORT_CHAT_ERROR", error);
    return jsonError("Could not answer right now");
  }
}
