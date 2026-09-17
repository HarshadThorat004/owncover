import type { MetadataRoute } from "next";

import { getAppBaseUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppBaseUrl();

  return [
    "",
    "/login",
    "/register",
    "/sample-pack",
    "/help",
    "/help/tv",
    "/help/fridge",
    "/help/phone",
    "/help/ac",
    "/help/hi",
    "/help/hi/tv",
    "/help/hi/fridge",
    "/help/hi/phone",
    "/help/hi/ac",
    "/about",
    "/security",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
