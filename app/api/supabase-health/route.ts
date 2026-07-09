import { NextResponse } from "next/server";
import { checkInitialTransactionsHealth } from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkInitialTransactionsHealth();

  return NextResponse.json(toPublicHealth(health), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function toPublicHealth(
  health: Awaited<ReturnType<typeof checkInitialTransactionsHealth>>,
) {
  return {
    ok: health.ok,
    hasUrl: health.hasUrl,
    hasPublishableKey: health.hasPublishableKey,
    status: health.status,
    rowCount: health.rowCount,
    error: health.error,
  };
}
