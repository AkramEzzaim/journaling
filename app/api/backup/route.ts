import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await readFile(path.join(process.cwd(), "prisma", "journal.db"));
    return new NextResponse(database, {
      headers: {
        "Content-Type": "application/vnd.sqlite3",
        "Content-Disposition": `attachment; filename="journal-backup-${new Date().toISOString().slice(0, 10)}.db"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Database file is not available yet." }, { status: 404 });
  }
}
