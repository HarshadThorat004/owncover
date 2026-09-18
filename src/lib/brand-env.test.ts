import { describe, expect, it } from "vitest";

import { getBrandDomain, getInboundDomain } from "@/lib/brand-env";

describe("brand env", () => {
  it("prefers NEXT_PUBLIC_BRAND_DOMAIN", () => {
    expect(
      getBrandDomain({ NEXT_PUBLIC_BRAND_DOMAIN: "owncover.hvtx.in" })
    ).toBe("owncover.hvtx.in");
  });

  it("derives the domain from NEXTAUTH_URL", () => {
    expect(
      getBrandDomain({ NEXTAUTH_URL: "https://owncover.hvtx.in/" })
    ).toBe("owncover.hvtx.in");
  });

  it("builds the inbound subdomain", () => {
    expect(
      getInboundDomain({
        NEXT_PUBLIC_BRAND_DOMAIN: "owncover.hvtx.in",
      })
    ).toBe("inbound.owncover.hvtx.in");
  });
});
