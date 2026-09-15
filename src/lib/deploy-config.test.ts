import { describe, expect, it } from "vitest";

import {
  getRequiredDeployConfig,
  isDeployConfigReady,
} from "@/lib/deploy-config";

describe("deploy config", () => {
  it("reports missing required production variables", () => {
    const config = getRequiredDeployConfig({});
    expect(config.databaseUrl).toBe(false);
    expect(isDeployConfigReady(config)).toBe(false);
  });

  it("is ready when all required variables are set", () => {
    const config = getRequiredDeployConfig({
      DATABASE_URL: "postgresql://example",
      NEXTAUTH_SECRET: "secret",
      NEXTAUTH_URL: "https://owncover.in",
      CRON_SECRET: "cron",
      RESEND_API_KEY: "re_test",
      UPLOADTHING_TOKEN: "ut_test",
    });

    expect(isDeployConfigReady(config)).toBe(true);
  });
});
