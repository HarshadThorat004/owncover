import { NextResponse } from "next/server";

import {
  buildHealthPayload,
  getRequiredDeployConfig,
  healthHttpStatus,
} from "@/lib/deploy-config";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DB_PING_TIMEOUT_MS = 5000;

async function pingDatabase() {
  if (!process.env.DATABASE_URL?.trim()) {
    return false;
  }

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB ping timed out")), DB_PING_TIMEOUT_MS)
      ),
    ]);
    return true;
  } catch (error) {
    console.error("HEALTH_DB_UNREACHABLE", error);
    return false;
  }
}

export async function GET() {
  const config = getRequiredDeployConfig();
  const database = await pingDatabase();
  const payload = buildHealthPayload({ config, database });

  return NextResponse.json(payload, {
    status: healthHttpStatus(payload.ready),
  });
}
