import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const samples = [
  {
    title: "A quiet Sunday reset",
    content: "I slowed down today and made room for the week ahead. A long walk, fresh coffee, and an hour without a screen made everything feel a little clearer.\n\nThree things I want to carry into this week:\n- Protect the first hour of the morning\n- Finish one thing before starting another\n- Call the people I miss",
    mood: "good",
    favorite: true,
    daysAgo: 0,
    tags: ["reflection", "personal"],
  },
  {
    title: "An idea worth exploring",
    content: "What if I treated small experiments as the work, rather than waiting for a perfect plan? I can test the idea in a weekend, learn from it, and decide what deserves more attention.",
    mood: "great",
    favorite: true,
    daysAgo: 1,
    tags: ["ideas", "goals"],
  },
  {
    title: "Notes after a full day",
    content: "There was more on the calendar than I expected. I handled the important parts, even if the day did not feel especially graceful. Tonight is for rest, not catching up.",
    mood: "okay",
    favorite: false,
    daysAgo: 2,
    tags: ["work", "reflection"],
  },
  {
    title: "Small wins count",
    content: "I completed the task I had been postponing, cooked a real dinner, and went outside before sunset. None of it was dramatic, but together it made today feel solid.",
    mood: "good",
    favorite: false,
    daysAgo: 4,
    tags: ["personal", "goals"],
  },
  {
    title: "A difficult morning",
    content: "Today started heavy. Instead of trying to force a better mood, I gave myself some space and wrote down what was actually bothering me. Naming it helped.",
    mood: "low",
    favorite: false,
    daysAgo: 7,
    tags: ["reflection"],
  },
];

async function main() {
  if ((await prisma.entry.count()) === 0) {
    for (const sample of samples) {
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - sample.daysAgo);
      entryDate.setUTCHours(12, 0, 0, 0);
      await prisma.entry.create({ data: { title: sample.title, content: sample.content, mood: sample.mood, favorite: sample.favorite, entryDate, tags: { connectOrCreate: sample.tags.map((name) => ({ where: { name }, create: { name } })) } } });
    }
  }

  if ((await prisma.trade.count()) === 0) {
    const at = (daysAgo: number, hour: number) => { const date = new Date(); date.setDate(date.getDate() - daysAgo); date.setHours(hour, 0, 0, 0); return date; };
    const trades = [
      { asset: "BTCUSD", direction: "LONG", confidence: 8, tradeType: "DAY_TRADE", openedAt: at(0, 9), entryPrice: 66340, stopLoss: 65780, takeProfit: 67520, forecastedRR: 2.1, result: "OPEN", setup: "Liquidity sweep", notes: "Waiting for the New York continuation after the reclaim." },
      { asset: "XAUUSD", direction: "SHORT", confidence: 9, tradeType: "DAY_TRADE", openedAt: at(1, 14), closedAt: at(1, 18), entryPrice: 2647.4, exitPrice: 2629.8, stopLoss: 2655.2, takeProfit: 2630, forecastedRR: 2.23, result: "WIN", closingRR: 2.26, pnl: 452, setup: "London high rejection", notes: "Clean displacement and retest. Managed exactly to plan." },
      { asset: "NAS100", direction: "LONG", confidence: 7, tradeType: "SCALP", openedAt: at(2, 15), closedAt: at(2, 16), entryPrice: 20142, exitPrice: 20086, stopLoss: 20090, takeProfit: 20246, forecastedRR: 2, result: "LOSS", closingRR: -1, pnl: -185, setup: "Opening range breakout", notes: "Entered before confirmation. Avoid anticipating the break." },
      { asset: "EURUSD", direction: "SHORT", confidence: 8, tradeType: "SWING", openedAt: at(4, 8), closedAt: at(2, 11), entryPrice: 1.0842, exitPrice: 1.0771, stopLoss: 1.0878, takeProfit: 1.0768, forecastedRR: 2.06, result: "WIN", closingRR: 1.97, pnl: 394, setup: "Daily supply", notes: "Held through the pullback and followed the higher-timeframe bias." },
      { asset: "ETHUSD", direction: "LONG", confidence: 6, tradeType: "DAY_TRADE", openedAt: at(5, 10), closedAt: at(5, 13), entryPrice: 2468, exitPrice: 2470, stopLoss: 2439, takeProfit: 2526, forecastedRR: 2, result: "BREAKEVEN", closingRR: 0.07, pnl: 8, setup: "Range reclaim", notes: "Moved stop too early; structure remained valid." },
      { asset: "GBPJPY", direction: "SHORT", confidence: 8, tradeType: "SWING", openedAt: at(7, 9), closedAt: at(4, 17), entryPrice: 195.84, exitPrice: 193.91, stopLoss: 196.6, takeProfit: 193.55, forecastedRR: 3.01, result: "WIN", closingRR: 2.54, pnl: 508, setup: "Weekly resistance", notes: "Best execution this week. Patient entry after confirmation." },
      { asset: "SOLUSD", direction: "LONG", confidence: 7, tradeType: "DAY_TRADE", openedAt: at(9, 12), closedAt: at(9, 19), entryPrice: 155.4, exitPrice: 153.2, stopLoss: 153.3, takeProfit: 159.6, forecastedRR: 2, result: "LOSS", closingRR: -1.05, pnl: -126, setup: "Trend continuation", notes: "Market structure shifted before entry; setup was no longer A-grade." },
      { asset: "US30", direction: "LONG", confidence: 9, tradeType: "DAY_TRADE", openedAt: at(12, 14), closedAt: at(12, 17), entryPrice: 42410, exitPrice: 42728, stopLoss: 42290, takeProfit: 42710, forecastedRR: 2.5, result: "WIN", closingRR: 2.65, pnl: 636, setup: "Opening drive", notes: "Strong catalyst alignment with a disciplined partial at 2R." },
    ];
    await prisma.trade.createMany({ data: trades });
  }
}

main()
  .finally(async () => prisma.$disconnect());
