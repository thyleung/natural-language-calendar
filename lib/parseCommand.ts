import type { ParsedDraft } from "@/types";
import { addDays, addWeeks, nextDayOfWeek, setTimeFromKeyword } from "./dateUtils";

export function parseCommand(input: string): ParsedDraft {
  const text = input.trim();
  const lower = text.toLowerCase();

  const title = extractTitle(text);

  const date = extractDate(lower);

  const time = extractTime(lower);

  const duration = extractDuration(lower);

  const notes = `Parsed from: "${text}"`;

  return { title, date, time, duration, notes };
}

function extractTitle(text: string): string {
  // Strip leading verbs ("create", "add", "schedule", "book", "set up", "remind me to")
  let cleaned = text
    .replace(/^(create|add|schedule|book|set\s+up|remind\s+me\s+to)\s+/i, "")
    .replace(/\b(a|an)\s+/i, "");

  // Strip trailing date/time phrases
  cleaned = cleaned
    .replace(/\b(today|tomorrow|next\s+\w+|in\s+\d+\s+\w+|this\s+\w+)\b.*/i, "")
    .replace(/\bat\s+\d{1,2}(:\d{2})?\s*(am|pm)?.*/i, "")
    .replace(/\bfor\s+\d+\s+(hour|minute|min|hr).*/i, "")
    .trim();

  // Capitalise first letter
  return cleaned.length > 0
    ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    : "New Event";
}

function extractDate(lower: string): string {
  const today = new Date();

  if (/\btoday\b/.test(lower)) return toISODate(today);
  if (/\btomorrow\b/.test(lower)) return toISODate(addDays(today, 1));

  // "in N days" / "in N weeks"
  const inDays = lower.match(/\bin\s+(\d+|a|an)\s+day/);
  if (inDays) {
    const n = toInt(inDays[1]);
    return toISODate(addDays(today, n));
  }
  const inWeeks = lower.match(/\bin\s+(\d+|a|an)\s+week/);
  if (inWeeks) {
    const n = toInt(inWeeks[1]);
    return toISODate(addWeeks(today, n));
  }

  // "next Monday" etc.
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  for (let i = 0; i < days.length; i++) {
    if (new RegExp(`\\bnext\\s+${days[i]}\\b`).test(lower)) {
      return toISODate(nextDayOfWeek(today, i));
    }
  }

  // "this Monday" etc.
  for (let i = 0; i < days.length; i++) {
    if (new RegExp(`\\bthis\\s+${days[i]}\\b`).test(lower)) {
      return toISODate(nextDayOfWeek(today, i, true));
    }
  }

  // Default: tomorrow
  return toISODate(addDays(today, 1));
}

function extractTime(lower: string): string {
  // Explicit "at HH:MM am/pm" or "at HH am/pm"
  const explicit = lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (explicit) {
    let hours = parseInt(explicit[1], 10);
    const mins = parseInt(explicit[2] ?? "0", 10);
    const meridiem = explicit[3];
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
    return `${pad(hours)}:${pad(mins)}`;
  }

  return setTimeFromKeyword(lower);
}

function extractDuration(lower: string): number {
  const hours = lower.match(/\bfor\s+(\d+(?:\.\d+)?|a|an)\s+hour/);
  if (hours) return Math.round(toFloat(hours[1]) * 60);

  const mins = lower.match(/\bfor\s+(\d+)\s+(min|minute)/);
  if (mins) return parseInt(mins[1], 10);

  return 60; // default 1 hour
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toInt(s: string): number {
  if (s === "a" || s === "an") return 1;
  return parseInt(s, 10) || 1;
}

function toFloat(s: string): number {
  if (s === "a" || s === "an") return 1;
  return parseFloat(s) || 1;
}