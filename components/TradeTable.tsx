"use client";

import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { dateTime, directionLabel, money, resultLabel, rr, TradeRecord, tradeTypeLabel } from "@/lib/trades";

export function TradeTable({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("");
  const [result, setResult] = useState("");
  useEffect(() => { fetch(`/api/trades${limit ? `?limit=${limit}` : ""}`, { cache: "no-store" }).then((r) => r.json()).then(setTrades).finally(() => setLoading(false)); }, [limit]);
  const rows = useMemo(() => trades.filter((trade) => (!search || `${trade.asset} ${trade.setup ?? ""}`.toLowerCase().includes(search.toLowerCase())) && (!direction || trade.direction === direction) && (!result || trade.result === result)), [trades, search, direction, result]);
  return <>
    {!compact && <div className="trade-filters"><label className="trade-search"><Search size={14} /><input data-trade-search value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search asset or setup…" /><kbd>⌘ K</kbd></label><div className="trade-filter-group"><SlidersHorizontal size={13} /><select aria-label="Direction" value={direction} onChange={(e) => setDirection(e.target.value)}><option value="">All directions</option><option value="LONG">Long</option><option value="SHORT">Short</option></select><select aria-label="Result" value={result} onChange={(e) => setResult(e.target.value)}><option value="">All results</option><option value="OPEN">Open</option><option value="WIN">Wins</option><option value="LOSS">Losses</option><option value="BREAKEVEN">Break-even</option></select></div></div>}
    <div className="trade-table-wrap"><table className="trade-table"><thead><tr><th>Asset</th><th>Date</th><th>Direction</th><th>Confidence</th><th>Trade type</th><th>Forecasted RR</th><th>Win/Loss</th><th>Closing RR</th><th>P&amp;L</th><th aria-label="Action" /></tr></thead><tbody>{loading ? <tr><td colSpan={10} className="table-message">Loading trades…</td></tr> : rows.length ? rows.map((trade) => <tr key={trade.id}><td><Link className="asset-cell" href={`/trades/${trade.id}`}>{trade.favorite && <span>★</span>}{trade.asset}</Link></td><td><span className="date-cell">{dateTime(trade.openedAt)}</span>{trade.closedAt && <small>→ {dateTime(trade.closedAt)}</small>}</td><td><span className={`trade-badge direction-${trade.direction.toLowerCase()}`}>{directionLabel(trade.direction)}</span></td><td><div className="confidence-cell"><strong>{trade.confidence}</strong><i><span style={{ width: `${trade.confidence * 10}%` }} /></i></div></td><td><span className="type-cell">{tradeTypeLabel(trade.tradeType)}</span></td><td className="mono-cell">{trade.forecastedRR?.toFixed(2) ?? "—"}</td><td><span className={`trade-badge result-${trade.result.toLowerCase()}`}>{resultLabel(trade.result)}</span></td><td className={`mono-cell ${(trade.closingRR ?? 0) > 0 ? "positive" : (trade.closingRR ?? 0) < 0 ? "negative" : ""}`}>{rr(trade.closingRR)}</td><td className={`pnl-cell ${(trade.pnl ?? 0) > 0 ? "positive" : (trade.pnl ?? 0) < 0 ? "negative" : ""}`}>{money(trade.pnl)}</td><td><Link className="row-open" href={`/trades/${trade.id}`} aria-label={`Open ${trade.asset}`}><ArrowUpRight size={14} /></Link></td></tr>) : <tr><td colSpan={10} className="table-message">No trades match these filters.</td></tr>}</tbody></table></div>
  </>;
}
