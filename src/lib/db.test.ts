import { describe, expect, it, vi } from "vitest";

import {
  isTransientDbError,
  withDbRetry,
  withPrismaConnectionParams,
} from "@/lib/db";

describe("withPrismaConnectionParams", () => {
  it("adds Neon pooler and connect timeout flags", () => {
    const url =
      "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db?sslmode=require";

    expect(withPrismaConnectionParams(url)).toBe(
      "postgresql://user:pass@ep-test-pooler.c-7.us-east-1.aws.neon.tech/db?sslmode=require&pgbouncer=true&connect_timeout=30"
    );
  });

  it("leaves existing flags and non-pooler hosts alone", () => {
    const url =
      "postgresql://user:pass@localhost:5432/db?connect_timeout=10";

    expect(withPrismaConnectionParams(url)).toBe(url);
  });
});

describe("isTransientDbError", () => {
  it("detects Prisma connection codes and Neon unreachable messages", () => {
    expect(isTransientDbError({ code: "P1001" })).toBe(true);
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
