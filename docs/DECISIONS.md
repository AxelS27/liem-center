# Decisions (ADR)

> Append-only. Log only **major** technical/product decisions. Newest at the bottom.
> Format below. Never delete an entry - mark it `Superseded` instead.

---

### Template

```
## ADR-NNN: <Title>
- Decision:   <what was chosen>
- Reason:     <why>
- Rejected:   <alternatives considered and why not>
- Status:     Accepted | Superseded by ADR-XXX | Deprecated
- Date:       YYYY-MM-DD
```

---

## ADR-001: Monorepo with pnpm + Turborepo

- Decision: Single repo, pnpm workspaces, Turborepo for task orchestration.
- Reason: Shared types/utils/ui across web + server without publishing packages; one install, cached builds.
- Rejected: Polyrepo (sync overhead); npm/yarn workspaces (slower, weaker hoisting); Nx (heavier than needed).
- Status: Accepted
- Date: 2026-01-01

## ADR-002: AGENTS.md as single AI source of truth

- Decision: `AGENTS.md` holds all agent rules; `CLAUDE.md` redirects to it.
- Reason: Avoids duplicated/conflicting instructions across tools; one file to maintain.
- Rejected: Separate per-tool instruction files (drift risk).
- Status: Accepted
- Date: 2026-01-01

## ADR-003: Frontend - Next.js (App Router) + React + Tailwind + shadcn/ui

- Decision: Next.js App Router on React for `apps/web`; Tailwind CSS for styling; shadcn/ui as the component layer (lives in `packages/ui`).
- Reason: RSC/SSR out of the box, huge ecosystem; Tailwind + shadcn give an ownable, copy-in design system with no runtime lock-in.
- Rejected: Vite SPA (no SSR/routing batteries); component libs like MUI/Chakra (heavier, less ownable than shadcn).
- Status: Accepted
- Date: 2026-05-29

## ADR-004: Backend - Hono on Node.js + Zod

- Decision: Hono for `apps/server`; Zod for all input validation.
- Reason: Tiny, fast, Web-standard API; runs on Node now and ports to edge/serverless later. Zod gives runtime validation + inferred types from one schema.
- Rejected: Express (dated, no types, heavier); Fastify (fine, but heavier than needed and less edge-portable).
- Status: Accepted
- Date: 2026-05-29

## ADR-005: Supabase as the data platform (Postgres + Auth + Storage)

- Decision: Supabase for database (PostgreSQL), authentication, and file storage.
- Reason: One managed platform covers DB + auth + storage with RLS; standard Postgres underneath (no proprietary query lock-in); generous local/dev story.
- Rejected: Raw Postgres + roll-your-own auth (slow); Firebase (NoSQL, vendor lock-in); separate auth provider (more moving parts).
- Status: Accepted
- Date: 2026-05-29

## ADR-006: Shared contracts as Zod schemas in packages/types

- Decision: Request/response contracts are Zod schemas in `packages/types`; TS types are inferred from them. Server validates with the schema; client infers types from the same schema.
- Reason: Single source of truth for shape + validation; frontend and backend physically cannot drift.
- Rejected: Hand-written TS interfaces (no runtime check, drift); OpenAPI codegen (heavier toolchain for this size).
- Status: Accepted
- Date: 2026-05-29

## ADR-007: Deployment - Vercel, Docker optional

- Decision: Vercel is the default deploy target (web certainly; server where it fits). Docker provided only when a target needs it.
- Reason: Zero-config Next.js deploys, preview envs, edge network. Docker kept optional to avoid forcing container ops on every project.
- Rejected: Mandatory Docker/k8s for all projects (overkill for most).
- Status: Accepted
- Date: 2026-05-29

## ADR-008: Large AI models via Hugging Face (conditional)

- Decision: When a project involves large AI models, serve them through Hugging Face (Inference API or Inference Endpoints), called from `apps/server`. Models are never bundled into the app or run in the browser.
- Reason: Offloads GPU/serving ops; keeps large weights out of the Node process and the client bundle; swappable model hosting.
- Rejected: Self-hosted GPU inference (ops burden); shipping models client-side (size, security).
- Status: Accepted (applies only to AI-model projects)
- Date: 2026-05-29

## ADR-009: Enforcement layer - strict TS base + ESLint flat config with import boundaries

- Decision: `packages/config` ships a strict TypeScript base and a flat ESLint config that bans importing apps and restricts feature imports to their public index. CI runs lint + typecheck + test.
- Reason: Architecture rules that aren't enforced drift over long AI sessions; making them executable (lint/type errors + CI) keeps agents on the rails.
- Rejected: Docs-only conventions (honor-system, drifts); heavier boundary tooling like Nx tags (more than needed here).
- Status: Accepted
- Date: 2026-05-29

## ADR-010: Internationalization via centralized locale dictionaries

- Decision: All user-facing text lives in per-language JSON dictionaries under `apps/web/src/i18n/locales` (`en.json`, `id.json`, ...). English is the default and source of truth. The active locale lives in the URL (`app/[lang]/...`); server components read text via `getDictionary(locale)`, typed from `en.json`.
- Reason: Centralizes copy so adding a language is a one-file change; URL-based locale is shareable and SEO-friendly; typing from the default catches missing or renamed keys at compile time. No runtime i18n dependency needed at this scope.
- Rejected: Hardcoded strings in components (drift, blocks a second language); a full i18n library such as next-intl or react-intl (more than needed now; adopt later if pluralization/formatting demands it).
- Status: Accepted
- Date: 2026-05-29

## ADR-011: Hugging Face handoff folder for custom models

- Decision: Root `huggingface/` is the optional handoff workspace for model cards, Hugging Face Space files, and upload-ready custom model artifacts. Model weights/checkpoints live under `huggingface/models/` or `huggingface/artifacts/`, which are ignored by normal GitHub pushes.
- Reason: Custom model work needs a clear place that is separate from `apps/web`, `apps/server`, and TypeScript packages, while still making Hugging Face uploads easy from the project folder.
- Rejected: `apps/model` (implies a deployable app inside the pnpm workspace); `packages/model` (packages are shared TypeScript code); committing model files to the main GitHub repo (large and inappropriate without a Hugging Face/Git LFS flow).
- Status: Accepted
- Date: 2026-05-29

## ADR-012: Payments via Midtrans

- Decision: When a project takes payments, integrate Midtrans (Snap) from `apps/server`. The server creates the transaction with the Midtrans **server key** and returns a Snap token; the browser opens Snap with the public **client key**. Payment status is confirmed by a server **webhook (HTTP notification)** that is verified by signature hash, not the Bearer token.
- Reason: Midtrans is a standard Indonesian gateway (cards, bank transfer, e-wallets, QRIS) with a hosted Snap UI, so no card data touches our servers. Server-side token creation keeps the secret key off the client; the signature check makes the callback trustworthy and the source of truth for order status.
- Rejected: Stripe (weak local payment-method coverage for Indonesia); client-side-only charging (exposes the secret key, no reliable confirmation); building our own gateway (PCI scope, not worth it).
- Status: Accepted (applies only to projects that take payments)
- Date: 2026-05-29

## ADR-013: Auth surface - Supabase email/password + OAuth (Google, GitHub) + password reset + avatars in Storage

- Decision: Build the standard auth surface on Supabase Auth (see ADR-005): email/password with email **password reset**, plus **OAuth** sign-in with **Google and GitHub**. Profile pictures upload to a Supabase **Storage** bucket (e.g. `avatars`) under a per-user path with RLS; the resulting public URL is stored on the user's profile row.
- Reason: These are baseline expectations for a real product and Supabase covers all of them natively, so no extra auth service or storage provider is needed. Providers, secrets, and redirect URLs are configured in the Supabase dashboard; the app just calls the Supabase SDK.
- Rejected: A separate auth provider such as Auth0/Clerk (more moving parts; ADR-005 already chose Supabase); storing avatars as base64 in Postgres or on a third-party CDN (Storage already exists and supports RLS).
- Status: Accepted
- Date: 2026-05-29

## ADR-014: Frontend pre-wired - shadcn/ui configured, token-mapped Tailwind, lint-enforced design tells

- Decision: Ship `apps/web` with shadcn/ui already wired instead of leaving each product to `shadcn init`. `components.json` points components into `packages/ui`; `apps/web/tailwind.config.ts` maps the `globals.css` tokens to Tailwind (`darkMode: 'class'`) and defines the house type scale; `packages/ui` ships `cn()` and one retuned reference `Button`. ESLint (`packages/config/eslint/next`) blocks the most common generic-AI class tells (viewport-height section fillers, raw palette classes, hex in `className`). A `.claude/skills/shadcn-ui` skill drives the customization workflow and the FRONTEND.md render-and-review pass.
- Reason: The repeated failure was AI-built UIs reading as "generic shadcn default." Root cause: the template made every product re-init shadcn, and defaults (neutral theme, untouched components) entered at that step. Wiring the deterministic parts once removes the default path; lint makes the worst tells unshippable; the skill turns the passive FRONTEND.md checklist into an executed procedure. Tailwind config lives in `apps/web` (not a shared preset) because there is a single frontend consumer (Anti-Overengineering).
- Rejected: Docs-only guidance (the FRONTEND.md rules were already being ignored); a shared `packages/config` Tailwind preset (premature abstraction for one consumer); hardcoding a single brand palette into the template (creates a uniform "template look" across products - the skill forces a per-product palette instead).
- Status: Accepted
- Date: 2026-05-31

## ADR-015: Product-specific UI/UX brief in docs/UI_UX.md

- Decision: Add `docs/UI_UX.md` as the product-specific design source of truth. `docs/FRONTEND.md` remains the universal frontend rulebook; `docs/UI_UX.md` captures the user's design direction, selected references, visual system, navigation model, page UX map, copy tone, and product-specific UI non-goals. `docs/PROGRESS.md` must synthesize both files into implementation tasks.
- Reason: The template needs to support different products without polluting universal frontend rules with one project's taste. A separate UI/UX brief keeps each product's design direction explicit and reusable across long agent sessions while still making `FRONTEND.md` the higher-priority guardrail.
- Rejected: Putting product design direction in `FRONTEND.md` (would make the template mutate per product); putting it only in `PROGRESS.md` (turns the checklist into a design spec); relying only on chat context (lost across sessions).
- Status: Accepted
- Date: 2026-05-31

## ADR-016: Domain docs for backend, database, and payments

- Decision: Add focused domain docs: `docs/BACKEND.md`, `docs/DATABASE.md`, and `docs/PAYMENTS.md`. Keep `docs/ARCHITECTURE.md` as the boundary overview and `docs/API.md` as the contract reference. Agents read domain docs only when the task touches that domain, and `docs/PROGRESS.md` synthesizes applicable domain tasks into the active checklist.
- Reason: The template needs more depth than a single architecture doc can hold, especially for backend validation, Supabase/RLS, and payment/marketplace money flow. Splitting these concerns keeps context small during normal work while making the important rules discoverable when needed.
- Rejected: One giant architecture/spec doc (too much to read every turn); putting backend/database/payment rules only in AGENTS.md (too long for daily workflow); making every domain doc mandatory for every task (wastes context and encourages stale reading).
- Status: Accepted
- Date: 2026-05-31
