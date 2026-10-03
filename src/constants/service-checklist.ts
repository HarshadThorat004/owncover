import type { ProductCategoryId } from "@/constants/catalog";

export type ServiceChecklist = {
  title: string;
  items: string[];
};

const PHONES: ServiceChecklist = {
  title: "What to carry for a phone warranty request",
  items: [
    "Printed GST tax invoice (SMS or order page is often not enough)",
    "Warranty card, or a screenshot of brand registration",
    "IMEI / serial that matches the device (*#06# or Settings > About)",
    "Device unlocked — Apple ID, Google account, and screen lock",
    "This claim pack PDF from OwnCover",
    "Original box only if this brand still asks for it",
  ],
};

const APPLIANCES: ServiceChecklist = {
  title: "What to carry for appliance warranty",
  items: [
    "Printed invoice with model and serial",
    "Warranty card (product vs compressor / PCB if they differ)",
    "Photo or note of the rating-plate serial on the machine",
    "Installation or demo report if the extra cover needs it",
    "This claim pack PDF from OwnCover",
  ],
};

const COMPUTERS: ServiceChecklist = {
  title: "What to carry for computer warranty",
  items: [
    "Printed invoice with serial / service tag",
    "Warranty card or on-site AMC papers",
    "Serial from the underside, BIOS, or lid — matches this product",
    "Back up files first; a bench repair can wipe the drive",
    "This claim pack PDF from OwnCover",
  ],
};

const TV_AUDIO: ServiceChecklist = {
  title: "What to carry for TV or audio warranty",
  items: [
    "Printed invoice with model number",
    "Warranty card",
    "Serial from the rear panel or software menu",
    "This claim pack PDF from OwnCover",
  ],
};

const OTHER: ServiceChecklist = {
  title: "Take when you file a claim",
  items: [
    "Printed invoice or tax invoice",
    "Warranty card or AMC papers",
    "Serial / model that matches the product",
    "This claim pack PDF from OwnCover",
  ],
};

const BY_CATEGORY: Record<ProductCategoryId, ServiceChecklist> = {
  phones: PHONES,
  wearables: PHONES,
  computers: COMPUTERS,
  gaming: COMPUTERS,
  tv_audio: TV_AUDIO,
  cameras: TV_AUDIO,
  appliances: APPLIANCES,
  kitchen: APPLIANCES,
  personal_care: OTHER,
  furniture: OTHER,
  fitness: OTHER,
  automotive: OTHER,
  power_tools: OTHER,
  other: OTHER,
};

export function getServiceChecklist(category?: string | null): ServiceChecklist {
  if (category && category in BY_CATEGORY) {
    return BY_CATEGORY[category as ProductCategoryId];
  }
  return OTHER;
}
