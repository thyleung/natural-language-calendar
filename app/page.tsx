"use client";

import { useState, useEffect } from "react";
import type { CalendarEvent } from "@/types";
import { parseCommand } from "@/lib/parseCommand";
import { loadEvents, saveEvents } from "@/lib/storage";
import CommandInput from "@/components/CommandInput";
import DraftCard from "@/components/DraftCard";
import EventList from "@/components/EventList";
import styles from "./page.module.css";

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function HomePage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [draft, setDraft] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  function handleCommand(input: string) {
    const parsed = parseCommand(input);

    const newDraft: CalendarEvent = {
      ...parsed,
      id: generateId(),
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    setDraft(newDraft);
  }

  function handleConfirm() {
    if (!draft) return;

    const confirmed: CalendarEvent = {
      ...draft,
      status: "confirmed",
    };

    setEvents((prev) => [...prev, confirmed]);
    setDraft(null);
  }

  function handleDiscard() {
    setDraft(null);
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <h1 className={styles.title}>
            Natural Language Calendar
          </h1>

          <p className={styles.subtitle}>
            Type a command in plain English to create a calendar event.
          </p>
        </header>

        <section>
          <CommandInput
            onSubmit={handleCommand}
            disabled={!!draft}
          />
        </section>

        {draft && (
          <section>
            <DraftCard
              draft={draft}
              onChange={setDraft}
              onConfirm={handleConfirm}
              onDiscard={handleDiscard}
            />
          </section>
        )}

        <section className={styles.eventsSection}>
          <div className={styles.eventsHeader}>
            <h2 className={styles.eventsTitle}>
              Confirmed Events
            </h2>
          </div>

          <EventList
            events={events}
            onDelete={handleDelete}
          />
        </section>

      </div>
    </main>
  );
}