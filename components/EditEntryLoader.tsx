"use client";

import { useEffect, useState } from "react";
import { JournalEditor } from "./JournalEditor";
import { JournalEntry } from "@/lib/journal";

export function EditEntryLoader({ id }: { id: number }) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  useEffect(() => { fetch(`/api/entries/${id}`, { cache: "no-store" }).then((response) => response.json()).then(setEntry); }, [id]);
  return entry ? <JournalEditor initialEntry={entry} /> : <div className="page loading-state">Preparing your entry…</div>;
}
