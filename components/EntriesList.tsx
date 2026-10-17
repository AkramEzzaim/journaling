"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EntryCard } from "./EntryCard";
import { JournalEntry, MOODS } from "@/lib/journal";

export function EntriesList({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mood, setMood] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");

  const tags = useMemo(() => [...new Set(entries.flatMap((entry) => entry.tags.map((item) => item.name)))].sort(), [entries]);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (mood) params.set("mood", mood);
    if (tag) params.set("tag", tag);
    if (date) params.set("date", date);
    if (favoritesOnly) params.set("favorite", "true");
    const response = await fetch(`/api/entries?${params}`, { cache: "no-store" });
    setEntries(await response.json());
    setLoading(false);
  }, [date, favoritesOnly, mood, search, tag]);

  useEffect(() => { const timeout = window.setTimeout(load, 120); return () => clearTimeout(timeout); }, [load]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("focus") === "search") {
      window.setTimeout(() => document.querySelector<HTMLInputElement>("[data-journal-search]")?.focus(), 80);
    }
  }, []);

  const toggleFavorite = async (entry: JournalEntry) => {
    await fetch(`/api/entries/${entry.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ favorite: !entry.favorite }) });
    await load();
  };

  return (
    <>
      <div className="search-panel">
        <div className="search-box"><Search size={18} /><input data-journal-search value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your journal..." /><kbd>⌘ K</kbd></div>
        <div className="filters">
          <span className="filter-label"><SlidersHorizontal size={15} />Filter</span>
          <select value={mood} onChange={(event) => setMood(event.target.value)} aria-label="Filter by mood"><option value="">All moods</option>{MOODS.map((item) => <option value={item.value} key={item.value}>{item.emoji} {item.label}</option>)}</select>
          <select value={tag} onChange={(event) => setTag(event.target.value)} aria-label="Filter by tag"><option value="">All tags</option>{tags.map((item) => <option value={item} key={item}>#{item}</option>)}</select>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" />
          {(mood || tag || date || search) && <button className="clear-filters" onClick={() => { setMood(""); setTag(""); setDate(""); setSearch(""); }}>Clear</button>}
        </div>
      </div>
      {loading ? <div className="loading-state">Opening your journal…</div> : entries.length ? (
        <div className="entry-ledger">
          <div className="entry-table-head"><span>Date</span><span>Entry</span><span>Tags</span><span>Mood</span><span>Length</span><span>Action</span></div>
          <div className="entries-grid">{entries.map((entry) => <EntryCard entry={entry} key={entry.id} onFavorite={toggleFavorite} />)}</div>
        </div>
      ) : (
        <div className="empty-state"><span>{favoritesOnly ? "☆" : "✦"}</span><h2>{favoritesOnly ? "No favorites yet" : "No entries found"}</h2><p>{favoritesOnly ? "Star an entry to keep it close." : "Try changing your search or begin a new page."}</p></div>
      )}
    </>
  );
}
