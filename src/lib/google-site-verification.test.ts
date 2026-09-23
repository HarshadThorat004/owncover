import { describe, expect, it } from "vitest";

import { getGoogleSiteVerificationToken } from "@/lib/google-site-verification";

describe("getGoogleSiteVerificationToken", () => {
  it("returns undefined when unset", () => {
    expect(getGoogleSiteVerificationToken({})).toBeUndefined();
  });

  it("accepts a bare token", () => {
    expect(
      getGoogleSiteVerificationToken({ GOOGLE_SITE_VERIFICATION: "abc123" })
    ).toBe("abc123");
  });

  it("extracts content from a pasted meta tag", () => {
    expect(
      getGoogleSiteVerificationToken({
        GOOGLE_SITE_VERIFICATION:
          '<meta name="google-site-verification" content="xyz789" />',
      })
    ).toBe("xyz789");
  });
});
