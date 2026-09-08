export const PRODUCT_CATEGORIES = [
  { id: "phones", label: "Phones & tablets" },
  { id: "computers", label: "Computers & laptops" },
  { id: "wearables", label: "Smartwatch & wearables" },
  { id: "tv_audio", label: "TV & audio" },
  { id: "cameras", label: "Camera & photography" },
  { id: "gaming", label: "Gaming & consoles" },
  { id: "appliances", label: "Home appliances" },
  { id: "kitchen", label: "Kitchen appliances" },
  { id: "personal_care", label: "Personal care & grooming" },
  { id: "furniture", label: "Furniture & décor" },
  { id: "fitness", label: "Fitness & sports" },
  { id: "automotive", label: "Automotive" },
  { id: "power_tools", label: "Power tools & hardware" },
  { id: "other", label: "Other" },
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]["id"];

export function categoryLabel(id: string | null | undefined) {
  return PRODUCT_CATEGORIES.find((item) => item.id === id)?.label ?? id ?? "";
}

export const EXTENDED_COVER_TYPES = [
  { id: "store", label: "Store / retailer" },
  { id: "extended", label: "Brand extended" },
  { id: "amc", label: "AMC" },
  { id: "insurance", label: "Insurance" },
] as const;

export type ExtendedCoverId = (typeof EXTENDED_COVER_TYPES)[number]["id"];

export function extendedCoverLabel(id: string | null | undefined) {
  return (
    EXTENDED_COVER_TYPES.find((item) => item.id === id)?.label ??
    "Store / extended"
  );
}
