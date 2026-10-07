import type { Locale } from "@/lib/locale";
import {
  needsYouSectionSubtitle,
  type NeedsYouItem,
  type ProductAttentionKind,
  type ProductAttentionReason,
} from "@/lib/product-attention";

const HI_ATTENTION: Record<ProductAttentionKind, string> = {
  duplicate: "संभावित डुप्लिकेट",
  serial: "सीरियल नंबर नहीं",
  expiring: "30 दिन में कवर समाप्त",
};

export const DASHBOARD_STRINGS = {
  en: {
    needsYou: "Needs you",
    open: "Open",
    onboarding: {
      eyebrow: "Get started",
      title: "Add your first invoice.",
      intro:
        "Scan a GST bill, confirm the dates, and OwnCover keeps the record and the reminders.",
      shared: " Anyone in this vault can add products — they show up for everyone.",
      scanTitle: "Scan a GST bill",
      scanBody:
        "Photo or PDF. QR first, then English and Hindi OCR. Empty is better than a wrong date.",
      packTitle: "Download a claim pack",
      packBody:
        "Invoice facts, serial, and cover dates in one PDF. Share or print when you raise a request.",
      remindersTitle: "Turn on reminders",
      remindersBody:
        "Email and browser at 30, 7, and 1 day before cover ends. Add .ics to Google or Apple Calendar.",
      forwardCta: "Forward an invoice",
      manualCta: "Or enter details by hand",
      sampleNote: (serial: string) =>
        `Sample TV is fictional (serial ${serial}). Same pack layout as yours. Delete it after you try the download.`,
      forwardTitle: "Amazon or Flipkart PDF in your inbox?",
      forwardBody: (domain: string) =>
        `Forward it to your private address on ${domain}. A draft is created. You confirm dates before it is saved.`,
    },
  },
  hi: {
    needsYou: "आपका ध्यान चाहिए",
    open: "खोलें",
    onboarding: {
      eyebrow: "शुरुआत करें",
      title: "अपना पहला इनवॉइस जोड़ें।",
      intro:
        "GST बिल स्कैन करें, तारीखें पक्की करें — OwnCover रिकॉर्ड और रिमाइंडर संभाल लेगा।",
      shared: " इस वॉल्ट में कोई भी प्रोडक्ट जोड़ सकता है — वो सबको दिखेंगे।",
      scanTitle: "GST बिल स्कैन करें",
      scanBody:
        "फ़ोटो या PDF। पहले QR, फिर अंग्रेज़ी और हिन्दी OCR। गलत तारीख से खाली बेहतर है।",
      packTitle: "क्लेम पैक डाउनलोड करें",
      packBody:
        "इनवॉइस की जानकारी, सीरियल और कवर की तारीखें एक PDF में। रिक्वेस्ट करते समय शेयर या प्रिंट करें।",
      remindersTitle: "रिमाइंडर चालू करें",
      remindersBody:
        "कवर खत्म होने से 30, 7 और 1 दिन पहले ईमेल और ब्राउज़र अलर्ट। Google या Apple Calendar में .ics जोड़ें।",
      forwardCta: "इनवॉइस फ़ॉरवर्ड करें",
      manualCta: "या खुद से डिटेल भरें",
      sampleNote: (serial: string) =>
        `सैंपल TV काल्पनिक है (सीरियल ${serial})। पैक का लेआउट आपके जैसा ही है। डाउनलोड आज़माने के बाद इसे डिलीट कर दें।`,
      forwardTitle: "Amazon या Flipkart का PDF इनबॉक्स में है?",
      forwardBody: (domain: string) =>
        `इसे ${domain} पर अपने निजी पते पर फ़ॉरवर्ड करें। एक ड्राफ़्ट बनेगा। सेव होने से पहले आप तारीखें पक्की करेंगे।`,
    },
  },
} satisfies Record<Locale, unknown>;

export function attentionLabel(reason: ProductAttentionReason, locale: Locale) {
  if (locale === "en") return reason.label;
  if (reason.kind === "expiring" && reason.daysRemaining != null) {
    return `${reason.daysRemaining} दिन बाकी · ${reason.coverLabel ?? "कवर"}`;
  }
  return HI_ATTENTION[reason.kind];
}

export function needsYouSubtitle(items: NeedsYouItem[], locale: Locale) {
  if (locale === "en") return needsYouSectionSubtitle(items);
  const kinds = new Set(items.map((item) => item.reason.kind));
  return (Object.keys(HI_ATTENTION) as ProductAttentionKind[])
    .filter((kind) => kinds.has(kind))
    .map((kind) => HI_ATTENTION[kind])
    .join(" · ");
}
