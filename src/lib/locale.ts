export type Locale = "en" | "hi";

export const LOCALE_COOKIE = "oc_lang";

export function parseLocale(value: string | null | undefined): Locale {
  return value === "hi" ? "hi" : "en";
}
