"use client";

import { useState, type FormEvent } from "react";
import styles from "./CommandInput.module.css";

interface Props {
  onSubmit: (input: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const EXAMPLES = [
  "Schedule a dentist appointment tomorrow at 2pm",
  "Create a grooming appointment for Sophie in 2 weeks",
  "Add team standup next Monday at 9am for 30 minutes",
  "Book a lunch meeting this Friday at noon",
];

export default function CommandInput({ onSubmit, disabled, loading }: Props) {
  const [value, setValue] = useState("");
  const [placeholder] = useState(
    () => EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.row}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={styles.button}
        >
          {loading ? "…" : "Parse →"}
        </button>
      </form>
      <p className={styles.hint}>Try: &ldquo;{EXAMPLES[0]}&rdquo;</p>
    </div>
  );
}