# INIT — Start a New Product

Use this once, when you first set up a product from this template.
For continuing work in a later chat, use `CONTINUE.md` instead.

---

## 1. Clone and install

```bash
git clone https://github.com/AxelS27/liem-monorepo.git my-product
cd my-product
pnpm install
cp .env.example .env
```

Fill `.env` with the values that apply (Supabase URL + keys; Midtrans keys only if the
product takes payments; Hugging Face token only if it uses large models).

## 2. Give the agent this prompt

Paste your PRD / product brief where marked, then send the whole block in a fresh chat:

```text
Read HOW_TO_USE_THIS_TEMPLATE.md and AGENTS.md first.
Initialize this product from the brief below.

=== PRODUCT BRIEF ===
<paste your PRD / product description here: what it is, who it is for,
goals, non-goals, the main features, and any design direction>
=== END BRIEF ===

Then, in order:
1. Fill docs/PRD.md and docs/FEATURES.md from the brief.
2. Read docs/DESIGN_DNA.md, then fill docs/UI_UX.md from my design direction.
   The starter UI in apps/web is the foundation: keep its white background,
   open-band layout, sticky nav, font wiring, and footer. Record what changes
   per product (accent color, content, routes), not a redesign from scratch.
3. Initialize only the domain docs that apply: API, BACKEND, DATABASE, PAYMENTS.
4. Generate docs/PROGRESS.md as the live build checklist (pointer-based, not a duplicate spec).
5. Run pnpm docs:check and report warnings separately from failures.

Do not start implementation until the docs are synchronized. Show me the filled
docs first so I can review before any code is written.
```

## 3. Review the docs, then build

- Read the docs the agent filled. Correct anything wrong before code is written.
- When the docs are right, tell the agent to start building from `docs/PROGRESS.md`.
- `pnpm dev` to run.

## 4. What the agent must follow while building

- Build on `apps/web/`, do not regenerate from scratch.
- Background stays white. Only the accent/brand color changes.
- After any UI work, run the code-based double-check at the bottom of `docs/DESIGN_DNA.md`
  (grep + read three files, no rendering).
- Keep `docs/PROGRESS.md` current as work happens.

## 5. End every session

Before you close the chat, make sure the agent updated:

- `docs/PROGRESS.md` — what is done and in progress
- `docs/DECISIONS.md` — any real technical decision made
- `docs/UI_UX.md` — any product design change

This is what lets the next chat pick up context. See `CONTINUE.md`.
