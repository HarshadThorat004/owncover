import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import { ensurePrismaDirectUrl, withPrismaConnectionParams } from "@/lib/db";

/** Bump when `prisma generate` adds models so `next dev` drops a stale client. */
const PRISMA_CLIENT_GEN = 5;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaGen: number | undefined;
};

function shouldUseAccelerate(databaseUrl: string | undefined) {
  if (process.env.PRISMA_ACCELERATE === "1") return true;
  if (!databaseUrl) return false;
  return (
    databaseUrl.startsWith("prisma://") ||
    databaseUrl.includes("accelerate.prisma-data.net")
  );
}

function createPrismaClient() {
  ensurePrismaDirectUrl();
  const url = process.env.DATABASE_URL?.trim();

  const client = new PrismaClient({
    ...(url ? { datasourceUrl: withPrismaConnectionParams(url) } : {}),
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  if (shouldUseAccelerate(url)) {
    return client.$extends(withAccelerate()) as unknown as PrismaClient;
  }

  return client;
}

if (
  process.env.NODE_ENV !== "production" &&
  globalForPrisma.prisma &&
  globalForPrisma.prismaGen !== PRISMA_CLIENT_GEN
) {
  void globalForPrisma.prisma.$disconnect();
  globalForPrisma.prisma = undefined;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaGen = PRISMA_CLIENT_GEN;
}
