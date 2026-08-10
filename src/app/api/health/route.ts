import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "lab.rtin.page",
    checkedAt: new Date().toISOString(),
  });
}
