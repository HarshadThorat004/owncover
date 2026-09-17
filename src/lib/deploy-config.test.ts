import { describe, expect, it } from "vitest";

import {
  buildHealthPayload,
  getRequiredDeployConfig,
  healthHttpStatus,
  isDeployConfigReady,
} from "@/lib/deploy-config";

const readyEnv = {
  DATABASE_URL: "postgresql://example",
  NEXTAUTH_SECRET: "secret",
  NEXTAUTH_URL: "https://owncover.in",
  CRON_SECRET: "cron",
  RESEND_API_KEY: "re_test",
  UPLOADTHING_TOKEN: "ut_test",
};

describe("deploy config", () => {
  it("reports missing required production variables", () => {
    const config = getRequiredDeployConfig({});
    expect(config.databaseUrl).toBe(false);
    expect(isDeployConfigReady(config)).toBe(false);
  });

  it("is ready when all required variables are set", () => {
    const config = getRequiredDeployConfig(readyEnv);
    expect(isDeployConfigReady(config)).toBe(true);
  });

  it("is not ready when the database ping fails", () => {
    const payload = buildHealthPayload({
      config: getRequiredDeployConfig(readyEnv),
      database: false,
    });

    expect(payload.ready).toBe(false);
    expect(payload.ok).toBe(false);
    expect(healthHttpStatus(payload.ready)).toBe(503);
  });

  it("returns 200 only when env and database are both ready", () => {
    const payload = buildHealthPayload({
      config: getRequiredDeployConfig(readyEnv),
      database: true,
    });

    expect(payload.ready).toBe(true);
    expect(healthHttpStatus(payload.ready)).toBe(200);
  });
});
