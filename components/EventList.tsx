"use client";

import type { CalendarEvent } from "@/types";
import { formatDate, formatTime, formatDuration } from "@/lib/dateUtils";
import styles from "./EventList.module.css";

interface Props {
  events: CalendarEvent[];
  onDelete: (id: string) => void;
}

export default function EventList({ events, onDelete }: Props) {
  if (events.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyPrimary}>No confirmed events yet.</p>
        <p className={styles.emptySecondary}>Parse a command above to get started.</p>
      </div>
    );
  }

  const sorted = [...events].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );

  return (
    <ul className={styles.list}>
      {sorted.map((ev) => (
        <li key={ev.id} className={styles.item}>
          <div className={styles.bar} />
          <div className={styles.content}>
            <p className={styles.itemTitle}>{ev.title}</p>
            <div className={styles.itemMeta}>
              <span>📅 {formatDate(ev.date)}</span>
              <span>🕐 {formatTime(ev.time)}</span>
              <span>⏱ {formatDuration(ev.duration)}</span>
            </div>
            {ev.notes && <p className={styles.itemNotes}>{ev.notes}</p>}
          </div>
          <button
            onClick={() => onDelete(ev.id)}
            aria-label="Delete event"
            className={styles.deleteBtn}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}