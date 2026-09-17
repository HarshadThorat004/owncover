export type FaqItem = {
  id: string;
  q: string;
  a: string;
};

/** Real objections. Homepage shows a subset; /help shows all. */
export const FAQS: FaqItem[] = [
  {
    id: "what",
    q: "What does OwnCover actually do?",
    a: "It keeps GST invoices, serials, and expiry dates in one vault, then builds a claim pack you can take to a brand or retailer desk. We do not file claims or run the service centre.",
  },
  {
    id: "file-claims",
    q: "Do you file the claim or call the brand?",
    a: "No. OwnCover does not call Samsung, LG, Croma, Amazon, or anyone else on your behalf. We get the invoice, serial, and dates onto one printed page. You still walk into the desk.",
  },
  {
    id: "gst-scan",
    q: "How does GST scan work?",
    a: "We read the invoice QR first. If that fails, on-device OCR looks at English and Hindi labels. Unsure fields stay empty — you confirm dates before anything is saved.",
  },
  {
    id: "scan-wrong",
    q: "What if the scan is wrong?",
    a: "Treat it as a draft. Fix the date, serial, or amount before you save. Empty is better than a wrong expiry. The pack only prints what you confirmed.",
  },
  {
    id: "claim-pack",
    q: "What is a claim pack?",
    a: "A PDF with invoice facts, serial, cover dates, and a desk checklist. Print it at home or a shop. Do not leave originals behind.",
  },
  {
    id: "covers",
    q: "What is manufacturer cover vs store cover?",
    a: "Manufacturer cover is the brand warranty on the box. Store or AMC cover is extra time from Croma, the dealer, or a paid plan — often a different desk and a different date. OwnCover tracks them separately so you know which one still runs.",
  },
  {
    id: "desks",
    q: "Croma or Amazon desk, or the brand service centre?",
    a: "Defects under brand warranty usually go to an authorised service centre. Extra years you bought at Croma, a dealer, or with an AMC are often claimed at that store. Amazon and Flipkart typically point you to the brand. Your pack lists both dates — take it to the desk that still covers the fault.",
  },
  {
    id: "serial",
    q: "What if the serial sticker is gone?",
    a: "Check the rating plate, the software menu, *#06# for phones, the box, and the GST invoice. Enter what you can prove. Leave the field empty if you are guessing — a wrong serial fails at the counter.",
  },
  {
    id: "forward",
    q: "Can I forward Amazon or Flipkart invoices?",
    a: "Yes. After you sign in, Settings shows a private address on inbound.owncover.in. Forward the invoice PDF. We start a draft — you confirm dates before it is saved.",
  },
  {
    id: "reminders",
    q: "What reminders do I get?",
    a: "Email and optional browser alerts at 30 days, 7 days, and the day before manufacturer or store cover ends. Mondays you also get a vault digest if something needs you — expiry inside 30 days, a missing serial, or an invoice still in draft. You can download a calendar file for Google or Apple Calendar.",
  },
  {
    id: "household",
    q: "Can a shop, gym, or family share one vault?",
    a: "Yes. Invite people you trust — family at home, or staff at a shop, gym, or office. Everyone you invite sees the same products and documents. Each person still has their own sign-in. Up to five people.",
  },
  {
    id: "ai",
    q: "Do you use my invoices to train AI?",
    a: "No. We do not sell personal data and we do not use your warranty documents to train public models. Scan is QR first, then OCR. You confirm every date.",
  },
  {
    id: "sample",
    q: "Can I see a pack before I sign up?",
    a: "Yes. Open the sample claim pack — a fictional TV with invoice facts, cover dates, and a desk checklist. Your own pack uses the same layout.",
  },
  {
    id: "free",
    q: "Is it free?",
    a: "Yes. No card. Vault, scan, reminders, claim pack, and sharing are included for homes, shops, gyms, offices, and similar. If we ever charge for extra storage or SMS, it will be on the pricing page first.",
  },
  {
    id: "delete",
    q: "Can I delete everything?",
    a: "Yes. Delete a product, or delete the account from Settings. Uploaded files are removed from storage. Export CSV or a pack first if you want a copy.",
  },
  {
    id: "hindi",
    q: "Is help available in Hindi?",
    a: "Yes. Desk guides and the same answers are on the Hindi help pages. The rest of the site is still English — we started with the morning at the desk.",
  },
];

export const HOME_FAQ_IDS = [
  "what",
  "file-claims",
  "gst-scan",
  "scan-wrong",
  "claim-pack",
  "covers",
  "forward",
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
