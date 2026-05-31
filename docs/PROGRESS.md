# Build Progress & Feature Map

<!--
  The live map of the product build: which features live on which pages, how they
  connect, and what is done / in progress / next. This is the agent's memory across
  sessions, so a long build stays consistent instead of drifting screen by screen.

  This file does NOT define scope or specs:
    - WHAT / WHY                         -> docs/PRD.md
    - Feature capabilities + phases      -> docs/FEATURES.md
    - Product-specific UI/UX direction   -> docs/UI_UX.md
    - Structure / boundaries             -> docs/ARCHITECTURE.md
    - Universal frontend rules           -> docs/FRONTEND.md
    - Backend implementation rules        -> docs/BACKEND.md
    - Database/RLS/storage rules          -> docs/DATABASE.md
    - Payment/money-flow rules            -> docs/PAYMENTS.md
  Here you track STATUS and CONNECTIONS only. Pull feature names from FEATURES.md;
  do not restate their specs here.

  It is only useful if it matches reality. Update it before and during the work,
  not after.
-->

## How to use this (agent)

- **Read the docs first, then derive this.** Before you build or fill this file, read:
  `docs/PRD.md` (scope), `docs/FEATURES.md` (features + phases),
  `docs/UI_UX.md` (product-specific design direction), `docs/ARCHITECTURE.md`
  (structure), `docs/API.md` (contracts), and `docs/QUALITY.md` (Definition of Done).
  Then read only the domain docs that apply: `docs/FRONTEND.md`, `docs/BACKEND.md`,
  `docs/DATABASE.md`, `docs/PAYMENTS.md`, and `docs/REFERENCES.md`. This file is where
  you synthesize those docs into one working checklist.
- **Break features into concrete tasks.** Each feature becomes the real pieces of work:
  the UI parts (navbar, hero, form, table, empty state, ...) and the API / data they need.
  Granular enough to check off, ordered roughly by build phase.
- **Reference the spec, do not restate it.** A task points to where the detail lives
  (e.g. "Navbar - primary route links, see FRONTEND.md"), it does not copy the rules. Restating
  design or API detail here just creates a second copy that drifts out of date - the opposite
  of consistency. The detail stays in UI_UX.md / FRONTEND.md / API.md; this file tracks the work.
- **Wire it.** Fill "Connects to" for every area so features are built as one product
  (shared nav, shared components, server data), never as isolated screens.
- **Include all work surfaces.** A page/feature checklist should include the UI, shared
  components, data layer, API contracts, server routes, empty/loading/error states, docs,
  and verification tasks that make the feature actually done.
- **Update as you go.** Move an item to in progress before you start it, and to done
  only when its self-review against `docs/FRONTEND.md` and `docs/UI_UX.md` holds. Add a
  line to the log.
- **One focus at a time.** Keep "Now building" to 1-3 items.

Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked (say why).

## Before filling this file

Use this quick pass whenever a new product starts or the scope changes:

1. Confirm `docs/PRD.md` is filled in. If it is still the blank template, stop and ask
   for product scope before inventing features.
2. Convert `docs/FEATURES.md` modules into route/area work below. Keep the feature names
   and phases from FEATURES.md so the checklist stays traceable.
3. Pull product-specific design direction from `docs/UI_UX.md`: references, navigation
   model, page UX map, visual system, copy tone, and product-specific layout choices.
4. Pull structure and boundaries from `docs/ARCHITECTURE.md`: which work belongs in
   `apps/web`, `apps/server`, or `packages/*`.
5. Pull endpoint and schema tasks from `docs/API.md` and implementation rules from
   `docs/BACKEND.md`: every API task should mention the
   Zod contract in `packages/types` and the route in `apps/server`.
6. Pull data tasks from `docs/DATABASE.md` when the feature touches schema, tables,
   columns, relationships, RLS, storage, indexes, migrations, seed data, or data lifecycle.
7. Pull payment tasks from `docs/PAYMENTS.md` when the feature touches checkout, refunds,
   settlement, payouts, subscriptions, or marketplace money flow.
8. Pull universal UI tasks from `docs/FRONTEND.md` and visual reference context from
   `docs/REFERENCES.md`: nav, layout, spacing rhythm, states, responsiveness, and rendered
   review belong in the checklist, but the detailed rules stay in those docs.
9. Pull final verification from `docs/QUALITY.md`: lint, typecheck, tests, UI render
   review, and any doc updates needed by the change.

## Task checklist shape

Write tasks at the level where someone can work through them without reopening the whole
product plan, but must still follow the source docs for details.

Good task examples:

- `[ ]` Navbar - primary links navigate to real routes/pages, not same-page section jumps.
  (UI_UX.md "Navigation Model", FRONTEND.md "App Structure & Page Flow")
- `[ ]` Hero - product-specific headline, primary CTA, and substantial product visual;
  avoid centered filler layout. (UI_UX.md "Page UX Map", FRONTEND.md "Design Craft")
- `[ ]` Page shell - wide layout with small desktop gutters, with narrow columns only where
  the content type needs them. (UI_UX.md "Layout Principles", FRONTEND.md "Layout Checks")
- `[ ]` `GET /api/v1/projects` - list endpoint with Zod response contract in
  `packages/types`. (API.md)
- `[ ]` Empty/loading/error states - designed for this route, not raw strings or spinners.
  (FRONTEND.md "States, Errors & Responsiveness")
- `[ ]` Render review - inspect mobile plus 1366x768, 1440x900, and 1920x1080 before
  marking the page done. (FRONTEND.md "Self-review", QUALITY.md)

Avoid task examples:

- `[ ]` Build frontend` (too broad)
- `[ ]` Navbar margin 24px, links 14px, IntersectionObserver threshold 0.4...`
  (too much copied spec; put durable rules in FRONTEND.md)
- `[ ]` Add API` (too vague)

## Now building

<!-- 1-3 items max. What is actively being worked on right now. -->

- `[x]` Starter web UI - responsive landing baseline - verified by build and HTTP smoke

## Build map

<!--
  One section per page / route / area, derived from docs/FEATURES.md. Order roughly
  by build phase (P0 first). Each section should include UI, API/data, state handling,
  and verification tasks where they apply. Replace the example block below with the
  real product.
-->

### Example: Landing (`/`) <!-- delete this whole example block -->

Public marketing page. Phase: P0. Spec: UI_UX.md "Page UX Map", FRONTEND.md "App Structure", design refs in REFERENCES.md.

- `[~]` Navbar - route links for top-level pages, mobile behavior, sign in, and get started.
  (FRONTEND.md "App Structure & Page Flow")
- `[x]` Hero - headline, primary CTA, product visual; asymmetric, not a centered stack. (FEATURES: Foundation)
- `[ ]` Feature highlights - 3 anchored sections. (FEATURES: Foundation)
- `[ ]` Pricing - plan cards linking to checkout. (FEATURES: Payments)
- `[ ]` Landing states - responsive behavior and section transitions reviewed at required
  viewports. (FRONTEND.md "Self-review")
- `[ ]` Footer - product/legal links, back-to-top.

**Connects to:** navbar links -> real routes/pages; "Get started" -> `/signup`; Pricing -> checkout flow; secondary footer links may use anchors; uses the shared public layout.

### Example: Projects (`/app/projects`) <!-- delete this example block too -->

Signed-in list page. Phase: P0. Spec: FRONTEND.md "Consistent page layout"; contract in API.md.

- `[ ]` Page scaffold - reuse the shared page header + container. (see FRONTEND.md "Consistent page layout")
- `[ ]` Project list - table or cards with empty, loading, and error states. (FEATURES: Projects)
- `[ ]` `GET /api/v1/projects` - list endpoint, Zod contract in `packages/types`. (API.md)
- `[ ]` Create project - dialog + `POST /api/v1/projects`. (FEATURES: Projects, API.md)
- `[ ]` Data layer - typed fetch from `apps/web` to `apps/server`, no duplicated shape
  definitions. (ARCHITECTURE.md "Data Flow")

**Connects to:** uses the app shell + shared scaffold; reads from `apps/server` via the typed data layer; a row -> `/app/projects/[id]`.

### <Area / route>

<One line: what this page is for. Phase.>

- `[ ]` <feature> - <one line>. (FEATURES: <module>)

**Connects to:** <routes, shared components, or server data this depends on or feeds>

## Shared building blocks

<!--
  Cross-cutting pieces most features depend on. Build once, reuse everywhere -
  inconsistency here is what makes a product feel assembled screen by screen.
-->

- `[x]` Golden path baseline (shared health Zod contract, Hono health route, typed web
  service, starter page, baseline tests)
- `[x]` Responsive starter landing baseline (mobile menu, adaptive hero, route CTAs,
  non-technical public copy; see `docs/FRONTEND.md`)
- `[ ]` Design tokens and theme in `globals.css` (a real palette, not the neutral default)
- `[ ]` Product UI/UX brief (`docs/UI_UX.md`) filled from the user's design direction
- `[ ]` Public layout (navbar + footer) and app layout (signed-in shell)
- `[ ]` Metadata and browser icons (short page titles, default icons replaced only when
  product branding exists)
- `[ ]` Shared page scaffold (page header, wide container, small desktop gutters, spacing rhythm)
- `[ ]` Auth wiring (Supabase) and the protected-route redirect
- `[ ]` Data layer (typed fetch to `apps/server`, shared types from `packages/types`)
- `[ ]` API contract layer (Zod schemas in `packages/types`, Hono routes in `apps/server`)
- `[ ]` Backend service layer (feature routes/services/tests, see `docs/BACKEND.md`)
- `[ ]` Database layer (data model catalog, schema, tables/columns, RLS, storage, indexes,
  seed data, see `docs/DATABASE.md`)
- `[ ]` Payments layer if needed (checkout, webhooks, refunds, settlement, marketplace
  money flow, see `docs/PAYMENTS.md`)
- `[ ]` Verification pass (`pnpm lint`, `pnpm typecheck`, `pnpm test`, plus rendered UI
  review for `apps/web`)

## Done log

<!-- Newest first. One line per shipped milestone, with date. Cross-session memory. -->

- 2026-05-31 - Responsive starter landing baseline added with mobile navigation,
  adaptive hero type, route CTAs, and no visible stack/debug details.
- YYYY-MM-DD - <what shipped>
