import { NextResponse } from "next/server";

import {
  buildHealthPayload,
  getRequiredDeployConfig,
  healthHttpStatus,
} from "@/lib/deploy-config";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function pingDatabase() {
  if (!process.env.DATABASE_URL?.trim()) {
    return false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
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
