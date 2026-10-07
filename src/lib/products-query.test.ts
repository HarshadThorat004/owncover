import { describe, expect, it } from "vitest";

import { parseDashboardProductListParams } from "@/lib/products-query";

describe("parseDashboardProductListParams", () => {
  it("maps attention filter and search", () => {
    const params = parseDashboardProductListParams(
      new URLSearchParams("filter=attention&q=tv&cursor=abc&limit=12")
    );

    expect(params.filter).toBe("attention");
    expect(params.q).toBe("tv");
    expect(params.cursor).toBe("abc");
    expect(params.limit).toBe(12);
  });

  it("defaults filter to all", () => {
    const params = parseDashboardProductListParams(new URLSearchParams());
    expect(params.filter).toBe("all");
  });
});
