"use client";

import type { ReactNode } from "react";
import type { CalendarEvent } from "@/types";
import styles from "./DraftCard.module.css";

interface Props {
  draft: CalendarEvent;
  onChange: (updated: CalendarEvent) => void;
  onConfirm: () => void;
  onDiscard: () => void;
}

export default function DraftCard({
  draft,
  onChange,
  onConfirm,
  onDiscard,
}: Props) {

  function update<K extends keyof CalendarEvent>(
    key: K,
    value: CalendarEvent[K]
  ) {
    onChange({
      ...draft,
      [key]: value,
    });
  }

  return (
    <div className={styles.card}>

      <div className={styles.header}>
        <span className={styles.badge}>
          Draft Event
        </span>

        <span className={styles.helper}>
          Edit any field before confirming
        </span>
      </div>

      <div className={styles.fields}>

        <Field label="Title">
          <input
            type="text"
            value={draft.title}
            onChange={(e) => update("title", e.target.value)}
            className={styles.input}
          />
        </Field>

        <div className={styles.row}>

          <Field label="Date">
            <input
              type="date"
              value={draft.date}
              onChange={(e) => update("date", e.target.value)}
              className={styles.input}
            />
          </Field>

          <Field label="Time">
            <input
              type="time"
              value={draft.time}
              onChange={(e) => update("time", e.target.value)}
              className={styles.input}
            />
          </Field>

        </div>

        <Field label="Duration (minutes)">
          <input
            type="number"
            min={5}
            step={5}
            value={draft.duration}
            onChange={(e) =>
              update("duration", Number(e.target.value))
            }
            className={styles.input}
          />
        </Field>

        <Field label="Notes">
          <textarea
            rows={2}
            value={draft.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={`${styles.input} ${styles.textarea}`}
          />
        </Field>

      </div>

      <div className={styles.actions}>

        <button
          onClick={onDiscard}
          className={styles.secondaryButton}
        >
          Discard
        </button>

        <button
          onClick={onConfirm}
          disabled={!draft.title.trim()}
          className={styles.primaryButton}
        >
          ✓ Confirm Event
        </button>

      </div>

    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
      </span>

      {children}
    </label>
  );
}