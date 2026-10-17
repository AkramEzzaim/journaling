"use client";

import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { formatEntryDate, JournalEntry, moodDetails, previewText, wordCount } from "@/lib/journal";

export function EntryCard({ entry, onFavorite }: { entry: JournalEntry; onFavorite?: (entry: JournalEntry) => void }) {
  const mood = moodDetails(entry.mood);
  return (
    <article className="entry-card">
      <div className="entry-card-date"><strong>{new Date(entry.entryDate).getUTCDate().toString().padStart(2, "0")}</strong><span>{formatEntryDate(entry.entryDate, { weekday: undefined, month: "short", year: "numeric" })}</span></div>
      <Link href={`/entries/${entry.id}`} className="entry-card-link" aria-label={`Read ${entry.title}`}>
        <h3>{entry.title}</h3>
        <p>{previewText(entry.content) || "A quiet page waiting for words."}</p>
      </Link>
      <div className="entry-metadata">
        {entry.tags.slice(0, 3).map((tag) => <span className="tag" key={tag.id}>#{tag.name}</span>)}
      </div>
      <div className="entry-card-mood">{mood ? <span className="mood-badge"><span>{mood.emoji}</span>{mood.label}</span> : <span className="muted-cell">—</span>}</div>
      <div className="entry-card-words"><strong>{wordCount(entry.content)}</strong><span>words</span></div>
      <div className="entry-card-footer">
        <button
          className={`icon-button favorite-button ${entry.favorite ? "is-favorite" : ""}`}
          type="button"
          onClick={() => onFavorite?.(entry)}
          aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={18} fill={entry.favorite ? "currentColor" : "none"} />
        </button>
        <Link href={`/entries/${entry.id}`} className="icon-button row-open" aria-label={`Open ${entry.title}`}><ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
