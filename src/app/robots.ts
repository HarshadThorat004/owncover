import type { MetadataRoute } from "next";

import { getAppBaseUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const base = getAppBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/invite"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
