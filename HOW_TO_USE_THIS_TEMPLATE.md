# How to Use This Template

Internal guide for starting a new project from this monorepo template. The public `README.md` is a non-technical overview of whatever you build.

## What this is

An AI-native, production-grade monorepo template optimized for AI coding agents (Claude Code and Codex). Documentation-first, low-noise, strict-architecture. Copy the folder, fill the docs, build.

For stack decisions and rationale, read `docs/DECISIONS.md`. For folder boundaries, read `docs/ARCHITECTURE.md`. Domain rules live in focused docs: `docs/FRONTEND.md`, `docs/BACKEND.md`, `docs/DATABASE.md`, and `docs/PAYMENTS.md`. Product-specific design direction lives in `docs/UI_UX.md`.

All docs are living documents. Start with the templates, then keep them synchronized as the product changes. Do not treat the initial version as final.

The starter UI in `apps/web` is the **design foundation** — build on it, do not replace it
with a fresh generation. It ships with open-band composition, a clean white surface, sticky
nav with active states, real font wiring, and a structured footer: these are the defaults
to keep. Per product, change the accent palette (keep background white), content, copy,
and routes. Only deviate from the layout structure when `docs/UI_UX.md` explicitly calls
for a different composition. See `docs/DESIGN_DNA.md` for the short rules.

## Start a new project

1. Copy this folder to the new project location, or create a new repo from the GitHub template.
2. `pnpm install`
3. Copy `.env.example` to `.env` and fill in the values.
4. Fill `docs/PRD.md` with the product scope: what this is, who it is for, goals, non-goals, and product principles.
5. Fill `docs/FEATURES.md` with concrete modules and capabilities, tagged `P0`, `P1`, or `P2`.
6. Give the agent your design direction, short or detailed, and ask it to fill `docs/UI_UX.md` from that brief plus `docs/DESIGN_DNA.md` and `docs/REFERENCES.md`. The starter UI is the foundation — `UI_UX.md` records what changes per product (accent palette, layout deviations, content direction), not a full redesign from scratch.
7. Ask the agent to initialize the domain docs that apply to the product. It should update `docs/API.md` for endpoints, `docs/BACKEND.md` for backend conventions that matter, `docs/DATABASE.md` for data/RLS/storage needs, and `docs/PAYMENTS.md` only if the product takes payments or has marketplace money flow.
8. Ask the agent to generate `docs/PROGRESS.md` from the docs before building. It should read `PRD`, `FEATURES`, `UI_UX`, `ARCHITECTURE`, `API`, `QUALITY`, and only the domain docs that apply (`FRONTEND`, `BACKEND`, `DATABASE`, `PAYMENTS`, `REFERENCES`), then turn them into a route/area checklist.
9. Run `pnpm docs:check` after the docs are initialized. Warnings are expected while this is still a blank template, but failures mean the doc system is broken.
10. Start building from `docs/PROGRESS.md`; keep it updated before work starts, while work is in progress, and when work is done.
11. `pnpm dev`

## How AI agents work here

Read `AGENTS.md` first. It is the daily workflow source of truth and points to the right `docs/*` file when a task needs deeper detail.

When building a product, the agent reads this file first, then reads only the docs needed for the current domain. During project initialization it should synthesize the user's PRD, features, and design direction into the docs. During implementation it should open domain docs only when that domain is touched: frontend work opens `FRONTEND.md` + `UI_UX.md`, backend work opens `BACKEND.md` + `API.md`, database work opens `DATABASE.md`, and payments work opens `PAYMENTS.md`.

The agent keeps `docs/PROGRESS.md` as the live build map and task checklist: what lives on each page, how features connect, which UI/API/data pieces are needed, and what is done.

`PROGRESS.md` is a synthesis layer, not a second spec. It should include granular tasks such as navbar, hero, page shell, forms, empty states, Zod contracts, server routes, data fetching, and verification, but each task should point back to the source doc for durable detail. For example, write "Navbar - primary route links (UI_UX.md, FRONTEND.md)" and "Page shell - wide layout with small desktop gutters (UI_UX.md, FRONTEND.md)" instead of copying all navbar behavior, spacing, and margin rules into the checklist.

`UI_UX.md` is the product design brief. Use it for brand feel, references, navigation model, route connectivity, page-level UX intent, copy tone, rich-text/scannability patterns, surface/card budget, footer model, active-nav treatment, and product-specific layout choices. `FRONTEND.md` gives guardrails; `UI_UX.md` chooses the actual product composition. If they conflict, fix `UI_UX.md` instead of weakening the template rules.

The starter page is the design foundation. Build on it — change content, palette (accent
only, keep background white), and routes per product. Open `docs/DESIGN_DNA.md` before
any UI work; it is the short rules file that keeps every product on the same quality level.

During implementation, update `PROGRESS.md` before starting work, while items are in progress, and when they are done. A feature is not done just because the code exists: the checklist should also cover tests, lint/typecheck, API contract checks, doc updates, and the code-based UI self-review (the `docs/DESIGN_DNA.md` double-check, no rendering) when `apps/web` changes.

Use `pnpm docs:check` after documentation changes and `pnpm verify` before calling work done.

## First-Run Agent Prompt

After you fill the PRD or describe the product in chat, give the agent a prompt like this:

```text
Read HOW_TO_USE_THIS_TEMPLATE.md and AGENTS.md first.
Initialize this product from my PRD/design brief:
1. Fill or update docs/PRD.md and docs/FEATURES.md.
2. Read docs/DESIGN_DNA.md. Then fill docs/UI_UX.md from my design direction and docs/REFERENCES.md.
   Record what changes per product (accent color, content, routes, any layout deviations).
   The starter UI in apps/web is the foundation — do not plan a full redesign from scratch.
3. Initialize only the domain docs that apply: API, BACKEND, DATABASE, PAYMENTS.
4. Generate docs/PROGRESS.md as the live build checklist. Keep it pointer-based, not a duplicate spec.
5. Run pnpm docs:check and report warnings separately from failures.
Do not start implementation until the docs are synchronized.
```

## Domain docs

Use the focused docs to keep context small and decisions synchronized:

- `docs/PRD.md` - product scope: what, why, users, goals, non-goals, principles.
- `docs/FEATURES.md` - concrete modules and capabilities, phased as `P0`, `P1`, `P2`.
- `docs/PROGRESS.md` - live build map and task checklist synthesized from the docs.
- `docs/ARCHITECTURE.md` - repo structure, app/package boundaries, and import rules.
- `docs/DECISIONS.md` - append-only ADR log for locked technical/product decisions.
- `docs/API.md` - API conventions, envelopes, status codes, and endpoint contracts.
- `docs/DESIGN_DNA.md` - short UI rules: read before any frontend work. Palette, composition, nav, spacing, self-check.
- `docs/FRONTEND.md` - detailed UI rules — open when DESIGN_DNA doesn't cover the specific question.
- `docs/UI_UX.md` - product-specific design brief: what changes per product (palette, layout deviations, content direction).
- `docs/BACKEND.md` - server routes, services, validation, auth guards, integrations, and tests.
- `docs/DATABASE.md` - living data model catalog: tables, columns, relationships, RLS, Storage, indexes, seed data, and data lifecycle.
- `docs/PAYMENTS.md` - Midtrans, checkout, refunds, settlement, payouts, and marketplace money flow.
- `docs/REFERENCES.md` - real product references to use before visual design.
- `docs/QUALITY.md` - Definition of Done and final verification rules.

Do not read every domain doc for every task. Read the root instructions and the docs for the domain you are touching, then sync any changes back to `PROGRESS.md` and the affected spec docs.

## Verification Commands

- `pnpm docs:check` - verifies the documentation system is wired together. It fails on missing docs or missing references in this guide, and warns on starter placeholders.
- `pnpm verify` - final code gate: lint, typecheck, and tests.

## Supabase Workflow

The template uses Supabase migrations, but you do not have to hand-write every SQL file.
Use the Supabase CLI to generate diffs, then review and commit the migration.

- `pnpm db:diff -- -f <migration_name>` - generate a migration from schema diff.
- `pnpm db:new <migration_name>` - create an empty migration.
- `pnpm db:reset` - reset local Supabase and apply migrations plus `supabase/seed.sql`.
- `pnpm db:types` - regenerate `packages/types/src/database.types.ts` from local Supabase.
- `pnpm db:push` - apply committed migrations to the linked remote project.

Do not make dashboard-only production changes. Every real schema change should land in
`supabase/migrations/`, update `docs/DATABASE.md`, and regenerate database types when
applicable.

## Default Web Branding

The template includes default browser icons for projects that do not have product branding
yet:

- `apps/web/src/app/favicon.ico`
- `apps/web/src/app/icon.png`

Replace them only when the user provides a product-specific icon. Keep browser tab titles
short via Next metadata, using a compact pattern like `Dashboard | AppName` or
`Pricing | AppName`.

## Designing without the AI look

The frontend is wired to fight generic-AI output (see `docs/DESIGN_DNA.md` and the `shadcn-ui` skill), but taste is still yours to drive:

- Generate a few variations in parallel (different models or prompts), then take the best pieces from each. Don't ship the first output.
- Build on the starter UI — keep its open-band composition, white surface, and nav/footer
  shell. Change the accent palette, content, and routes per product. Only deviate from the
  layout structure when the product genuinely needs a different composition (e.g. a sidebar
  dashboard vs. a marketing page), and record that in `docs/UI_UX.md`.
- Mock the layout before wiring data, so the design isn't locked by the schema.
- Treat cards as a limited surface budget, not the default wrapper. Use open lists,
  tables, section rhythm, typography, and spacing when they communicate hierarchy better.
- Make persistent nav route-aware from the start. Public, app, auth, and mobile nav all
  need a visible surface/background treatment, a visible active state, and
  `aria-current="page"`.
- Connect route contexts both ways. From the app/dashboard, users need a clear route back
  to landing/product home; from public/auth, they need clear routes into sign in, sign up,
  or the app. Do not rely on the browser back button as navigation.
- Add a context-aware footer or footer-equivalent endcap to every route: public, app, and
  auth. The content can change by context, but the route should not end bare.
- Use rich text with restraint. Add emphasis, inline links, captions, metadata, helper
  text, short lists, or callouts where they improve scanning; avoid random bolding or
  decorative markdown clutter.
- A weekend with _Refactoring UI_ (Adam Wathan) pays off fast: hierarchy from spacing, restraint with borders, one focal point per screen.

## Before publishing a product repo

After you use this template for a real product, the public repo should read as a normal, human-made project:

- Replace `README.md` with a non-technical overview of your product: description and screenshots, no internals.
- Uncomment the "Product-repo cleanup" block at the bottom of `.gitignore` (agent folders, `AGENTS.md`, `docs/`, ...), then run `git rm -r --cached` on those paths once so they stop being tracked.
- Keep commit messages short and human, with no AI-agent references.
