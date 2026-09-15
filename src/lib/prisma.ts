import { PrismaClient } from "@prisma/client";

import { ensurePrismaDirectUrl, withPrismaConnectionParams } from "@/lib/db";

/** Bump when `prisma generate` adds models so `next dev` drops a stale client. */
const PRISMA_CLIENT_GEN = 4;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaGen: number | undefined;
};

function createPrismaClient() {
  ensurePrismaDirectUrl();
  const url = process.env.DATABASE_URL?.trim();

  return new PrismaClient({
    ...(url ? { datasourceUrl: withPrismaConnectionParams(url) } : {}),
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
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
