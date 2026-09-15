import { describe, expect, it } from "vitest";

import { isCronAuthorized } from "@/lib/cron-auth";

describe("isCronAuthorized", () => {
  it("rejects requests when CRON_SECRET is missing", () => {
    const request = new Request("https://owncover.in/api/cron/reminders", {
      headers: { authorization: "Bearer secret" },
    });

    expect(isCronAuthorized(request, {})).toBe(false);
  });

  it("accepts the Vercel cron bearer token", () => {
    const request = new Request("https://owncover.in/api/cron/reminders", {
      headers: { authorization: "Bearer deploy-secret" },
    });

    expect(isCronAuthorized(request, { CRON_SECRET: "deploy-secret" })).toBe(
      true
    );
  });

  it("rejects a mismatched bearer token", () => {
    const request = new Request("https://owncover.in/api/cron/reminders", {
      headers: { authorization: "Bearer other-secret" },
    });

    expect(isCronAuthorized(request, { CRON_SECRET: "deploy-secret" })).toBe(
      false
    );
  });
});
