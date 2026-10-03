import { describe, expect, it } from "vitest";

import { FAQS, faqsForHome } from "@/constants/faqs";
import {
  getHelpGuide,
  HELP_GUIDES,
  helpGuideChecklist,
} from "@/constants/help-guides";

describe("help guides", () => {
  it("publishes TV, fridge, phone, and AC category guides", () => {
    expect(HELP_GUIDES.map((guide) => guide.slug).sort()).toEqual([
      "ac",
      "fridge",
      "phone",
      "tv",
    ]);
  });

  it("attaches the matching service checklist", () => {
    const tv = getHelpGuide("tv");
    expect(tv).not.toBeNull();
    expect(helpGuideChecklist(tv!).items.some((item) => item.includes("claim pack"))).toBe(
      true
    );
    expect(getHelpGuide("unknown")).toBeNull();
  });
});

describe("faqs", () => {
  it("expands beyond a five-item marketing FAQ", () => {
    expect(FAQS.length).toBeGreaterThanOrEqual(12);
    expect(faqsForHome().length).toBeGreaterThanOrEqual(8);
    expect(FAQS.some((item) => /file warranty claims/i.test(item.q))).toBe(true);
    expect(FAQS.some((item) => /scan is wrong/i.test(item.q))).toBe(true);
    expect(FAQS.some((item) => /Hindi/i.test(item.q))).toBe(true);
  });
});

describe("Hindi help", () => {
  it("mirrors English desk-guide slugs and FAQ ids", async () => {
    const { FAQS_HI, hindiHelpSlugsMatchEnglish } = await import(
      "@/constants/help-hi"
    );
    const { FAQS } = await import("@/constants/faqs");

    expect(hindiHelpSlugsMatchEnglish()).toBe(true);
    expect(FAQS_HI.map((item) => item.id).sort()).toEqual(
      FAQS.map((item) => item.id).sort()
    );
  });
});
