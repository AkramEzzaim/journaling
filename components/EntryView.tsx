"use client";

import { Calendar, Edit3, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatEntryDate, JournalEntry, moodDetails, wordCount } from "@/lib/journal";

function FormattedContent({ content }: { content: string }) {
  return <div className="entry-content">{content.split("\n").map((line, index) => {
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("# ")) return <h2 key={index}>{line.slice(2)}</h2>;
    if (line.startsWith("> ")) return <blockquote key={index}>{line.slice(2)}</blockquote>;
    if (/^[-*] /.test(line)) return <p className="list-line" key={index}>• {line.slice(2)}</p>;
    if (/^\d+\. /.test(line)) return <p className="list-line" key={index}>{line}</p>;
    const pieces = line.split(/(\*\*.*?\*\*|_.*?_)/g);
    return <p key={index}>{pieces.map((piece, pieceIndex) => piece.startsWith("**") && piece.endsWith("**") ? <strong key={pieceIndex}>{piece.slice(2, -2)}</strong> : piece.startsWith("_") && piece.endsWith("_") ? <em key={pieceIndex}>{piece.slice(1, -1)}</em> : piece)}</p>;
  })}</div>;
}

export function EntryView({ id }: { id: number }) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => { fetch(`/api/entries/${id}`, { cache: "no-store" }).then(async (response) => response.ok ? setEntry(await response.json()) : router.replace("/entries")); }, [id, router]);

  if (!entry) return <div className="page loading-state">Opening this page…</div>;
  const mood = moodDetails(entry.mood);
  const toggleFavorite = async () => {
    const response = await fetch(`/api/entries/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ favorite: !entry.favorite }) });
    setEntry(await response.json());
  };
  const remove = async () => {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    router.push("/entries");
    router.refresh();
  };

  return (
    <div className="page entry-view-page">
      <div className="entry-view-actions">
        <Link className="back-link" href="/entries">← All entries</Link>
        <div>
          <button className={`button secondary compact ${entry.favorite ? "favorite-active" : ""}`} onClick={toggleFavorite}><Star size={16} fill={entry.favorite ? "currentColor" : "none"} />Favorite</button>
          <Link className="button secondary compact" href={`/entries/${id}/edit`}><Edit3 size={16} />Edit</Link>
          <button className="button danger compact" onClick={() => setConfirmDelete(true)}><Trash2 size={16} />Delete</button>
        </div>
      </div>
      <article className="entry-paper">
        <div className="entry-kicker"><Calendar size={15} />{formatEntryDate(entry.entryDate)}</div>
        <h1>{entry.title}</h1>
        <div className="entry-meta-line">
          {mood && <span className="mood-badge"><span>{mood.emoji}</span>{mood.label}</span>}
          {entry.tags.map((tag) => <span className="tag" key={tag.id}>#{tag.name}</span>)}
        </div>
        <FormattedContent content={entry.content} />
        <footer>{wordCount(entry.content).toLocaleString()} words · Last edited {formatEntryDate(entry.updatedAt, { month: "short", day: "numeric", year: "numeric" })}</footer>
      </article>
      {confirmDelete && <div className="dialog-backdrop" role="presentation"><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="dialog-icon"><Trash2 size={20} /></div><h2 id="delete-title">Delete this journal entry?</h2><p>This action cannot be undone.</p><div className="dialog-actions"><button className="button secondary" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="button danger solid" onClick={remove}>Delete</button></div></div></div>}
    </div>
  );
}
