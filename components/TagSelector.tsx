"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export function TagSelector({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const name = input.trim().toLowerCase().replace(/^#/, "");
    if (name && !tags.includes(name) && tags.length < 12) onChange([...tags, name]);
    setInput("");
  };

  return (
    <div className="tag-editor">
      {tags.map((tag) => (
        <span className="tag-pill" key={tag}>#{tag}<button type="button" onClick={() => onChange(tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}><X size={12} /></button></span>
      ))}
      <div className="tag-input-wrap">
        <Plus size={14} />
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(); }
          }}
          onBlur={add}
          placeholder="Add a tag"
          aria-label="Add a tag"
        />
      </div>
    </div>
  );
}
