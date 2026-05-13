"use client";

import { useState } from "react";
import styles from "./CommandInput.module.css";

interface Props {
  onSubmit: (input: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  "Schedule a dentist appointment tomorrow at 2pm",
  "Create a grooming appointment for Doggo in 2 weeks",
  "Add team standup next Monday at 9am for 30 minutes",
  "Book a lunch meeting this Friday at noon",
];

export default function CommandInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const trimmed = value.trim();

    if (!trimmed) {
        return;
    }

    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your event description here..."
          disabled={disabled}
          className={styles.input}
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={styles.button}
        >
          Parse
        </button>
      </form>

      <p className={styles.helper}>
        Try: &ldquo;{EXAMPLES[0]}&rdquo;
      </p>
    </div>
  );
}