# AGENTS.md

> Primary instruction file for all AI agents (Claude Code, Codex, Cursor, Windsurf).
> Read this fully. It is self-contained for daily work. Only open `docs/` when a task needs that specific detail.

## Source of Truth Hierarchy

When sources conflict, follow this order (top wins):

1. **AGENTS.md** (this file) - workflow & rules
2. **docs/ARCHITECTURE.md** - structure & boundaries
3. **docs/DECISIONS.md** - locked technical choices
4. **docs/API.md** - API contracts
5. **docs/BACKEND.md** - backend implementation rules
6. **docs/DATABASE.md** - database, RLS, storage rules
7. **docs/PAYMENTS.md** - payment and marketplace money-flow rules
8. **docs/FRONTEND.md** - universal frontend/UI rules
9. **docs/UI_UX.md** - product-specific design direction
10. Existing code patterns
11. Your own judgment

Never override a higher source with a lower one without flagging it.

## When to Open Each Doc (don't read preemptively - saves tokens)

| Open this            | Only when the task involves                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| docs/PRD.md          | Scope/feature questions, "should we build X"                                           |
| docs/FEATURES.md     | Building or scoping a specific feature module                                          |
| docs/PROGRESS.md     | Building product features; tracking what's done, in progress, and how features connect |
| docs/ARCHITECTURE.md | Adding folders, cross-package imports, new module                                      |
| docs/FRONTEND.md     | Any apps/web UI work - rendering, data fetching, performance, design/UX                |
| docs/UI_UX.md        | Product-specific visual identity, UX direction, navigation model, page UX map          |
| docs/BACKEND.md      | Any apps/server work - routes, middleware, services, validation, backend tests         |
| docs/DATABASE.md     | Supabase/Postgres schema, RLS, Storage, indexes, migrations, data lifecycle            |
| docs/PAYMENTS.md     | Payments, checkout, refunds, settlement, payouts, marketplace money flow               |
| docs/REFERENCES.md   | Starting visual design; need non-generic reference sites for a product vertical        |
| docs/DECISIONS.md    | Choosing a lib, DB, pattern (check if already decided)                                 |
| docs/API.md          | Any endpoint work                                                                      |
| docs/QUALITY.md      | Before marking a task done                                                             |

## Tech Stack (locked)

Rationale lives in `docs/DECISIONS.md`. Don't introduce an alternative to any of these without a new ADR.

| Layer           | Choice                                                         |
| --------------- | -------------------------------------------------------------- |
| Monorepo        | pnpm · Turborepo · TypeScript                                  |
| Frontend        | Next.js (App Router) · React · Tailwind CSS · shadcn/ui        |
| Backend         | Node.js · Hono · Zod (validation)                              |
| Database        | Supabase - PostgreSQL                                          |
| Auth            | Supabase Auth                                                  |
| Storage         | Supabase Storage                                               |
| Payments        | Midtrans - **only** when the project takes payments            |
| Deploy          | See `docs/DECISIONS.md` ADR-007                                |
| Large AI models | Hugging Face - **only** when the project involves large models |

Stack rules:

- Shared request/response **contracts are Zod schemas in `packages/types`**; infer TS types from them so web + server can't drift.
- Supabase: the anon key is public (`NEXT_PUBLIC_*`); the **service-role key is server-only** - never import it into `apps/web`.
- Large AI models are **never bundled** into the app - call Hugging Face (Inference API / Endpoints) from `apps/server`.
- Custom model handoff lives in root `huggingface/`. Put model weights/checkpoints under `huggingface/models/` or exported artifacts under `huggingface/artifacts/`; those files are ignored for normal GitHub pushes.
- Payments: integrate **Midtrans** from `apps/server`. The **server key is server-only**; the browser uses the public `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` for Snap. The webhook is verified by **signature hash**, never Bearer auth. See ADR-012.
- Marketplace payments are not assumed to be solved by normal Midtrans checkout. For multi-seller, split settlement, seller payout, or platform-as-merchant-of-record flows, read `docs/PAYMENTS.md` first.
- Auth extras are **Supabase-native**: OAuth (Google, GitHub) and password reset run through the Supabase SDK with providers and redirect URLs configured in the dashboard; profile pictures go to a Supabase **Storage** bucket with RLS. See ADR-013.
- Frontend is **pre-wired** (ADR-014): shadcn is configured (`components.json` -> `packages/ui`), Tailwind maps the `globals.css` tokens, and `cn()` plus a retuned reference `Button` exist. Do **not** re-init shadcn or accept its default theme. The **`shadcn-ui` skill** drives the UI workflow and lint blocks the worst generic-AI class tells. See `docs/FRONTEND.md`.

## Workflow

1. Confirm which app/package you're touching: `apps/web`, `apps/server`, or `packages/*`.
2. Match existing patterns in that folder before inventing new ones.
3. Shared logic goes in `packages/` - never duplicate across apps.
4. Building product features → keep `docs/PROGRESS.md` current: derive the build map from `docs/FEATURES.md`, `docs/UI_UX.md`, `docs/API.md`, and the relevant domain docs (`FRONTEND`, `BACKEND`, `DATABASE`, `PAYMENTS` only when they apply); mark each item in progress and done, and note how it connects to other features.
5. Finish → self-check against `docs/QUALITY.md` Definition of Done.
6. Made a real architectural choice → append to `docs/DECISIONS.md`.

## Running & Verifying

| Action      | Command                                                          |
| ----------- | ---------------------------------------------------------------- |
| Install     | `pnpm install`                                                   |
| Dev (all)   | `pnpm dev`                                                       |
| Dev one app | `pnpm --filter @repo/web dev` · `pnpm --filter @repo/server dev` |
| Lint        | `pnpm lint`                                                      |
| Typecheck   | `pnpm typecheck`                                                 |
| Test        | `pnpm test`                                                      |
| Docs check  | `pnpm docs:check`                                                |
| Verify      | `pnpm verify`                                                    |
| DB diff     | `pnpm db:diff -- -f <migration_name>`                            |
| DB reset    | `pnpm db:reset`                                                  |
| DB types    | `pnpm db:types`                                                  |
| DB push     | `pnpm db:push`                                                   |
| Format      | `pnpm format`                                                    |

Before marking a task done, run `pnpm verify` and check the Definition of Done in `docs/QUALITY.md`. Run `pnpm docs:check` when docs changed or when initializing product docs. For `apps/web` UI work, also render the app and self-review it against `docs/FRONTEND.md` and the product direction in `docs/UI_UX.md` before calling it done. Green lint/typecheck does not catch an AI-generic layout.

## Git & Tooling Hygiene

Keep the public repo looking human-authored.

- **Commits:** short and concise, one line, imperative mood. No long bodies, no multi-paragraph messages.
- **No AI references** in commits, PR text, or history. Never mention Claude/Codex/agents, `.claude`, `.codex`, "generated with", or co-author trailers.
- **Git ignore strategy:** `.gitignore` is active from the first clone - universal entries (`node_modules`, `.env`, build output, model weights) are always ignored. The agent tooling and internal docs (`.claude/`, `AGENTS.md`, `docs/`, ...) are listed but **commented out**, so the full starter kit stays tracked in this template.
- **Keep local tooling out of product repos.** In a real product repo, uncomment the "Product-repo cleanup" block at the bottom of `.gitignore`, then run `git rm -r --cached` on those paths once so the agent folders and internal docs stop being tracked.
- **Python:** use **`uv`** for deps / venv / running scripts, never `pip` or raw `venv`.

## Architecture Discipline

- **`apps/web`** = frontend only. **`apps/server`** = backend only. No crossing.
- **`packages/`** = shared, reusable, app-agnostic code:
  - `packages/ui` - design system / shared components
  - `packages/types` - shared TypeScript types
  - `packages/utils` - pure, framework-agnostic helpers
  - `packages/config` - shared configs (tsconfig, eslint, etc.)
- **`huggingface/`** = optional Hugging Face handoff workspace for model cards, Space files, and upload-ready assets. It is not a web/server/package runtime.
- **Feature-based**: group by feature, not by file type. A feature owns its components, hooks, services, and types.
- **Import boundaries**: apps import from `packages/*`. Packages NEVER import from apps. Features never import from sibling features directly - go through a shared layer.

## Anti-Overengineering Rules

- Don't add abstraction until used **3+ times**. Two usages = copy-paste is fine.
- No barrel `index.ts` re-exports unless it removes real import noise.
- No new dependency if stdlib / existing dep covers it. If you add one, log it in DECISIONS.md.
- No premature generics, no "future-proof" config nobody asked for.
- Delete dead code immediately. Don't comment it out.

## Consistency Rules

- Naming: `kebab-case` files, `PascalCase` components, `camelCase` functions/vars, `SCREAMING_SNAKE_CASE` constants.
- One responsibility per file. If a file does two things, split it.
- Co-locate tests next to source: `thing.ts` + `thing.test.ts`.
- Types live with their feature; only truly shared types go to `packages/types`.

## DO

- ✅ Reuse from `packages/` before writing new code
- ✅ Keep frontend/backend boundaries clean
- ✅ Match the naming + folder conventions exactly
- ✅ Update the relevant doc when you change its domain
- ✅ Ask before introducing a new top-level folder
- ✅ If `docs/PRD.md` is still a blank template, ask the user for scope before building features - don't invent it
- ✅ For product UI work, fill or update `docs/UI_UX.md` from the user's design direction before generating implementation tasks
- ✅ Start the app at a real landing page with a navbar and footer; only protected routes redirect to sign in (see `docs/FRONTEND.md`)
- ✅ Ship one theme and one language (English) first; add a second theme or locale only when the product needs it

## DON'T

- ❌ Duplicate logic across `apps/web` and `apps/server`
- ❌ Import app code into a package
- ❌ Add a state manager / ORM / heavy lib without a DECISIONS.md entry
- ❌ Restructure folders without updating ARCHITECTURE.md
- ❌ Leave `.env` secrets in code or commit `.env`
- ❌ Read all docs at session start - open them on demand only
