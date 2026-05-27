export type EventStatus = "draft" | "confirmed";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
  status: EventStatus;
  createdAt: string;
}

export type ParserSource = "rule-based" | "llm";

export type ParsedDraft = Omit<CalendarEvent, "id" | "status" | "createdAt"> & {
  source?: ParserSource;
  confidence?: number;
  assumptions?: string[];
};