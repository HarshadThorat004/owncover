import { Resend } from "resend";

import {
  BRAND_CONTACT_EMAIL,
  BRAND_DOMAIN,
  BRAND_FROM_EMAIL,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/constants/brand";
import { EMAIL_HI } from "@/constants/email-hi";
import { getAppBaseUrl } from "@/lib/app-url";
import type { Locale } from "@/lib/locale";
import { consumeRateLimit } from "@/lib/rate-limit";
import type { WeeklyDigest } from "@/lib/weekly-digest";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const DEFAULT_FROM = BRAND_FROM_EMAIL;
const DEFAULT_REPLY_TO = BRAND_CONTACT_EMAIL;
const DEFAULT_DOMAIN_FROM = BRAND_FROM_EMAIL;

/** Resend free tier is 100/day — keep a small buffer for OTP + tests. */
export const RESEND_FREE_DAILY_LIMIT = 95;

export type EmailErrorKind =
  | "quota"
  | "domain"
  | "test_recipient"
  | "config"
  | "unknown";

export class EmailSendError extends Error {
  kind: EmailErrorKind;
  statusCode?: number;
  code?: string;

  constructor(
    message: string,
    kind: EmailErrorKind = "unknown",
    extras?: { statusCode?: number; code?: string }
  ) {
    super(message);
    this.name = "EmailSendError";
    this.kind = kind;
    this.statusCode = extras?.statusCode;
    this.code = extras?.code;
  }
}

type ReminderEmailInput = {
  to: string;
  userName: string | null;
  productName: string;
  brand: string | null;
  type: string;
  expiryDate: Date | null;
  renewalNotes?: string | null;
  coverLabel?: string | null;
  locale?: Locale;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function reminderSubject(type: string, coverLabel?: string | null) {
  const cover = coverLabel || "Warranty";
  const subjects: Record<string, string> = {
    expiring_30: `${cover} reminder: expires in 30 days`,
    expiring_7: `Urgent: ${cover.toLowerCase()} expires in 7 days`,
    expiring_1: `${cover} expires tomorrow`,
    expired: `${cover} has expired`,
    renewal_available: "Warranty renewal available",
  };
  return subjects[type] ?? "Warranty reminder";
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
}

function getReplyTo() {
  return process.env.RESEND_REPLY_TO || DEFAULT_REPLY_TO;
}

export function isUsingSharedTestSender() {
  const from = getFrom().toLowerCase();
  return from.includes("onboarding@resend.dev") || from.includes("@resend.dev");
}

export function getResendTestRecipient() {
  return (
    process.env.RESEND_TEST_RECIPIENT ||
    process.env.RESEND_REPLY_TO ||
    BRAND_CONTACT_EMAIL
  )
    .trim()
    .toLowerCase();
}

export function getEmailProviderStatus() {
  const configured = Boolean(process.env.RESEND_API_KEY);
  const usingSharedSender = isUsingSharedTestSender();
  const domainReady = configured && !usingSharedSender;

  return {
    configured,
    usingSharedSender,
    domainReady,
    from: getFrom(),
    replyTo: getReplyTo(),
    recommendedFrom: DEFAULT_DOMAIN_FROM,
    dailyLimit: RESEND_FREE_DAILY_LIMIT,
    testRecipient: getResendTestRecipient() || null,
  };
}

function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function reserveDailyEmailSlot() {
  const limit = Number(process.env.RESEND_DAILY_LIMIT || RESEND_FREE_DAILY_LIMIT);
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : RESEND_FREE_DAILY_LIMIT;

  return consumeRateLimit({
    key: `resend:daily:${utcDayKey()}`,
    limit: safeLimit,
    windowMs: 24 * 60 * 60 * 1000,
  });
}

export function classifyResendError(error: unknown): EmailErrorKind {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();

  if (
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("daily") ||
    message.includes("monthly")
  ) {
    return "quota";
  }

  if (
    message.includes("only send testing emails") ||
    message.includes("own email address") ||
    message.includes("please use our testing email address") ||
    message.includes("invalid `to` field") ||
    message.includes("invalid 'to' field")
  ) {
    return "test_recipient";
  }

  if (
    message.includes("verify a domain") ||
    message.includes("domain is not verified") ||
    message.includes("from domain") ||
    message.includes("not authorized to send")
  ) {
    return "domain";
  }

  return "unknown";
}

export function isResendTestRecipientRestriction(error: unknown) {
  return classifyResendError(error) === "test_recipient";
}

export function isResendQuotaError(error: unknown) {
  return classifyResendError(error) === "quota";
}

export function friendlyEmailError(error: unknown) {
  if (error instanceof EmailSendError) {
    if (error.kind === "quota") {
      return "Email daily limit reached (Resend free tier ~100/day). Try again tomorrow.";
    }
    if (error.kind === "domain") {
      return `Email domain is not verified in Resend yet. Verify ${BRAND_DOMAIN} and set RESEND_FROM_EMAIL to noreply@${BRAND_DOMAIN}.`;
    }
    if (error.kind === "test_recipient") {
      const allowed = getResendTestRecipient();
      return allowed
        ? `Until your domain is verified, emails can only be sent to ${allowed}.`
        : "Until your domain is verified, Resend can only email your account owner address.";
    }
    if (error.kind === "config") {
      return "Email is not configured. Set RESEND_API_KEY.";
    }
    return error.message;
  }

  const kind = classifyResendError(error);
  if (kind === "quota") {
    return "Email daily limit reached (Resend free tier ~100/day). Try again tomorrow.";
  }
  if (kind === "domain") {
    return `Email domain is not verified in Resend yet. Verify ${BRAND_DOMAIN} and set RESEND_FROM_EMAIL to noreply@${BRAND_DOMAIN}.`;
  }
  if (kind === "test_recipient") {
    const allowed = getResendTestRecipient();
    return allowed
      ? `Until your domain is verified, emails can only be sent to ${allowed}.`
      : "Until your domain is verified, Resend can only email your account owner address.";
  }

  return error instanceof Error && error.message
    ? error.message
    : "Failed to send email";
}

function brandEmailHeader() {
  return `<h2 style="margin:0 0 4px;">${BRAND_NAME}</h2>
      <p style="margin:0 0 20px;color:#666;font-size:12px;">${BRAND_TAGLINE}</p>`;
}

function buildBody(input: ReminderEmailInput) {
  const name = input.userName || "there";
  const brand = input.brand ? ` (${input.brand})` : "";
  const expiry = input.expiryDate
    ? input.expiryDate.toLocaleDateString(
        input.locale === "hi" ? "hi-IN" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "N/A";

  if (input.locale === "hi") {
    return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
      ${brandEmailHeader()}
      <p>${EMAIL_HI.greeting(input.userName)}</p>
      <p>${EMAIL_HI.reminderMessage({
        type: input.type,
        product: `<strong>${input.productName}${brand}</strong>`,
        expiry,
        coverLabel: input.coverLabel,
        renewalNotes: input.renewalNotes,
      })}</p>
      <p>${EMAIL_HI.reminderAction}</p>
      <p style="color:#666;font-size:12px;margin-top:24px;">${EMAIL_HI.reminderFooter}</p>
    </div>
  `;
  }

  const cover = input.coverLabel || "warranty";
  const messages: Record<string, string> = {
    expiring_30: `Your ${cover.toLowerCase()} for <strong>${input.productName}${brand}</strong> expires on <strong>${expiry}</strong> (within 30 days).`,
    expiring_7: `Urgent: your ${cover.toLowerCase()} for <strong>${input.productName}${brand}</strong> expires on <strong>${expiry}</strong> (within 7 days).`,
    expiring_1: `Your ${cover.toLowerCase()} for <strong>${input.productName}${brand}</strong> expires tomorrow (<strong>${expiry}</strong>).`,
    expired: `Your ${cover.toLowerCase()} for <strong>${input.productName}${brand}</strong> expired on <strong>${expiry}</strong>.`,
    renewal_available: `A renewal option is available for <strong>${input.productName}${brand}</strong>.${
      input.renewalNotes ? ` Notes: ${input.renewalNotes}` : ""
    }`,
  };

  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
      ${brandEmailHeader()}
      <p>Hi ${name},</p>
      <p>${messages[input.type] ?? "You have a warranty update."}</p>
      <p>Log in to your dashboard to review documents and take action.</p>
      <p style="color:#666;font-size:12px;margin-top:24px;">You received this because you have reminders enabled in OwnCover.</p>
    </div>
  `;
}

function buildTestBody() {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
      ${brandEmailHeader()}
      <p>Hi there,</p>
      <p>This is a test email from <strong>OwnCover</strong>. Reminder delivery is working.</p>
      <p>If you reply to this message, it will go to our support inbox.</p>
      <p style="color:#666;font-size:12px;margin-top:24px;">You can ignore this message if you received it during setup.</p>
    </div>
  `;
}

async function sendViaResend(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    throw new EmailSendError(
      "RESEND_API_KEY is not configured",
      "config"
    );
  }

  const quota = reserveDailyEmailSlot();
  if (!quota.success) {
    throw new EmailSendError(
      "Resend free daily email limit reached",
      "quota",
      { statusCode: 429 }
    );
  }

  const result = await resend.emails.send({
    from: getFrom(),
    replyTo: getReplyTo(),
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (result.error) {
    const message = result.error.message || "Failed to send email";
    const kind = classifyResendError(message);
    throw new EmailSendError(message, kind, {
      code: result.error.name,
      statusCode:
        typeof (result.error as { statusCode?: number }).statusCode === "number"
          ? (result.error as { statusCode?: number }).statusCode
          : undefined,
    });
  }

  return {
    id: result.data?.id ?? null,
  };
}

export async function sendReminderEmail(input: ReminderEmailInput) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping email send");
    return { skipped: true as const, reason: "config" as const };
  }

  try {
    await sendViaResend({
      to: input.to,
      subject:
        input.locale === "hi"
          ? EMAIL_HI.reminderSubject(input.type, input.coverLabel)
          : reminderSubject(input.type, input.coverLabel),
      html: buildBody(input),
    });
    return { skipped: false as const };
  } catch (error) {
    if (error instanceof EmailSendError && error.kind === "quota") {
      return { skipped: true as const, reason: "quota" as const };
    }
    throw error;
  }
}

export async function sendWeeklyDigestEmail(input: {
  to: string;
  userName: string | null;
  digest: WeeklyDigest;
  locale?: Locale;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping digest send");
    return { skipped: true as const, reason: "config" as const };
  }

  try {
    await sendViaResend({
      to: input.to,
      subject:
        input.locale === "hi"
          ? EMAIL_HI.digestSubject
          : `${BRAND_NAME} — this week in your vault`,
      html: buildDigestBody(input),
    });
    return { skipped: false as const };
  } catch (error) {
    if (error instanceof EmailSendError && error.kind === "quota") {
      return { skipped: true as const, reason: "quota" as const };
    }
    throw error;
  }
}

function digestList(title: string, lines: { name: string; detail: string }[]) {
  if (lines.length === 0) return "";

  const items = lines
    .slice(0, 8)
    .map(
      (line) =>
        `<li style="margin:0 0 8px;"><strong>${escapeHtml(line.name)}</strong><br/><span style="color:#666;font-size:13px;">${escapeHtml(line.detail)}</span></li>`
    )
    .join("");

  return `<h3 style="margin:20px 0 8px;font-size:15px;">${escapeHtml(title)}</h3><ul style="padding-left:18px;margin:0;">${items}</ul>`;
}

function buildDigestBody(input: {
  userName: string | null;
  digest: WeeklyDigest;
  locale?: Locale;
}) {
  const name = escapeHtml(input.userName?.trim() || "there");
  const dashboard = `${getAppBaseUrl()}/dashboard`;

  if (input.locale === "hi") {
    const userName = input.userName?.trim();
    return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
      ${brandEmailHeader()}
      <p>${EMAIL_HI.greeting(userName ? escapeHtml(userName) : null)}</p>
      <p>${EMAIL_HI.digestIntro}</p>
      ${digestList(EMAIL_HI.digestExpiring, input.digest.expiring)}
      ${digestList(EMAIL_HI.digestMissingSerial, input.digest.missingSerial)}
      ${input.digest.inboundDrafts > 0 ? `<p>${EMAIL_HI.digestDrafts(input.digest.inboundDrafts)}</p>` : ""}
      <p style="margin: 24px 0;">
        <a href="${dashboard}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600;">
          ${EMAIL_HI.digestCta}
        </a>
      </p>
      <p style="color:#666;font-size:12px;margin-top:24px;">${EMAIL_HI.digestFooter}</p>
    </div>
  `;
  }
  const drafts =
    input.digest.inboundDrafts > 0
      ? `<p>${input.digest.inboundDrafts} forwarded invoice${
          input.digest.inboundDrafts === 1 ? "" : "s"
        } waiting to confirm.</p>`
      : "";

  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
      ${brandEmailHeader()}
      <p>Hi ${name},</p>
      <p>A short look at the vault — what expires soon, what is missing a serial, and invoices still in draft.</p>
      ${digestList("Cover ending in 30 days", input.digest.expiring)}
      ${digestList("Missing serial", input.digest.missingSerial)}
      ${drafts}
      <p style="margin: 24px 0;">
        <a href="${dashboard}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600;">
          Open dashboard
        </a>
      </p>
      <p style="color:#666;font-size:12px;margin-top:24px;">Monday vault mail. Quiet weeks stay quiet — we only send when there is something to do.</p>
    </div>
  `;
}

export async function sendInboundDraftEmail(input: {
  to: string;
  userName: string | null;
  subject: string | null;
  fileCount: number;
  draftId: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping inbound draft email");
    return { skipped: true as const, reason: "config" as const };
  }

  const name = escapeHtml(input.userName?.trim() || "there");
  const reviewUrl = `${getAppBaseUrl()}/dashboard/add-product?draft=${input.draftId}`;
  const what = input.subject
    ? `<strong>${escapeHtml(input.subject)}</strong>`
    : "your forwarded invoice";
  const files =
    input.fileCount > 0
      ? `We read ${input.fileCount} attachment${input.fileCount === 1 ? "" : "s"} and filled what we could.`
      : "We did not find a usable attachment, so you may need to upload the bill.";

  try {
    await sendViaResend({
      to: input.to,
      subject: `${BRAND_NAME} — invoice waiting to confirm`,
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
          ${brandEmailHeader()}
          <p>Hi ${name},</p>
          <p>${what} landed in your vault as a draft. ${files}</p>
          <p>Check the dates and save it so reminders can start.</p>
          <p style="margin: 24px 0;">
            <a href="${reviewUrl}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600;">
              Review invoice
            </a>
          </p>
        </div>
      `,
    });
    return { skipped: false as const };
  } catch (error) {
    if (error instanceof EmailSendError && error.kind === "quota") {
      return { skipped: true as const, reason: "quota" as const };
    }
    throw error;
  }
}

export async function sendTestEmail(to: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping email send");
    return { skipped: true as const, id: null, reason: "config" as const };
  }

  const result = await sendViaResend({
    to,
    subject: `${BRAND_NAME} — test email`,
    html: buildTestBody(),
  });

  return { skipped: false as const, id: result.id };
}

export async function sendOtpEmail(to: string, code: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping OTP email");
    return { skipped: true as const, reason: "config" as const };
  }

  await sendViaResend({
    to,
    subject: `Your ${BRAND_NAME} sign-in code`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
        ${brandEmailHeader()}
        <p>Use this one-time code to sign in:</p>
        <p style="font-size: 28px; letter-spacing: 6px; font-weight: 700; margin: 20px 0;">${code}</p>
        <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
      </div>
    `,
  });

  return { skipped: false as const };
}

export async function sendHouseholdInviteEmail(input: {
  to: string;
  inviterName: string | null;
  inviterEmail: string;
  householdName: string;
  acceptUrl: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping household invite email");
    return { skipped: true as const, reason: "config" as const };
  }

  const who = escapeHtml(input.inviterName?.trim() || input.inviterEmail);
  const vaultName = escapeHtml(input.householdName);

  await sendViaResend({
    to: input.to,
    subject: `${input.inviterName?.trim() || input.inviterEmail} invited you to a shared ${BRAND_NAME} vault`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
        ${brandEmailHeader()}
        <p>${who} invited you to share <strong>${vaultName}</strong> — one vault for invoices, warranties, and expiry reminders.</p>
        <p style="margin: 24px 0;">
          <a href="${input.acceptUrl}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600;">
            Join vault
          </a>
        </p>
        <p>This invite expires in 7 days. If you did not expect this, you can ignore the email.</p>
      </div>
    `,
  });

  return { skipped: false as const };
}
