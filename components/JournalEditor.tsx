"use client";

import { Bold, Check, Heading2, Italic, List, ListOrdered, Quote, Save, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatEntryDate, JournalEntry, todayKey, wordCount } from "@/lib/journal";
import { MoodSelector } from "./MoodSelector";
import { TagSelector } from "./TagSelector";

type Draft = {
  title: string;
  content: string;
  mood: string | null;
  favorite: boolean;
  entryDate: string;
  tags: string[];
};

export function JournalEditor({ initialEntry }: { initialEntry?: JournalEntry }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [entryId, setEntryId] = useState(initialEntry?.id);
  const [draft, setDraft] = useState<Draft>({
    title: initialEntry?.title ?? "",
    content: initialEntry?.content ?? "",
    mood: initialEntry?.mood ?? null,
    favorite: initialEntry?.favorite ?? false,
    entryDate: initialEntry ? initialEntry.entryDate.slice(0, 10) : todayKey(),
    tags: initialEntry?.tags.map((tag) => tag.name) ?? [],
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dirty, setDirty] = useState(false);
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const save = useCallback(async () => {
    const current = draft;
    if (!current.title.trim() && !current.content.trim()) return;
    setStatus("saving");
    try {
      const response = await fetch(entryId ? `/api/entries/${entryId}` : "/api/entries", {
        method: entryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      if (!response.ok) throw new Error("Could not save");
      const saved: JournalEntry = await response.json();
      setDirty(false);
      setStatus("saved");
      if (!entryId) {
        setEntryId(saved.id);
        window.history.replaceState(null, "", `/entries/${saved.id}/edit`);
      }
      window.setTimeout(() => setStatus((value) => value === "saved" ? "idle" : value), 1800);
    } catch {
      setStatus("error");
    }
  }, [draft, entryId]);

  useEffect(() => {
    if (!dirty) return;
    const timeout = window.setTimeout(save, 1000);
    return () => window.clearTimeout(timeout);
  }, [draft, dirty, save]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const format = (before: string, after = before, fallback = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = draft.content.slice(start, end) || fallback;
    update("content", `${draft.content.slice(0, start)}${before}${selected}${after}${draft.content.slice(end)}`);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const lineFormat = (prefix: string, fallback: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = draft.content.lastIndexOf("\n", start - 1) + 1;
    const selected = draft.content.slice(lineStart, textarea.selectionEnd) || fallback;
    update("content", `${draft.content.slice(0, lineStart)}${selected.split("\n").map((line) => `${prefix}${line}`).join("\n")}${draft.content.slice(textarea.selectionEnd)}`);
    requestAnimationFrame(() => textarea.focus());
  };

  const editorSize = typeof window === "undefined" ? "medium" : localStorage.getItem("journal-font-size") || "medium";
  const showCount = typeof window === "undefined" ? true : localStorage.getItem("journal-word-count") !== "off";

  return (
    <div className="editor-page">
      <div className="editor-topbar">
        <button className="back-link" onClick={() => router.back()} type="button">← Back</button>
        <div className={`save-status ${status}`} aria-live="polite">
          {status === "saving" && <><span className="status-spinner" />Saving…</>}
          {status === "saved" && <><Check size={14} />Saved</>}
          {status === "error" && <>Couldn&apos;t save — try again</>}
          {status === "idle" && <span>Autosaved locally</span>}
        </div>
        <button className="button secondary compact" type="button" onClick={save}><Save size={16} />Save</button>
      </div>
      <section className="editor-sheet">
        <div className="editor-date-row">
          <label><span>Entry date</span><input type="date" value={draft.entryDate} onChange={(event) => update("entryDate", event.target.value)} /></label>
          <button type="button" className={`favorite-toggle ${draft.favorite ? "active" : ""}`} onClick={() => update("favorite", !draft.favorite)}>
            <Star size={18} fill={draft.favorite ? "currentColor" : "none"} />{draft.favorite ? "Favorited" : "Favorite"}
          </button>
        </div>
        <p className="editor-date-display">{formatEntryDate(`${draft.entryDate}T12:00:00Z`)}</p>
        <input
          className="title-input"
          value={draft.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Give this entry a title..."
          aria-label="Entry title"
        />
        <div className="editor-options">
          <div><span className="field-label">How are you feeling?</span><MoodSelector value={draft.mood} onChange={(value) => update("mood", value)} /></div>
          <div><span className="field-label">Tags</span><TagSelector tags={draft.tags} onChange={(value) => update("tags", value)} /></div>
        </div>
        <div className="format-toolbar" role="toolbar" aria-label="Text formatting">
          <button type="button" onClick={() => format("**", "**", "bold text")} title="Bold"><Bold size={17} /></button>
          <button type="button" onClick={() => format("_", "_", "italic text")} title="Italic"><Italic size={17} /></button>
          <button type="button" onClick={() => lineFormat("## ", "Heading")} title="Heading"><Heading2 size={17} /></button>
          <span className="toolbar-divider" />
          <button type="button" onClick={() => lineFormat("- ", "List item")} title="Bulleted list"><List size={17} /></button>
          <button type="button" onClick={() => lineFormat("1. ", "List item")} title="Numbered list"><ListOrdered size={17} /></button>
          <button type="button" onClick={() => lineFormat("> ", "Quote")} title="Quote"><Quote size={17} /></button>
        </div>
        <textarea
          ref={textareaRef}
          className={`content-editor font-${editorSize}`}
          value={draft.content}
          onChange={(event) => update("content", event.target.value)}
          placeholder="What's on your mind?"
          aria-label="Journal entry"
        />
        <div className="editor-footer">
          {showCount && <span>{wordCount(draft.content).toLocaleString()} words</span>}
          <span>⌘ S to save</span>
        </div>
      </section>
    </div>
  );
}
