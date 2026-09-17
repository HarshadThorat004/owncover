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
    title: "TV desk visit",
    navLabel: "TV",
    category: "tv_audio",
    lede: "A TV claim usually fails on model mismatch or a missing printed tax invoice — not on the photo in WhatsApp.",
    notes: [
      "Read the serial from the rear panel or the TV’s software menu. Match it to the invoice before you leave.",
      "Brand defects go to an authorised service centre. Extra years from a retailer are often claimed at that store.",
      "Carry the printed GST invoice, warranty card, this pack, and the remote if they ask to run a test.",
    ],
  },
  {
    slug: "fridge",
    title: "Fridge desk visit",
    navLabel: "Fridge",
    category: "appliances",
    lede: "Fridge cover is often two clocks: the product, and a longer compressor warranty. The desk will ask which one you mean.",
    notes: [
      "Photograph the rating-plate serial inside the cabinet or on the back. Enter that in the vault — not a guess from the box.",
      "Compressor or PCB years can outlast the rest of the unit. Store or AMC cover is a third date if you bought it.",
      "Installation or demo papers matter when extra cover required a paid install. Bring them if you have them.",
    ],
  },
  {
    slug: "phone",
    title: "Phone desk visit",
    navLabel: "Phone",
    category: "phones",
    lede: "The counter checks IMEI against the invoice. A locked screen or a mismatched serial ends the visit.",
    notes: [
      "Dial *#06# or open Settings → About and confirm IMEI matches the GST bill before you travel.",
      "Unlock Apple ID, Google account, and the screen lock. Many benches will not take a locked device.",
      "Brand ASC handles manufacturer cover. Amazon and Flipkart usually send you there — not to a marketplace desk.",
    ],
  },
  {
    slug: "ac",
    title: "AC desk visit",
    navLabel: "AC",
    category: "appliances",
    lede: "Split ACs live or die on installation papers and the outdoor-unit serial. A photo of the indoor panel is not enough.",
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
    body: "QR on the tax invoice first — that payload already has invoice number, date, and amount when the seller encoded it. If the QR is missing or unreadable, on-device OCR looks at English and Hindi labels. Marketplace PDFs are parsed on the server because browsers cannot reliably extract that text. Unsure fields stay empty. You confirm dates before save.",
  },
  {
    id: "ocr-wrong",
    title: "What if the scan is wrong",
    body: "Scan is a starting point, not a guarantee. Fix the field or clear it. A wrong expiry in the vault becomes a wrong date on the pack. Empty is better. The desk will still want the printed GST invoice — the pack does not replace it.",
  },
  {
    id: "print-pack",
    title: "How to print the pack",
    body: "Open the product, download the claim pack PDF, print it at home or a shop. Carry the printed tax invoice and warranty card as well. Do not leave originals at the counter. The pack is a desk checklist plus the facts we stored — not a filing we submit.",
  },
  {
    id: "covers",
    title: "Manufacturer vs store cover",
    body: "Manufacturer cover is the brand warranty. Store or AMC cover is extra time from a retailer or a paid plan. They can end on different days and at different desks. OwnCover stores both so reminders fire against the cover that still matters.",
  },
  {
    id: "serial",
    title: "If the serial sticker is gone",
    body: "Use the rating plate, the software menu, *#06# on phones, the box, or the GST invoice. Type only what you can prove. A guessed serial fails when they scan the unit.",
  },
  {
    id: "desks",
    title: "Croma desk vs brand service centre",
    body: "Brand authorised service centres handle manufacturer defects. Extra years bought at Croma, a dealer, or an AMC are often claimed at that store. Amazon and Flipkart usually send you to the brand. Take the pack to the desk whose date still covers the fault. We do not choose the desk for you.",
  },
] as const;
