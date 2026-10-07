import { describe, expect, it } from "vitest";

import {
  buildSupportReply,
  describeVault,
  isVaultQuestion,
  matchHelpEntries,
} from "@/lib/support-chat";

describe("matchHelpEntries", () => {
  it.each([
    ["How does the GST invoice scan work?", "gst-scan"],
    ["What is in the claim pack PDF?", "claim-pack"],
    ["When do warranty reminders go out?", "reminders"],
    ["Can I forward my Flipkart invoice?", "forward"],
    ["My TV stopped working", "guide:tv"],
  ])("matches %s", (query, expected) => {
    const [best] = matchHelpEntries(query);
    expect(best?.id).toContain(expected);
  });

  it("returns nothing for unrelated text", () => {
    expect(matchHelpEntries("banana smoothie recipe")).toEqual([]);
  });
});

describe("vault questions", () => {
  it("detects vault intent", () => {
    expect(isVaultQuestion("What is expiring soon?")).toBe(true);
    expect(isVaultQuestion("How many products do I have")).toBe(true);
    expect(isVaultQuestion("How does GST scan work")).toBe(false);
  });

  it("asks signed-out users to sign in", () => {
    const reply = buildSupportReply("what is expiring soon", null);
    expect(reply.links[0]?.href).toBe("/login");
  });

  it("summarises the vault", () => {
    expect(
      describeVault({
        totalProducts: 3,
        expiringProducts: 1,
        expiredProducts: 0,
        missingSerial: 2,
        attentionProducts: 2,
      })
    ).toBe(
      "You have 3 products in the vault. 1 cover end within 30 days. 2 products still need a serial number."
    );
  });
});
