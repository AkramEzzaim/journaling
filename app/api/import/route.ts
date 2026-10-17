import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!Array.isArray(body.trades)) return NextResponse.json({ error: "This file is not a valid trading journal export." }, { status: 400 });
  const trades = body.trades.slice(0, 10000);
  await prisma.$transaction(async (tx) => {
    await tx.trade.deleteMany();
    for (const raw of trades) await tx.trade.create({ data: {
      asset: String(raw.asset ?? "UNTITLED").toUpperCase(), direction: String(raw.direction ?? "LONG"), confidence: Number(raw.confidence) || 5,
      tradeType: String(raw.tradeType ?? "DAY_TRADE"), openedAt: new Date(raw.openedAt ?? Date.now()), closedAt: raw.closedAt ? new Date(raw.closedAt) : null,
      entryPrice: raw.entryPrice == null ? null : Number(raw.entryPrice), exitPrice: raw.exitPrice == null ? null : Number(raw.exitPrice), stopLoss: raw.stopLoss == null ? null : Number(raw.stopLoss),
      takeProfit: raw.takeProfit == null ? null : Number(raw.takeProfit), forecastedRR: raw.forecastedRR == null ? null : Number(raw.forecastedRR), result: String(raw.result ?? "OPEN"),
      closingRR: raw.closingRR == null ? null : Number(raw.closingRR), pnl: raw.pnl == null ? null : Number(raw.pnl), setup: raw.setup ? String(raw.setup) : null,
      notes: String(raw.notes ?? ""), favorite: Boolean(raw.favorite),
    }});
  });
  return NextResponse.json({ imported: trades.length });
}
