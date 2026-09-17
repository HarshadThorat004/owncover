import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/lib/api";
import { isCronAuthorized } from "@/lib/cron-auth";
import {
  EmailSendError,
  friendlyEmailError,
  getEmailProviderStatus,
  sendWeeklyDigestEmail,
} from "@/lib/email";
import { listPendingInboundDrafts } from "@/lib/inbound";
import { prisma } from "@/lib/prisma";
import { listProductsForUser } from "@/lib/products-query";
import {
  buildWeeklyDigest,
  isoWeekKey,
  WEEKLY_DIGEST_TYPE,
} from "@/lib/weekly-digest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 50;

export async function GET(req: NextRequest) {
  try {
    if (!isCronAuthorized(req)) {
      return jsonError("Unauthorized", 401);
    }

    const weekKey = isoWeekKey();
    const emailStatus = getEmailProviderStatus();
    let cursor: string | undefined;
    let processed = 0;
    let emailsSent = 0;
    let skipped = 0;
    let emailErrors = 0;
    let lastEmailError: string | null = null;
    let quotaStopped = false;

    for (;;) {
      if (quotaStopped) break;

      const users = await prisma.user.findMany({
        where: {
          OR: [
            { products: { some: {} } },
            { householdMembership: { isNot: null } },
          ],
        },
        select: { id: true, email: true, name: true },
        orderBy: { id: "asc" },
        take: BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      if (users.length === 0) break;

      processed += users.length;

      for (const user of users) {
        if (quotaStopped) break;

        const [{ items: products }, drafts] = await Promise.all([
          listProductsForUser(user.id, { limit: 50 }),
          listPendingInboundDrafts(user.id),
        ]);

        const digest = buildWeeklyDigest(products, drafts.length);

        if (!digest) {
          skipped += 1;
          continue;
        }

        const anchorId = products[0]?.id;
        if (!anchorId) {
          skipped += 1;
          continue;
        }

        const alreadySent = await prisma.notificationLog.findFirst({
          where: {
            userId: user.id,
            type: WEEKLY_DIGEST_TYPE,
            channel: "email",
            periodKey: weekKey,
          },
          select: { id: true },
        });

        if (alreadySent) {
          skipped += 1;
          continue;
        }

        try {
          const result = await sendWeeklyDigestEmail({
            to: user.email,
            userName: user.name,
            digest,
          });

          if (result.skipped) {
            if (result.reason === "quota") {
              quotaStopped = true;
              lastEmailError = friendlyEmailError(
                new EmailSendError("quota", "quota")
              );
              break;
            }
            skipped += 1;
            continue;
          }

          try {
            await prisma.notificationLog.create({
              data: {
                userId: user.id,
                productId: anchorId,
                type: WEEKLY_DIGEST_TYPE,
                channel: "email",
                periodKey: weekKey,
              },
            });
            emailsSent += 1;
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === "P2002"
            ) {
              skipped += 1;
            } else {
              throw error;
            }
          }
        } catch (error) {
          emailErrors += 1;
          lastEmailError = friendlyEmailError(error);
          console.error("CRON_DIGEST_EMAIL_ERROR", error);

          if (error instanceof EmailSendError && error.kind === "quota") {
            quotaStopped = true;
            break;
          }
        }
      }

      cursor = users.at(-1)?.id;
    }

    return jsonSuccess({
      success: true,
      weekKey,
      processed,
      emailsSent,
      skipped,
      quotaStopped,
      emailErrors,
      lastEmailError,
      emailSetup: {
        domainReady: emailStatus.domainReady,
        usingSharedSender: emailStatus.usingSharedSender,
        from: emailStatus.from,
        dailyLimit: emailStatus.dailyLimit,
      },
    });
  } catch (error) {
    console.error("CRON_DIGEST_ERROR", error);
    return jsonError(friendlyEmailError(error));
  }
}
