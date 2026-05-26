import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const today = () => new Date().toISOString().slice(0, 10);

const SYSTEM_PROMPT = `You are a calendar event parser. Given a natural language command, extract event details and return ONLY a valid JSON object — no markdown, no explanation.

Today's date is ${today()}. Use this to resolve relative dates like "tomorrow", "next Monday", "in 2 weeks".

Return exactly this shape:
{
  "title": string,           // concise event title, no filler words
  "date": string,            // ISO date: YYYY-MM-DD
  "time": string,            // 24-hour HH:MM
  "duration": number,        // minutes
  "notes": string,           // brief plain-text note
  "confidence": number,      // 0.0–1.0
  "assumptions": string[]    // list any fields you had to guess
}`;

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: input }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}