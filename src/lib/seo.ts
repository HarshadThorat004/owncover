import {
  BRAND_CONTACT_EMAIL,
  BRAND_DESCRIPTION,
  BRAND_FOUNDER,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/constants/brand";
import type { FaqItem } from "@/constants/faqs";
import { getAppBaseUrl } from "@/lib/app-url";

export const BRAND_KEYWORDS = [
  "OwnCover",
  "own cover",
  "warranty tracker India",
  "warranty vault",
  "GST invoice scanner",
  "product warranty reminder",
  "claim pack PDF",
  "manufacturer warranty",
  "store warranty",
  "service centre checklist",
  "warranty app India",
  "invoice warranty tracker",
] as const;

export function buildOrganizationJsonLd(baseUrl = getAppBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: baseUrl,
    logo: `${baseUrl}/brand/logo-mark.svg`,
    email: BRAND_CONTACT_EMAIL,
    founder: {
      "@type": "Person",
      name: BRAND_FOUNDER,
    },
    slogan: BRAND_TAGLINE,
    description: BRAND_DESCRIPTION,
  };
}

export function buildWebSiteJsonLd(baseUrl = getAppBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: baseUrl,
    description: BRAND_DESCRIPTION,
    inLanguage: ["en-IN", "hi-IN"],
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
  };
}

export function buildFaqPageJsonLd(faqs: FaqItem[], baseUrl = getAppBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: `${baseUrl}/#faq`,
  };
}

export function buildSoftwareApplicationJsonLd(baseUrl = getAppBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    url: baseUrl,
    description: BRAND_DESCRIPTION,
  };
}
