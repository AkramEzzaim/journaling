import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const trades = await prisma.trade.findMany({ orderBy: { openedAt: "desc" } });
  return new NextResponse(JSON.stringify({ version: 2, type: "trading-journal", exportedAt: new Date().toISOString(), trades }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="trade-journal-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
