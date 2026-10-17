# TradeJournal

A private, single-user trading journal that runs entirely on your Mac. Track each position’s asset, direction, confidence, setup, planned risk/reward, result, realized R, P&L, and review notes. All data stays in a local SQLite database—there are no accounts, cloud services, analytics, or external APIs.

## Run locally

You need Node.js 20 or 22 LTS and npm.

```bash
cd /Users/mac/ALL/Journaling
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The seed adds realistic sample trades only when the trade log is empty.

## Local data

The database is stored at `/Users/mac/ALL/Journaling/prisma/journal.db`. Use **Settings → Backup database** for a raw backup, or export/import the trade log as readable JSON.

Import replaces all current trades, so make a backup first.

## Keyboard shortcuts

- `Command + N` / `Control + N` — log a new trade
- `Command + K` / `Control + K` — open or focus trade search

## Production

```bash
npm run lint
npm run build
npm run start
```

The app remains local at `http://localhost:3000` unless you deliberately change the server configuration.

Built with Next.js, React, TypeScript, Prisma, SQLite, Lucide, and Recharts.
