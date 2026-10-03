export type FaqItem = {
  id: string;
  q: string;
  a: string;
};

export const FAQS: FaqItem[] = [
  {
    id: "what",
    q: "What does OwnCover store?",
    a: "GST invoices, serial numbers, brand and store cover dates, and the files you attach to each product. Reminders go out before a cover ends.",
  },
  {
    id: "file-claims",
    q: "Does OwnCover file warranty claims?",
    a: "No. OwnCover organises your records and builds a claim pack PDF. You raise the request with the brand, retailer, or AMC provider.",
  },
  {
    id: "gst-scan",
    q: "How does GST invoice scan work?",
    a: "The GST QR is read first. If it cannot be read, on-device OCR looks at English and Hindi labels. You confirm every date before anything is saved.",
  },
  {
    id: "scan-wrong",
    q: "What if the scan is wrong?",
    a: "Treat it as a draft. Fix the date, serial, or amount before you save. Empty is better than a wrong expiry. The pack only prints what you confirmed.",
  },
  {
    id: "claim-pack",
    q: "What is a claim pack?",
    a: "A PDF with invoice facts, serial number, cover dates, and a short checklist. Share or print it when you raise a warranty request.",
  },
  {
    id: "covers",
    q: "Brand warranty vs store or AMC cover?",
    a: "Brand warranty is on the box. Store or AMC cover is extra time from Croma, the dealer, or a paid plan — often a different end date. OwnCover tracks them separately.",
  },
  {
    id: "desks",
    q: "Where do I raise a claim?",
    a: "Manufacturer defects usually go to the brand’s authorised centre. Extra years from a retailer or AMC are often handled there. Your pack lists both dates so you know which cover still runs.",
  },
  {
    id: "serial",
    q: "What if the serial sticker is gone?",
    a: "Check the rating plate, software menu, *#06# on phones, the box, and the GST invoice. Enter what you can prove. Leave the field empty if you are guessing.",
  },
  {
    id: "forward",
    q: "Can I forward Amazon or Flipkart invoices?",
    a: "Yes. Settings shows a private inbound address. Forward the invoice PDF. We start a draft — you confirm dates before it is saved.",
  },
  {
    id: "reminders",
    q: "When do reminders arrive?",
    a: "By email, and by browser notification if you turn them on — 30 days, 7 days, and 1 day before brand or store cover ends. You can also download a calendar file.",
  },
  {
    id: "household",
    q: "Can family share one vault?",
    a: "Yes. Invite up to five people. Everyone sees the same products, documents, and reminders. Each person keeps their own sign-in.",
  },
  {
    id: "ai",
    q: "Do you use my invoices to train AI?",
    a: "No. We do not sell personal data and we do not use your warranty documents to train public models.",
  },
  {
    id: "sample",
    q: "Can I see a pack before I sign up?",
    a: "Yes. Open the sample claim pack — a fictional TV with the same layout as your own products.",
  },
  {
    id: "free",
    q: "Is it free?",
    a: "Yes. No card. Vault, scan, reminders, claim pack, and sharing are included. If we ever charge for extra storage or SMS, it will be on the pricing page first.",
  },
  {
    id: "delete",
    q: "Can I delete everything?",
    a: "Yes. Delete a product, or delete the account from Settings. Export CSV or a pack first if you want a copy.",
  },
  {
    id: "hindi",
    q: "Is help available in Hindi?",
    a: "Yes. Category guides and FAQs are on the Hindi help pages. The rest of the site is in English.",
  },
];

export const HOME_FAQ_IDS = [
  "what",
  "gst-scan",
  "scan-wrong",
  "claim-pack",
  "covers",
  "forward",
  "reminders",
  "household",
  "sample",
  "free",
] as const;

export function faqsForHome() {
  const byId = new Map(FAQS.map((item) => [item.id, item]));
  return HOME_FAQ_IDS.map((id) => byId.get(id)).filter(
    (item): item is FaqItem => Boolean(item)
  );
}
