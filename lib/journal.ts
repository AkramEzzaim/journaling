export const MOODS = [
  { value: "great", emoji: "😄", label: "Great", color: "#dff3e6" },
  { value: "good", emoji: "🙂", label: "Good", color: "#e9f2df" },
  { value: "okay", emoji: "😐", label: "Okay", color: "#f5eed8" },
  { value: "low", emoji: "😔", label: "Low", color: "#e8e9f3" },
  { value: "bad", emoji: "😣", label: "Bad", color: "#f4e1df" },
] as const;

export type MoodValue = (typeof MOODS)[number]["value"];

export type JournalEntry = {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  favorite: boolean;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
};

export type JournalInsights = {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
  longestStreak: number;
  mostCommonMood: string | null;
  entriesThisMonth: number;
  moodDistribution: { mood: string; count: number }[];
};

export function dateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function localDateToStored(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

export function formatEntryDate(value: string | Date, options?: Intl.DateTimeFormatOptions) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

export function wordCount(content: string) {
  return content.trim() ? content.trim().split(/\s+/).length : 0;
}

export function previewText(content: string, max = 170) {
  const clean = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*>]\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export function moodDetails(value: string | null) {
  return MOODS.find((mood) => mood.value === value) ?? null;
}
