import type { ProductCategoryId } from "@/constants/catalog";
import { getServiceChecklist } from "@/constants/service-checklist";

export type HelpGuide = {
  slug: string;
  title: string;
  navLabel: string;
  category: ProductCategoryId;
  lede: string;
  notes: string[];
};

export const HELP_GUIDES: HelpGuide[] = [
  {
    slug: "tv",
    title: "TV warranty",
    navLabel: "TV",
    category: "tv_audio",
    lede: "Claims usually fail on model mismatch or a missing printed GST invoice — not on a screenshot in chat.",
    notes: [
      "Read the serial from the rear panel or the TV’s software menu. Match it to the invoice before you leave.",
      "Brand defects go to an authorised service centre. Extra years from a retailer are often claimed at that store.",
      "Carry the printed GST invoice, warranty card, this pack, and the remote if they ask to run a test.",
    ],
  },
  {
    slug: "fridge",
    title: "Fridge warranty",
    navLabel: "Fridge",
    category: "appliances",
    lede: "Fridge cover is often two clocks: the product, and a longer compressor warranty. Track both in the vault.",
    notes: [
      "Photograph the rating-plate serial inside the cabinet or on the back. Enter that in the vault — not a guess from the box.",
      "Compressor or PCB years can outlast the rest of the unit. Store or AMC cover is a third date if you bought it.",
      "Installation or demo papers matter when extra cover required a paid install. Bring them if you have them.",
    ],
  },
  {
    slug: "phone",
    title: "Phone warranty",
    navLabel: "Phone",
    category: "phones",
    lede: "The centre checks IMEI against the invoice. A locked screen or a mismatched serial stops the visit.",
    notes: [
      "Dial *#06# or open Settings → About and confirm IMEI matches the GST bill before you travel.",
      "Unlock Apple ID, Google account, and the screen lock. Many benches will not take a locked device.",
      "Amazon and Flipkart usually send you to the brand’s authorised centre for manufacturer cover.",
    ],
  },
  {
    slug: "ac",
    title: "AC warranty",
    navLabel: "AC",
    category: "appliances",
    lede: "Split ACs depend on installation papers and the outdoor-unit serial. The indoor sticker alone is not enough.",
    notes: [
      "Copy the serial from the outdoor unit rating plate, not only the indoor sticker.",
      "Compressor, PCB, and standard product cover can be three different end dates. Track manufacturer vs store or AMC separately.",
      "If extra cover required a company install, take the installation or commissioning report with the printed invoice.",
    ],
  },
];

export function getHelpGuide(slug: string) {
  return HELP_GUIDES.find((guide) => guide.slug === slug) ?? null;
}

export function helpGuideChecklist(guide: HelpGuide) {
  return getServiceChecklist(guide.category);
}

export const HELP_EXPLAINERS = [
  {
    id: "gst-scan",
    title: "How GST scan works",
    body: "QR on the tax invoice first — that payload already has invoice number, date, and amount when the seller encoded it. If the QR is missing or unreadable, on-device OCR looks at English and Hindi labels. Marketplace PDFs are parsed on the server. Unsure fields stay empty until you confirm.",
  },
  {
    id: "ocr-wrong",
    title: "What if the scan is wrong",
    body: "Scan is a starting point, not a guarantee. Fix the field or clear it. A wrong expiry in the vault becomes a wrong date on the pack. Empty is better. The printed GST invoice is still required — the pack does not replace it.",
  },
  {
    id: "print-pack",
    title: "How to use the claim pack",
    body: "Open the product, download the claim pack PDF, print it at home or a shop. Carry the printed tax invoice and warranty card as well. Keep the original invoice with you.",
  },
  {
    id: "covers",
    title: "Brand vs store cover",
    body: "Brand warranty is on the box. Store or AMC cover is extra time from a retailer or a paid plan. They can end on different days. OwnCover stores both so reminders fire against the cover that still runs.",
  },
  {
    id: "serial",
    title: "If the serial sticker is gone",
    body: "Use the rating plate, the software menu, *#06# on phones, the box, or the GST invoice. Type only what you can prove. A guessed serial fails when they scan the unit.",
  },
  {
    id: "desks",
    title: "Brand centre vs retailer cover",
    body: "Brand authorised centres handle manufacturer defects. Extra years from Croma, a dealer, or an AMC are often claimed at that retailer. Your pack lists both dates — use the cover that still applies.",
  },
] as const;
