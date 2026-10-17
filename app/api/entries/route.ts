import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { localDateToStored, todayKey } from "@/lib/journal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function cleanTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))].slice(0, 12);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim();
  const mood = searchParams.get("mood")?.trim();
  const tag = searchParams.get("tag")?.trim();
  const date = searchParams.get("date")?.trim();
  const favorite = searchParams.get("favorite") === "true";
  const limit = Number(searchParams.get("limit"));

  const where: Prisma.EntryWhereInput = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { tags: { some: { name: { contains: search } } } },
    ];
  }
  if (mood) where.mood = mood;
  if (tag) where.tags = { some: { name: tag } };
  if (date) where.entryDate = localDateToStored(date);
  if (favorite) where.favorite = true;

  const entries = await prisma.entry.findMany({
    where,
    include: { tags: { orderBy: { name: "asc" } } },
    orderBy: [{ entryDate: "desc" }, { updatedAt: "desc" }],
    take: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : undefined,
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tags = cleanTags(body.tags);
  const entry = await prisma.entry.create({
    data: {
      title: String(body.title ?? "").trim() || "Untitled entry",
      content: String(body.content ?? ""),
      mood: body.mood ? String(body.mood) : null,
      favorite: Boolean(body.favorite),
      entryDate: localDateToStored(String(body.entryDate || todayKey())),
      tags: {
        connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
      },
    },
    include: { tags: true },
  });
  return NextResponse.json(entry, { status: 201 });
}
