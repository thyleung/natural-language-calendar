"use client";

import styles from "./ParserModeSelector.module.css";

export type ParserMode = "rule-based" | "llm" | "compare";

interface Props {
  mode: ParserMode;
  onChange: (mode: ParserMode) => void;
  disabled?: boolean;
}

const MODES: { value: ParserMode; label: string; description: string }[] = [
  { value: "rule-based", label: "Rule-based", description: "Instant keyword heuristics" },
  { value: "llm",        label: "LLM",        description: "Simulated AI interpretation" },
  { value: "compare",    label: "Compare",    description: "Run both side-by-side" },
];

export default function ParserModeSelector({ mode, onChange, disabled }: Props) {
  return (
    <div className={styles.group} role="group" aria-label="Parser mode">
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(m.value)}
          title={m.description}
          className={`${styles.button} ${mode === m.value ? styles.active : ""}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}