# CONTINUE — Resume Work in a New Chat

Use this every time you open a fresh chat about a product that is already underway.
For the first-time setup, use `INIT.md` instead.

---

## The idea

A new chat starts with no memory of past chats. The project's context does not live in the
old conversation; it lives in the repo docs. The agent gets context by reading them.

- Conventions, stack, and UI rules load automatically: Claude Code reads `CLAUDE.md`, which
  points to `AGENTS.md`. You do not need to paste those.
- Project state (what is built, what is next, how features connect) lives in
  `docs/engineering/PROGRESS.md`. The agent reads it on request.

## Kickoff prompt

Paste this at the start of the new chat:

```text
Read AGENTS.md and docs/engineering/PROGRESS.md first to load the project state.
Then continue with: <your task, e.g. "build the checkout page">

Open only the domain docs the task needs (UI_UX, API, DATABASE, PAYMENTS, etc.)
per the table in AGENTS.md. Do not read every doc.
For UI work, follow docs/engineering/DESIGN_DNA.md and run its code-based double-check before done.
```

That is enough. The agent reads PROGRESS for state and opens the right domain doc for the
task. Do not ask it to read every doc at once — the template is built for lazy loading, and
reading everything wastes tokens.

## End every session (the part that makes the next chat work)

The next chat is only as accurate as the docs. Before you close this one, confirm the agent
updated whatever changed:

- `docs/engineering/PROGRESS.md` — mark what is now done and what is in progress
- `docs/engineering/DECISIONS.md` — append any real technical or product decision
- `docs/product/UI_UX.md` — record any product design change
- Run `pnpm docs:check` if docs changed, and `pnpm verify` before calling work done

If these are kept current, the next fresh chat reads PROGRESS and is immediately in sync.
If they are stale, the next agent will not know what was done and may repeat or break work.
