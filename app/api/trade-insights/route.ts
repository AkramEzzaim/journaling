import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const trades = await prisma.trade.findMany({ orderBy: { openedAt: "asc" } });
  const closed = trades.filter((trade) => trade.result !== "OPEN");
  const wins = closed.filter((trade) => trade.result === "WIN").length;
  const losses = closed.filter((trade) => trade.result === "LOSS").length;
  const grossProfit = trades.reduce((sum, trade) => sum + Math.max(0, trade.pnl ?? 0), 0);
  const grossLoss = Math.abs(trades.reduce((sum, trade) => sum + Math.min(0, trade.pnl ?? 0), 0));
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const settled = [...closed].sort((a, b) => (b.closedAt ?? b.openedAt).getTime() - (a.closedAt ?? a.openedAt).getTime());
  const streakType = settled[0]?.result === "WIN" ? "WIN" : settled[0]?.result === "LOSS" ? "LOSS" : "—";
  let currentStreak = 0; for (const trade of settled) { if (trade.result !== streakType) break; currentStreak++; }
  let running = 0;
  const cumulativePnl = trades.filter((t) => t.pnl != null).map((trade) => { running += trade.pnl ?? 0; return { label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(trade.closedAt ?? trade.openedAt), value: Number(running.toFixed(2)) }; });
  const daily = new Map<string, number>(); trades.forEach((trade) => { if (trade.pnl == null) return; const d = trade.closedAt ?? trade.openedAt; const key = d.toISOString().slice(0,10); daily.set(key, (daily.get(key) ?? 0) + trade.pnl); });
  const dailyPnl = [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => ({ label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${key}T12:00:00`)), value: Number(value.toFixed(2)) }));
  const byPnl = trades.filter((trade) => trade.pnl != null).sort((a, b) => (b.pnl ?? 0) - (a.pnl ?? 0));
  const closingRR = closed.filter((trade) => trade.closingRR != null);
  return NextResponse.json({ totalTrades: trades.length, closedTrades: closed.length, wins, losses, winRate: closed.length ? wins / closed.length * 100 : 0,
    netPnl: grossProfit - grossLoss, grossProfit, grossLoss, profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit ? 99 : 0,
    avgRR: closingRR.length ? closingRR.reduce((sum, trade) => sum + (trade.closingRR ?? 0), 0) / closingRR.length : 0,
    currentStreak, streakType, tradesThisMonth: trades.filter((trade) => trade.openedAt >= monthStart).length,
    bestTrade: byPnl[0] ?? null, worstTrade: byPnl.at(-1) ?? null, cumulativePnl, dailyPnl,
    resultDistribution: ["WIN", "LOSS", "BREAKEVEN", "OPEN"].map((name) => ({ name, value: trades.filter((trade) => trade.result === name).length })) });
}
