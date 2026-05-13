"use client";

import type { CalendarEvent } from "@/types";
import {
  formatDate,
  formatTime,
  formatDuration,
} from "@/lib/dateUtils";

import styles from "./EventList.module.css";

interface Props {
  events: CalendarEvent[];
  onDelete: (id: string) => void;
}

export default function EventList({
  events,
  onDelete,
}: Props) {

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>

        <p className={styles.emptyTitle}>
          No confirmed events yet.
        </p>

      </div>
    );
  }

  const sorted = [...events].sort((a, b) => {
    const da = `${a.date}T${a.time}`;
    const db = `${b.date}T${b.time}`;

    return da.localeCompare(db);
  });

  return (
    <ul className={styles.list}>
      {sorted.map((ev) => (
        <EventItem
          key={ev.id}
          event={ev}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function EventItem({
  event,
  onDelete,
}: {
  event: CalendarEvent;
  onDelete: (id: string) => void;
}) {
  return (
    <li className={styles.item}>

      <div className={styles.colorBar} />

      <div className={styles.content}>

        <p className={styles.title}>
          {event.title}
        </p>

        <div className={styles.meta}>
          <span>📅 {formatDate(event.date)}</span>
          <span>🕐 {formatTime(event.time)}</span>
          <span>⏱ {formatDuration(event.duration)}</span>
        </div>

        {event.notes && (
          <p className={styles.notes}>
            {event.notes}
          </p>
        )}

      </div>

      <button
        onClick={() => onDelete(event.id)}
        aria-label="Delete event"
        className={styles.deleteButton}
      >
        ✕
      </button>

    </li>
  );
}