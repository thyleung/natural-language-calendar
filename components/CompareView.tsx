"use client";

import type { ParsedDraft } from "@/types";
import { formatDate, formatTime, formatDuration } from "@/lib/dateUtils";
import styles from "./CompareView.module.css";

interface Props {
  ruleBased: ParsedDraft | null;
  llm: ParsedDraft | null;
  loading: boolean;
  onUse: (draft: ParsedDraft) => void;
  onDiscard: () => void;
}

export default function CompareView({ ruleBased, llm, loading, onUse, onDiscard }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <span className={styles.heading}>Compare Results</span>
        <button onClick={onDiscard} className={styles.discard}>Discard ✕</button>
      </div>
      <div className={styles.grid}>
        <ResultCard
          draft={ruleBased}
          loading={false}
          variant="blue"
          label="Rule-based"
          onUse={onUse}
        />
        <ResultCard
          draft={llm}
          loading={loading}
          variant="violet"
          label="LLM"
          onUse={onUse}
        />
      </div>
    </div>
  );
}

interface CardProps {
  draft: ParsedDraft | null;
  loading: boolean;
  variant: "blue" | "violet";
  label: string;
  onUse: (draft: ParsedDraft) => void;
}

function ResultCard({ draft, loading, variant, label, onUse }: CardProps) {
  const cardCls   = variant === "blue" ? styles.cardBlue   : styles.cardViolet;
  const labelCls  = variant === "blue" ? styles.labelBlue  : styles.labelViolet;
  const btnCls    = variant === "blue" ? styles.useBtnBlue : styles.useBtnViolet;

  const confClass = !draft?.confidence ? "" :
    draft.confidence >= 0.8 ? styles.confHigh :
    draft.confidence >= 0.6 ? styles.confMid  : styles.confLow;

  return (
    <div className={`${styles.card} ${cardCls}`}>
      <div className={styles.cardHeader}>
        <span className={`${styles.cardLabel} ${labelCls}`}>{label}</span>
        {draft?.confidence !== undefined && (
          <span className={`${styles.confidence} ${confClass}`}>
            {Math.round(draft.confidence * 100)}%
          </span>
        )}
      </div>

      {loading && (
        <div className={styles.skeleton}>
          <div className={`${styles.bone} ${styles.bone1}`} />
          <div className={`${styles.bone} ${styles.bone2}`} />
          <div className={`${styles.bone} ${styles.bone3}`} />
        </div>
      )}

      {!loading && draft && (
        <>
          <p className={styles.title}>{draft.title}</p>
          <div className={styles.meta}>
            <span>📅 {formatDate(draft.date)}</span>
            <span>🕐 {formatTime(draft.time)}</span>
            <span>⏱ {formatDuration(draft.duration)}</span>
          </div>

          {draft.assumptions && draft.assumptions.length > 0 && (
            <div className={styles.assumptionsBlock}>
              <p className={styles.assumptionsHeading}>Assumptions</p>
              <ul className={styles.assumptionsList}>
                {draft.assumptions.map((a, i) => (
                  <li key={i}><span>⚠</span>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onUse(draft)}
            className={`${styles.useBtn} ${btnCls}`}
          >
            Use {label} Draft →
          </button>
        </>
      )}
    </div>
  );
}