"use client";

import type { ReactNode } from "react";
import type { CalendarEvent, ParsedDraft } from "@/types";
import styles from "./DraftCard.module.css";

type DraftWithMeta = CalendarEvent & Pick<ParsedDraft, "source" | "confidence" | "assumptions">;

interface Props {
  draft: DraftWithMeta;
  onChange: (updated: DraftWithMeta) => void;
  onConfirm: () => void;
  onDiscard: () => void;
}

export default function DraftCard({ draft, onChange, onConfirm, onDiscard }: Props) {
  function update<K extends keyof DraftWithMeta>(key: K, value: DraftWithMeta[K]) {
    onChange({ ...draft, [key]: value });
  }

  const confClass =
    draft.confidence === undefined ? "" :
    draft.confidence >= 0.8 ? styles.confidenceHigh :
    draft.confidence >= 0.6 ? styles.confidenceMid :
                               styles.confidenceLow;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.label}>Draft Event</span>
          {draft.source && (
            <span className={styles.sourceBadge}>
              {draft.source === "llm" ? "LLM" : "Rule-based"}
            </span>
          )}
          {draft.confidence !== undefined && (
            <span className={`${styles.confidence} ${confClass}`}>
              {Math.round(draft.confidence * 100)}%
            </span>
          )}
        </div>
        <span className={styles.headerHint}>Edit any field before confirming</span>
      </div>

      {draft.assumptions && draft.assumptions.length > 0 && (
        <div className={styles.assumptions}>
          <p className={styles.assumptionsTitle}>Parser assumptions:</p>
          <ul className={styles.assumptionsList}>
            {draft.assumptions.map((a, i) => (
              <li key={i}><span>⚠</span>{a}</li>
            ))}
          </ul>
        </div>
      )}

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
            onChange={(e) => update("duration", Number(e.target.value))}
            className={styles.input}
          />
        </Field>

        <Field label="Notes">
          <textarea
            rows={2}
            value={draft.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={styles.textarea}
          />
        </Field>
      </div>

      <div className={styles.actions}>
        <button onClick={onDiscard} className={styles.btnDiscard}>Discard</button>
        <button
          onClick={onConfirm}
          disabled={!draft.title.trim()}
          className={styles.btnConfirm}
        >
          ✓ Confirm Event
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}