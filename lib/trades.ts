export type TradeRecord = {
  id: number; asset: string; direction: string; confidence: number; tradeType: string;
  openedAt: string; closedAt: string | null; entryPrice: number | null; exitPrice: number | null;
  stopLoss: number | null; takeProfit: number | null; forecastedRR: number | null;
  result: string; closingRR: number | null; pnl: number | null; setup: string | null;
  notes: string; favorite: boolean; createdAt: string; updatedAt: string;
};

export type TradeInsights = {
  totalTrades: number; closedTrades: number; wins: number; losses: number; winRate: number;
  netPnl: number; grossProfit: number; grossLoss: number; profitFactor: number; avgRR: number;
  currentStreak: number; streakType: string; tradesThisMonth: number;
  bestTrade: TradeRecord | null; worstTrade: TradeRecord | null;
  cumulativePnl: { label: string; value: number }[];
  dailyPnl: { label: string; value: number }[];
  resultDistribution: { name: string; value: number }[];
};

export const directionLabel = (value: string) => value === "LONG" ? "Long" : "Short";
export const tradeTypeLabel = (value: string) => ({ DAY_TRADE: "Day trade", SWING: "Swing", SCALP: "Scalp", POSITION: "Position" }[value] ?? value);
export const resultLabel = (value: string) => ({ OPEN: "Open", WIN: "Win", LOSS: "Loss", BREAKEVEN: "Break-even" }[value] ?? value);
export const money = (value: number | null | undefined) => value == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
export const rr = (value: number | null | undefined) => value == null ? "—" : `${value > 0 ? "+" : ""}${value.toFixed(2)}R`;
export const dateTime = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
export const toInputDateTime = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 16) : "";
