"use client";

import { MOODS } from "@/lib/journal";

export function MoodSelector({ value, onChange }: { value: string | null; onChange: (mood: string | null) => void }) {
  return (
    <div className="mood-selector" role="group" aria-label="Choose a mood">
      {MOODS.map((mood) => (
        <button
          type="button"
          key={mood.value}
          className={`mood-choice ${value === mood.value ? "selected" : ""}`}
          onClick={() => onChange(value === mood.value ? null : mood.value)}
          aria-pressed={value === mood.value}
        >
          <span>{mood.emoji}</span>{mood.label}
        </button>
      ))}
    </div>
  );
}
