import { getBrandDomain, getInboundDomain } from "@/lib/brand-env";

export const BRAND_NAME = "OwnCover";
export const BRAND_DOMAIN = getBrandDomain();
/** Public contact + reply-to. Outbound From stays on the verified domain (Resend). */
export const BRAND_CONTACT_EMAIL = "owncover.in@gmail.com";
export const BRAND_FROM_EMAIL = `${BRAND_NAME} <noreply@${BRAND_DOMAIN}>`;
export const BRAND_INBOUND_DOMAIN = getInboundDomain();

/** Single line used on header, footer, SEO, PWA, and emails. */
export const BRAND_TAGLINE = "Desk-ready, not desk-side.";

export const BRAND_DESCRIPTION =
  "OwnCover is a warranty tracker for India. Scan GST invoices, track manufacturer vs store cover, and download a claim pack before you visit the service desk.";

export const BRAND_TITLE = `${BRAND_NAME} — ${BRAND_TAGLINE.replace(/\.$/, "")}`;

export const BRAND_FOUNDER = "Harshad Thorat";
