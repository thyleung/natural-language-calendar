/** Add N calendar days to a Date */
export function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

/** Add N weeks to a Date */
export function addWeeks(d: Date, n: number): Date {
  return addDays(d, n * 7);
}

/**
 * Return the next occurrence of a weekday (0=Sun … 6=Sat).
 * If `allowSame` is true and today is that day, return today.
 */
export function nextDayOfWeek(from: Date, targetDay: number, allowSame = false): Date {
  const result = new Date(from);
  const current = result.getDay();
  let diff = targetDay - current;
  if (diff < 0 || (diff === 0 && !allowSame)) diff += 7;
  result.setDate(result.getDate() + diff);
  return result;
}

/**
 * Map vague time keywords to a default HH:MM string.
 * Falls back to "09:00" if nothing matches.
 */
export function setTimeFromKeyword(lower: string): string {
  if (/\bevening\b|\bnight\b/.test(lower)) return "19:00";
  if (/\bafternoon\b/.test(lower)) return "14:00";
  if (/\bmidday\b|\bnoon\b/.test(lower)) return "12:00";
  if (/\bmorning\b/.test(lower)) return "09:00";
  if (/\blunch\b/.test(lower)) return "12:30";
  if (/\bbreakfast\b/.test(lower)) return "08:00";
  return "09:00";
}

/** Format an ISO date string to a human-friendly label */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Convert "HH:MM" 24h → "H:MM AM/PM" */
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Format duration in minutes → "1 hr 30 min" style */
export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}