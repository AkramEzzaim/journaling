import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
type Context = { params: Promise<{ id: string }> };
const idFrom = (raw: string) => { const id = Number(raw); return Number.isInteger(id) && id > 0 ? id : null; };
const num = (value: unknown) => value === "" || value == null ? null : Number(value);
const date = (value: unknown) => value ? new Date(String(value)) : null;

export async function GET(_request: NextRequest, context: Context) {
  const id = idFrom((await context.params).id); if (!id) return NextResponse.json({ error: "Invalid trade" }, { status: 400 });
  const trade = await prisma.trade.findUnique({ where: { id } });
  return trade ? NextResponse.json(trade) : NextResponse.json({ error: "Trade not found" }, { status: 404 });
}
export async function PUT(request: NextRequest, context: Context) {
  const id = idFrom((await context.params).id); if (!id) return NextResponse.json({ error: "Invalid trade" }, { status: 400 });
  const body = await request.json();
  try { const trade = await prisma.trade.update({ where: { id }, data: {
    asset: String(body.asset ?? "").trim().toUpperCase() || "UNTITLED", direction: String(body.direction ?? "LONG"),
    confidence: Math.min(10, Math.max(1, Number(body.confidence) || 5)), tradeType: String(body.tradeType ?? "DAY_TRADE"),
    openedAt: date(body.openedAt) ?? new Date(), closedAt: date(body.closedAt), entryPrice: num(body.entryPrice), exitPrice: num(body.exitPrice),
    stopLoss: num(body.stopLoss), takeProfit: num(body.takeProfit), forecastedRR: num(body.forecastedRR), result: String(body.result ?? "OPEN"),
    closingRR: num(body.closingRR), pnl: num(body.pnl), setup: body.setup ? String(body.setup).trim() : null, notes: String(body.notes ?? ""), favorite: Boolean(body.favorite),
  }}); return NextResponse.json(trade); } catch { return NextResponse.json({ error: "Trade not found" }, { status: 404 }); }
}
export async function DELETE(_request: NextRequest, context: Context) {
  const id = idFrom((await context.params).id); if (!id) return NextResponse.json({ error: "Invalid trade" }, { status: 400 });
  try { await prisma.trade.delete({ where: { id } }); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "Trade not found" }, { status: 404 }); }
}
