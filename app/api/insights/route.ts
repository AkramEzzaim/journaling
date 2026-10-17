import { NextResponse } from "next/server";
import { dateKey, moodDetails, wordCount } from "@/lib/journal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function shiftDay(key: string, amount: number) {
  const date = new Date(`${key}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateKey(date);
}

export async function GET() {
  const entries = await prisma.entry.findMany({ select: { content: true, mood: true, entryDate: true } });
  const uniqueDates = [...new Set(entries.map((entry) => dateKey(entry.entryDate)))].sort();
  const dates = new Set(uniqueDates);
  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  let cursor = dates.has(localToday) ? localToday : shiftDay(localToday, -1);
  let currentStreak = 0;
  while (dates.has(cursor)) {
    currentStreak += 1;
    cursor = shiftDay(cursor, -1);
  }

  let longestStreak = 0;
  let running = 0;
  for (let index = 0; index < uniqueDates.length; index += 1) {
    running = index > 0 && shiftDay(uniqueDates[index - 1], 1) === uniqueDates[index] ? running + 1 : 1;
    longestStreak = Math.max(longestStreak, running);
  }

  const moodCounts = new Map<string, number>();
  entries.forEach((entry) => {
    if (entry.mood) moodCounts.set(entry.mood, (moodCounts.get(entry.mood) ?? 0) + 1);
  });
  const moodDistribution = [...moodCounts.entries()]
    .map(([mood, count]) => ({ mood, count, label: moodDetails(mood)?.label ?? mood }))
    .sort((a, b) => b.count - a.count);
  const monthPrefix = localToday.slice(0, 7);

  return NextResponse.json({
    totalEntries: entries.length,
    totalWords: entries.reduce((sum, entry) => sum + wordCount(entry.content), 0),
    currentStreak,
    longestStreak,
    mostCommonMood: moodDistribution[0]?.mood ?? null,
    entriesThisMonth: entries.filter((entry) => dateKey(entry.entryDate).startsWith(monthPrefix)).length,
    moodDistribution,
  });
}
