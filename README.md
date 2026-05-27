# Natural Language Calendar

Exploring how natural language can be turned into structured calendar events using rule-based parsing, LLMs, and Promptfoo.

🔗 Live Demo: https://natural-language-calendar.vercel.app/

<img width="591" height="800" alt="Screenshot 2026-05-27 at 5 09 48 PM" src="https://github.com/user-attachments/assets/6fe096b3-3f96-4b1d-a481-77c8dc102dde" />

This app lets users type calendar commands like:

- “lunch friday”
- “haircut after work”
- “meeting in 30 minutes”

and compares how a rule-based parser and an LLM interpret them.

The interesting part quickly became ambiguity:
- What does “Friday” mean?
- Should “lunch” imply noon?
- How much should the system assume?
