import { NextResponse } from "next/server";

import { getRequiredDeployConfig, isDeployConfigReady } from "@/lib/deploy-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getRequiredDeployConfig();

  return NextResponse.json({
    ok: true,
    service: "owncover",
    ready: isDeployConfigReady(config),
    config,
  });
}
