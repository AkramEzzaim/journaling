import { NextRequest, NextResponse } from "next/server";
import { localDateToStored } from "@/lib/journal";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

function entryId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cleanTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))].slice(0, 12);
}

export async function GET(_request: NextRequest, context: Context) {
  const id = entryId((await context.params).id);
  if (!id) return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  const entry = await prisma.entry.findUnique({ where: { id }, include: { tags: true } });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(request: NextRequest, context: Context) {
  const id = entryId((await context.params).id);
  if (!id) return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  const body = await request.json();
  const tags = cleanTags(body.tags);

  try {
    const entry = await prisma.entry.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: String(body.title).trim() || "Untitled entry" }),
        ...(body.content !== undefined && { content: String(body.content) }),
        ...(body.mood !== undefined && { mood: body.mood ? String(body.mood) : null }),
        ...(body.favorite !== undefined && { favorite: Boolean(body.favorite) }),
        ...(body.entryDate && { entryDate: localDateToStored(String(body.entryDate)) }),
        ...(body.tags !== undefined && {
          tags: {
            set: [],
            connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
          },
        }),
      },
      include: { tags: true },
    });
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const id = entryId((await context.params).id);
  if (!id) return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  try {
    await prisma.entry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}
