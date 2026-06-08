# AGENTS.md

> Primary instruction file for all AI agents (Claude Code, Codex, Cursor, Windsurf).
> Read this fully. It is self-contained for daily work. Only open `docs/` when a task needs that specific detail.

## Source of Truth Hierarchy

When sources conflict, follow this order (top wins):

1. **AGENTS.md** (this file) - workflow & rules
2. **docs/engineering/ARCHITECTURE.md** - structure & boundaries
3. **docs/engineering/DECISIONS.md** - locked technical choices
4. **docs/engineering/API.md** - API contracts
5. **docs/engineering/BACKEND.md** - backend implementation rules
6. **docs/engineering/DATABASE.md** - database, RLS, storage rules
7. **docs/engineering/PAYMENTS.md** - payment and marketplace money-flow rules
8. **docs/engineering/FRONTEND.md** - universal frontend/UI rules
9. **docs/product/UI_UX.md** - product-specific design direction
10. Existing code patterns
11. Your own judgment

Never override a higher source with a lower one without flagging it.

## When to Open Each Doc (don't read preemptively - saves tokens)

| Open this                           | Only when the task involves                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| docs/product/PRD.md                 | Scope/feature questions, "should we build X"                                                |
| docs/product/FEATURES.md            | Building or scoping a specific feature module                                               |
| docs/engineering/PROGRESS.md        | Building product features; tracking what's done, in progress, and how features connect      |
| docs/engineering/ARCHITECTURE.md    | Adding folders, cross-package imports, new module                                           |
| docs/engineering/DESIGN_DNA.md      | **Any apps/web UI work — read this first.** Short rules: palette, composition, nav, spacing |
| docs/engineering/FRONTEND.md        | Detailed UI rules — open only when DESIGN_DNA.md doesn't cover the specific question        |
| docs/product/UI_UX.md               | Product-specific visual identity, UX direction, navigation model, page UX map               |
| docs/verticals/\*.md                | Starting a product in a known vertical (ecommerce, SaaS, fintech, marketplace, etc.)        |
| docs/engineering/BACKEND.md         | Any apps/server work - routes, middleware, services, validation, backend tests              |
| docs/engineering/DATABASE.md        | Supabase/Postgres schema, RLS, Storage, indexes, migrations, data lifecycle                 |
| docs/engineering/PAYMENTS.md        | Payments, checkout, refunds, settlement, payouts, marketplace money flow                    |
| docs/product/REFERENCES.md          | Starting visual design; need non-generic reference sites for a product vertical             |
| docs/engineering/DECISIONS.md       | Choosing a lib, DB, pattern (check if already decided)                                      |
| docs/engineering/API.md             | Any endpoint work                                                                           |
| docs/engineering/QUALITY.md         | Before marking a task done                                                                  |
| docs/checklists/new-product.md      | Initializing a new product from this template — fill docs and setup env first               |
| docs/checklists/code-review.md      | Before approving a PR or calling a task done — multi-axis quality check                     |
| docs/checklists/launch-readiness.md | Before going live — functionality, perf, security, UI, a11y, deployment                     |

## UI Critical Rules

> Inline so you don't need to open any doc for simple UI tasks.
> For more detail: `docs/engineering/DESIGN_DNA.md`. For full rules: `docs/engineering/FRONTEND.md`.

- **Build on `apps/web/` — don't regenerate from scratch.** Extend the existing code.
- **Background stays white.** Only change the accent/brand color (`--primary`, `--ring`). Never warm the background to cream/beige.
- **Hero is never wrapped in a card.** Open band, fits first viewport (~720px) without scrolling.
- **One focal point in the first viewport** — the headline + primary action. No heavy `bg-foreground`/near-black panel in the hero; it steals the eye. Dark/inverted surfaces are for late-page CTA bands and the footer. In a split hero, the side panel must be lighter than the headline column (`bg-secondary`/`bg-muted`, not solid black).
- **Sections = open bands by default.** Cards only for product listings, data panels, dialogs. Not as a default wrapper for every section.
- **Sticky nav** — `sticky top-0 bg-background/80 border-b border-border backdrop-blur` — with `aria-current="page"` on the active link. Never put `overflow-x-hidden` on a sticky ancestor (it kills sticky — use `overflow-x-clip`). Keep header bg partly transparent (`/80`) or the blur shows nothing.
- **Font must be wired** — `next/font` → `--font-sans` in layout.tsx. Unset = browser serif fallback = instant AI tell.
- **Max 3 font weights**: 400 · 500/600 · 700. No 300, no 800/900.
- **4px spacing grid** — valid: 4 8 12 16 20 24 32 40 48 64 80 96px. No `p-[10px]` or other arbitrary values.
- **Animate `transform` and `opacity` only.** Never `width`, `height`, `top`, `left`. Max 800ms. Gate behind `prefers-reduced-motion`.
- **Every interactive element** needs: hover (150ms) · focus ring (2px accent + 2px offset) · active (scale 0.98).
- **Mandatory double-check before done**: run the two-part checklist at the bottom of `docs/engineering/DESIGN_DNA.md` ("Mandatory double-check after ANY frontend work"). It is code-based — no rendering needed. Part A is mechanical greps (run them, paste output) that catch silent traps like `overflow-x-hidden` killing sticky; Part B is reading 3 files and reasoning about the markup. Do not call UI work done without it.

## Tech Stack (locked)

Rationale lives in `docs/engineering/DECISIONS.md`. Don't introduce an alternative to any of these without a new ADR.

| Layer           | Choice                                                         |
| --------------- | -------------------------------------------------------------- |
| Monorepo        | pnpm · Turborepo · TypeScript                                  |
| Frontend        | Next.js (App Router) · React · Tailwind CSS · shadcn/ui        |
| Backend         | Node.js · Hono · Zod (validation)                              |
| Database        | Supabase - PostgreSQL                                          |
| Auth            | Supabase Auth                                                  |
| Storage         | Supabase Storage                                               |
| Payments        | Midtrans - **only** when the project takes payments            |
| Deploy          | See `docs/engineering/DECISIONS.md` ADR-007                    |
| Large AI models | Hugging Face - **only** when the project involves large models |

Stack rules:

- Shared request/response **contracts are Zod schemas in `packages/types`**; infer TS types from them so web + server can't drift.
- Supabase: the anon key is public (`NEXT_PUBLIC_*`); the **service-role key is server-only** - never import it into `apps/web`.
- Large AI models are **never bundled** into the app - call Hugging Face (Inference API / Endpoints) from `apps/server`.
- Custom model handoff lives in root `huggingface/`. Put model weights/checkpoints under `huggingface/models/` or exported artifacts under `huggingface/artifacts/`; those files are ignored for normal GitHub pushes.
- Payments: integrate **Midtrans** from `apps/server`. The **server key is server-only**; the browser uses the public `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` for Snap. The webhook is verified by **signature hash**, never Bearer auth. See ADR-012.
- Marketplace payments are not assumed to be solved by normal Midtrans checkout. For multi-seller, split settlement, seller payout, or platform-as-merchant-of-record flows, read `docs/engineering/PAYMENTS.md` first.
- Auth extras are **Supabase-native**: OAuth (Google, GitHub) and password reset run through the Supabase SDK with providers and redirect URLs configured in the dashboard; profile pictures go to a Supabase **Storage** bucket with RLS. See ADR-013.
- Frontend is **pre-wired** (ADR-014): shadcn is configured (`components.json` -> `packages/ui`), Tailwind maps the `globals.css` tokens, and `cn()` plus a retuned reference `Button` exist. The starter page (`apps/web/src/app/page.tsx`) is the **design foundation** — build on it, do not replace it with a fresh generation. Change the palette (accent only, keep background white), content, and routes per product; keep the open-band layout, nav shell, font wiring, and footer structure unless `docs/product/UI_UX.md` explicitly calls for something different. Do **not** re-init shadcn or accept its default theme. The **`shadcn-ui` skill** drives the UI workflow and lint blocks the worst generic-AI class tells. See `docs/engineering/DESIGN_DNA.md` (short) and `docs/engineering/FRONTEND.md` (detailed).

## Workflow

1. Confirm which app/package you're touching: `apps/web`, `apps/server`, or `packages/*`.
2. Match existing patterns in that folder before inventing new ones.
3. Shared logic goes in `packages/` - never duplicate across apps.
4. Building product features → keep `docs/engineering/PROGRESS.md` current: derive the build map from `docs/product/FEATURES.md`, `docs/product/UI_UX.md`, `docs/engineering/API.md`, and the relevant domain docs (`FRONTEND`, `BACKEND`, `DATABASE`, `PAYMENTS` only when they apply); mark each item in progress and done, and note how it connects to other features.
5. Finish → self-check against `docs/engineering/QUALITY.md` Definition of Done.
6. Made a real architectural choice → append to `docs/engineering/DECISIONS.md`.

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

Before marking a task done, run `pnpm verify` and check the Definition of Done in `docs/engineering/QUALITY.md`. Run `pnpm docs:check` when docs changed or when initializing product docs. For `apps/web` UI work: read `docs/engineering/DESIGN_DNA.md` first (short), run the code-based double-check at the bottom of that file (Part A greps + Part B file reading, no rendering), then open `docs/engineering/FRONTEND.md` only if you need more detail. For a thorough multi-axis check, run the **`ui-audit` skill**. Green lint/typecheck does not catch an AI-generic layout — the grep + markup review is the real gate.

## Git & Tooling Hygiene

Keep the public repo looking human-authored.

- **Commits:** short and concise, one line, imperative mood. No long bodies, no multi-paragraph messages.
- **No AI references** in commits, PR text, or history. Never mention Claude/Codex/agents, `.claude`, `.codex`, "generated with", or co-author trailers.
- **Git ignore strategy:** `.gitignore` is active from the first clone - universal entries (`node_modules`, `.env`, build output, model weights) are always ignored. The agent tooling and internal docs (`.claude/`, `AGENTS.md`, `docs/`, ...) are listed but **commented out**, so the full starter kit stays tracked in this template.
- **Keep local tooling out of product repos.** In a real product repo, uncomment the "Product-repo cleanup" block at the bottom of `.gitignore`, then run `git rm -r --cached` on those paths once so the agent folders and internal docs stop being tracked.
- **Python:** use **`uv`** for deps / venv / running scripts, never `pip` or raw `venv`.

## Iron Laws

These five rules are supreme. They override all other decisions. If anything conflicts with an Iron Law, the Iron Law wins.

1. **One File = One Responsibility.** If you cannot describe a file's purpose in five words, split it. A file whose name contains "and" or "or" needs splitting.

2. **UI Renders Data. It Never Creates It.** Components receive data as props or from hooks. Components never compute business logic, call APIs, or transform raw data inline. If a component is doing math or filtering, move it to `packages/utils/` or a custom hook.

3. **Modules Are Islands. They Don't Talk.** A feature never imports directly from a sibling feature. Shared data goes through `packages/` or an app-level shared layer (context, shared hooks, `components/shared/`). Cross-feature imports create invisible coupling.

4. **Show Something Instantly. Always.** The user must see content within 100ms of navigation. No blank white screens. No full-page spinners. Every loading state uses a skeleton that matches the exact shape of the real content.

5. **Every Interaction Has a Response.** Every button click, hover, focus, and form submission must have visible feedback. Silent UI is broken UI. Every interactive element must respond visibly within 80ms.

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
- ✅ If `docs/product/PRD.md` is still a blank template, ask the user for scope before building features - don't invent it
- ✅ For product UI work, read `docs/engineering/DESIGN_DNA.md` first, then fill or update `docs/product/UI_UX.md` from the user's design direction. The starter UI (`apps/web/`) is the **design foundation** — build on it. Change the accent palette (keep background white), content, and routes per product. Only deviate from the open-band layout structure when `docs/product/UI_UX.md` explicitly calls for a different composition.
- ✅ For a known product vertical, read the matching `docs/verticals/*.md` playbook first and use it to fill `docs/product/UI_UX.md`. The playbook informs the product brief; it does not override `docs/engineering/FRONTEND.md`.
- ✅ Start the app at a real landing page with a navbar and footer; only protected routes redirect to sign in (see `docs/engineering/FRONTEND.md`)
- ✅ Keep public, auth, app, and mobile navigation visible, route-aware, and connected: nav has a surface/background, active links use `aria-current="page"`, app routes can get back to public/product home, and every route has a context-aware footer/endcap.
- ✅ Use rich text with restraint where it improves scanning: useful emphasis, inline links, captions, metadata, helper text, short lists, and callouts. Do not make pages flat plaintext or decorative markdown clutter.
- ✅ Ship one theme and one language (English) first; add a second theme or locale only when the product needs it

## DON'T

- ❌ Duplicate logic across `apps/web` and `apps/server`
- ❌ Import app code into a package
- ❌ Add a state manager / ORM / heavy lib without a DECISIONS.md entry
- ❌ Restructure folders without updating ARCHITECTURE.md
- ❌ Leave `.env` secrets in code or commit `.env`
- ❌ Read all docs at session start - open them on demand only
