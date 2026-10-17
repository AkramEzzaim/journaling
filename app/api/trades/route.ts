import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const num = (value: unknown) => value === "" || value == null ? null : Number(value);
const date = (value: unknown) => value ? new Date(String(value)) : null;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const where: Prisma.TradeWhereInput = {};
  const search = params.get("search")?.trim();
  if (search) where.OR = [{ asset: { contains: search.toUpperCase() } }, { setup: { contains: search } }, { notes: { contains: search } }];
  if (params.get("direction")) where.direction = params.get("direction")!;
  if (params.get("result")) where.result = params.get("result")!;
  if (params.get("tradeType")) where.tradeType = params.get("tradeType")!;
  const limit = Number(params.get("limit"));
  const trades = await prisma.trade.findMany({ where, orderBy: [{ openedAt: "desc" }, { id: "desc" }], take: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : undefined });
  return NextResponse.json(trades);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const trade = await prisma.trade.create({ data: {
    asset: String(body.asset ?? "").trim().toUpperCase() || "UNTITLED",
    direction: String(body.direction ?? "LONG"), confidence: Math.min(10, Math.max(1, Number(body.confidence) || 5)),
    tradeType: String(body.tradeType ?? "DAY_TRADE"), openedAt: date(body.openedAt) ?? new Date(), closedAt: date(body.closedAt),
    entryPrice: num(body.entryPrice), exitPrice: num(body.exitPrice), stopLoss: num(body.stopLoss), takeProfit: num(body.takeProfit),
    forecastedRR: num(body.forecastedRR), result: String(body.result ?? "OPEN"), closingRR: num(body.closingRR), pnl: num(body.pnl),
    setup: body.setup ? String(body.setup).trim() : null, notes: String(body.notes ?? ""), favorite: Boolean(body.favorite),
  }});
  return NextResponse.json(trade, { status: 201 });
}
