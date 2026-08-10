import { NextResponse } from "next/server";

import { checkAllServices, summarizeHealth } from "@/lib/health";
import { loadManifest } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await loadManifest();
  const statuses = await checkAllServices(result.manifest);

  return NextResponse.json({
    ok: !result.error,
    configPath: result.configPath,
    error: result.error,
    summary: summarizeHealth(statuses),
    statuses,
  });
}
