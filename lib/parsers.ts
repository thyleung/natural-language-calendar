import type { ParsedDraft } from "@/types";
import { parseCommandRuleBased } from "./parseCommand";

// ── Interface ─────────────────────────────────────────────────────────────────

/**
 * All parsers satisfy this interface.
 * parse() is async so real LLM calls drop in without changing callers.
 */
export interface CommandParser {
  readonly name: string;
  parse(input: string): Promise<ParsedDraft>;
}

// ── Rule-based parser ─────────────────────────────────────────────────────────

export const RuleBasedParser: CommandParser = {
  name: "Rule-based",
  async parse(input: string): Promise<ParsedDraft> {
    // Synchronous under the hood — wrapped in a promise for interface parity.
    return parseCommandRuleBased(input);
  },
};

// ── LLM parser ────────────────────────────────────────────────────────────────

/**
 * Calls the Next.js API route at /api/parse, which proxies to Claude server-side
 * so the API key is never exposed to the browser.
 */
export const LLMParser: CommandParser = {
  name: "LLM",
  async parse(input: string): Promise<ParsedDraft> {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`LLM parse failed: ${err}`);
    }

    const data = await res.json();

    return {
      title:       data.title       ?? "New Event",
      date:        data.date        ?? new Date().toISOString().slice(0, 10),
      time:        data.time        ?? "09:00",
      duration:    data.duration    ?? 60,
      notes:       data.notes       ?? "",
      source:      "llm",
      confidence:  data.confidence  ?? 0.8,
      assumptions: data.assumptions ?? [],
    };
  },
};