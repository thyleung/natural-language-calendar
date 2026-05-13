export type EventStatus = "draft" | "confirmed";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;       // ISO date string: "2025-06-01"
  time: string;       // "HH:MM" 24-hour
  duration: number;   // minutes
  notes: string;
  status: EventStatus;
  createdAt: string;  // ISO timestamp
}

export type ParsedDraft = Omit<CalendarEvent, "id" | "status" | "createdAt">;