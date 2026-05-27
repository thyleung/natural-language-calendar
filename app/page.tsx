"use client";

import { useState, useEffect } from "react";
import type { CalendarEvent, ParsedDraft } from "@/types";
import { RuleBasedParser, LLMParser } from "@/lib/parsers";
import { loadEvents, saveEvents } from "@/lib/storage";
import CommandInput from "@/components/CommandInput";
import ParserModeSelector, { type ParserMode } from "@/components/ParserModeSelector";
import DraftCard from "@/components/DraftCard";
import CompareView from "@/components/CompareView";
import EventList from "@/components/EventList";
import styles from "./page.module.css";

type DraftWithMeta = CalendarEvent & {
  source?: ParsedDraft["source"];
  confidence?: ParsedDraft["confidence"];
  assumptions?: ParsedDraft["assumptions"];
};

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function parsedToEvent(parsed: ParsedDraft): DraftWithMeta {
  return {
    ...parsed,
    id: generateId(),
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mode, setMode] = useState<ParserMode>("rule-based");
  const [draft, setDraft] = useState<DraftWithMeta | null>(null);
  const [comparing, setComparing] = useState<{
    ruleBased: ParsedDraft | null;
    llm: ParsedDraft | null;
    llmLoading: boolean;
  } | null>(null);
  const [parsing, setParsing] = useState(false);

  useEffect(() => { setEvents(loadEvents()); }, []);
  useEffect(() => { saveEvents(events); }, [events]);

  async function handleCommand(input: string) {
    if (mode === "rule-based") {
      setParsing(true);
      const parsed = await RuleBasedParser.parse(input);
      setDraft(parsedToEvent(parsed));
      setParsing(false);
    } else if (mode === "llm") {
      setParsing(true);
      const parsed = await LLMParser.parse(input);
      setDraft(parsedToEvent(parsed));
      setParsing(false);
    } else {
      const rbParsed = await RuleBasedParser.parse(input);
      setComparing({ ruleBased: rbParsed, llm: null, llmLoading: true });
      LLMParser.parse(input).then((llmParsed) => {
        setComparing((prev) =>
          prev ? { ...prev, llm: llmParsed, llmLoading: false } : null
        );
      });
    }
  }

  function handleConfirm() {
    if (!draft) return;
    setEvents((prev) => [...prev, { ...draft, status: "confirmed" }]);
    setDraft(null);
  }

  function handleDiscard() {
    setDraft(null);
    setComparing(null);
  }

  function handleUseFromCompare(parsed: ParsedDraft) {
    setDraft(parsedToEvent(parsed));
    setComparing(null);
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const busy = parsing || !!draft || !!comparing;

  return (
    <main className={styles.main}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <h1>Natural Language Calendar</h1>
          <p>Type a command in plain English to create a calendar event.</p>
        </header>

        <section>
          <span className={styles.sectionLabel}>Parser mode</span>
          <ParserModeSelector mode={mode} onChange={setMode} disabled={busy} />
        </section>

        <section>
          <CommandInput onSubmit={handleCommand} disabled={busy} loading={parsing} />
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

        {comparing && (
          <section>
            <CompareView
              ruleBased={comparing.ruleBased}
              llm={comparing.llm}
              loading={comparing.llmLoading}
              onUse={handleUseFromCompare}
              onDiscard={handleDiscard}
            />
          </section>
        )}

        <section>
          <div className={styles.eventsHeader}>
            <span className={styles.eventsTitle}>Confirmed Events</span>
            {events.length > 0 && (
              <span className={styles.badge}>{events.length}</span>
            )}
          </div>
          <EventList events={events} onDelete={handleDelete} />
        </section>

      </div>
    </main>
  );
}