import { describe, expect, it } from "vitest";

import { getAppBaseUrl } from "@/lib/app-url";

describe("getAppBaseUrl", () => {
  it("uses NEXTAUTH_URL and strips a trailing slash", () => {
    expect(
      getAppBaseUrl({ NEXTAUTH_URL: "https://owncover.in/" })
    ).toBe("https://owncover.in");
  });

  it("adds https when the origin has no protocol", () => {
    expect(getAppBaseUrl({ NEXTAUTH_URL: "owncover.in" })).toBe(
      "https://owncover.in"
    );
  });

  it("prefers the production domain on Vercel production", () => {
    expect(
      getAppBaseUrl({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "owncover.in",
        VERCEL_URL: "owncover-git-main.vercel.app",
      })
    ).toBe("https://owncover.in");
  });

  it("falls back to localhost", () => {
    expect(getAppBaseUrl({})).toBe("http://localhost:3000");
  });
});
