CREATE TABLE "Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "asset" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 5,
    "tradeType" TEXT NOT NULL,
    "openedAt" DATETIME NOT NULL,
    "closedAt" DATETIME,
    "entryPrice" REAL,
    "exitPrice" REAL,
    "stopLoss" REAL,
    "takeProfit" REAL,
    "forecastedRR" REAL,
    "result" TEXT NOT NULL DEFAULT 'OPEN',
    "closingRR" REAL,
    "pnl" REAL,
    "setup" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "Trade_openedAt_idx" ON "Trade"("openedAt");
CREATE INDEX "Trade_result_idx" ON "Trade"("result");
CREATE INDEX "Trade_asset_idx" ON "Trade"("asset");
