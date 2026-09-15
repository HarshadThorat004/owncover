import { describe, expect, it, vi } from "vitest";

import {
  ensurePrismaDirectUrl,
  isTransientDbError,
  unpooledDatabaseUrl,
  withDbRetry,
  withPrismaConnectionParams,
} from "@/lib/db";

describe("withPrismaConnectionParams", () => {
  const pooled =
    "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db?sslmode=require";

  it("adds Neon pooler flags and a longer pool wait", () => {
    expect(
      withPrismaConnectionParams(pooled, { NODE_ENV: "test" })
    ).toBe(
      "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db?sslmode=require&pgbouncer=true&connection_limit=5&connect_timeout=30&pool_timeout=20"
    );
  });

  it("keeps a single Prisma connection on pooled production URLs", () => {
    expect(
      withPrismaConnectionParams(pooled, { NODE_ENV: "production" })
    ).toContain("connection_limit=1");
  });

  it("leaves existing flags and non-pooler hosts alone", () => {
    const url =
      "postgresql://user:pass@localhost:5432/db?connect_timeout=10";

    expect(withPrismaConnectionParams(url)).toBe(
      "postgresql://user:pass@localhost:5432/db?connect_timeout=10&pool_timeout=20"
    );
  });
});

describe("ensurePrismaDirectUrl", () => {
  it("derives an unpooled Neon host from DATABASE_URL", () => {
    expect(
      unpooledDatabaseUrl(
        "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db"
      )
    ).toBe("postgresql://user:pass@ep-test.c-7.us-east-1.aws.neon.tech/db");
  });

  it("sets DIRECT_URL when it is missing", () => {
    const env: Record<string, string | undefined> = {
      DATABASE_URL:
        "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db",
    };

    expect(ensurePrismaDirectUrl(env)).toBe(
      "postgresql://user:pass@ep-test.c-7.us-east-1.aws.neon.tech/db"
    );
    expect(env.DIRECT_URL).toBe(
      "postgresql://user:pass@ep-test.c-7.us-east-1.aws.neon.tech/db"
    );
  });

  it("leaves an explicit DIRECT_URL unchanged", () => {
    const env = {
      DATABASE_URL:
        "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db",
      DIRECT_URL: "postgresql://user:pass@ep-test.c-7.us-east-1.aws.neon.tech/db",
    };

    ensurePrismaDirectUrl(env);
    expect(env.DIRECT_URL).toBe(
      "postgresql://user:pass@ep-test.c-7.us-east-1.aws.neon.tech/db"
    );
  });
});

describe("isTransientDbError", () => {
  it("detects Prisma connection codes and Neon unreachable messages", () => {
    expect(isTransientDbError({ code: "P2024" })).toBe(true);
    expect(
      isTransientDbError(
        new Error("Can't reach database server at `ep-example.neon.tech:5432`")
      )
    ).toBe(true);
    expect(isTransientDbError(new Error("Unique constraint failed"))).toBe(
      false
    );
  });
});

describe("withDbRetry", () => {
  it("retries transient failures then succeeds", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce({ code: "P1001" })
      .mockResolvedValueOnce("ok");

    await expect(withDbRetry(operation, [0, 0])).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent errors", async () => {
    const error = new Error("Unique constraint failed");
    const operation = vi.fn().mockRejectedValue(error);

    await expect(withDbRetry(operation, [0, 0])).rejects.toBe(error);
    expect(operation).toHaveBeenCalledTimes(1);
  });
});
