# Quality

## Code Quality

- Strict TypeScript (`strict: true`, no implicit `any`).
- Lint + format must pass before commit (`turbo lint`).
- One responsibility per file; functions do one thing.
- No dead code, no commented-out blocks, no `console.log` in committed code.
- Backend work follows `docs/BACKEND.md`; database work follows `docs/DATABASE.md` and keeps
  the data model catalog current; payment work follows `docs/PAYMENTS.md`.
- Use `pnpm verify` as the default final gate. It runs lint, typecheck, and tests.

## Docs Sync Audit

Run `pnpm docs:check` when documentation changes, when initializing a new product from this
template, and before calling a feature done if the feature touched docs.

The docs are synchronized when:

- `HOW_TO_USE_THIS_TEMPLATE.md` mentions every core doc.
- `docs/PROGRESS.md` points to the relevant source docs instead of restating them.
- Product scope changes are reflected in `docs/PRD.md` and `docs/FEATURES.md`.
- Product-specific design changes are reflected in `docs/UI_UX.md`.
- API changes are reflected in `docs/API.md` and `packages/types`.
- Database changes are reflected in `supabase/migrations/`, `packages/types/src/database.types.ts`,
  and the `docs/DATABASE.md` data model catalog.
- Payment changes are reflected in `docs/PAYMENTS.md`.
- Real architectural choices are appended to `docs/DECISIONS.md`.

## UI Consistency

- Frontend rendering, performance & design-craft rules: see `docs/FRONTEND.md`. Product-specific visual identity and UX direction: see `docs/UI_UX.md`. The bar is "professionally designed, human-made" - never AI-generic. Render and self-review UI work against both docs before calling it done.
- Use shared UI primitives and design tokens before creating one-off styles, but do not
  force every product into the same layout. Product-specific composition belongs in
  `docs/UI_UX.md`; `docs/FRONTEND.md` is the guardrail.
- Persistent navigation exists on every route and highlights the active route on desktop
  and mobile with `aria-current="page"`.
- Navigation has a visible background/surface treatment on every route. It is not invisible
  floating text, and it stays readable across scroll positions and breakpoints.
- Major route contexts are connected. Public, auth, and app shells link to each other where
  appropriate; users are never trapped in a dashboard/app route with no clear way back to
  the public/product home.
- Every route has a context-appropriate footer or footer-equivalent endcap. Public, app,
  and auth footers may differ, but none are omitted.
- Pages use rich text and scannability patterns with restraint: useful emphasis, inline
  links, captions, metadata, helper text, lists, and callouts where they clarify content.
- UI work is checked for "card soup": cards/panels are not used as the default wrapper for
  every shell, nav, filter bar, table/list, form, metric, and repeated item.
- UI work is checked for a paper-prototype feel: repeated pale bordered rectangles, weak
  one-note neutrals, faded imagery, quiet controls, and empty bands should not carry the
  design.
- Visible brand/logo treatment uses a real approved asset, the template icon, or a clean
  wordmark. Do not ship invented initials tiles or generic placeholder marks as if they
  were product branding.
- Test responsive behavior at mobile and desktop widths. For public/landing pages, inspect every major section and section transition at 1366x768, 1440x900, and 1920x1080 so hard mid-screen dividers, stacked page slices, half-empty sections, and prematurely visible footers cannot slip through.
- Public-facing UI does not expose implementation details. No visible Supabase/Midtrans/Hono
  stack labels, API health badges, response-time numbers, build IDs, environment names,
  internal route names, or debug diagnostics unless the product itself is a developer/status
  tool and the user explicitly asked for that surface.
- Public/customer-facing UI does not show internal KPIs, admin counters, workflow coverage,
  revenue summaries, stock alert counts, sample order values, performance targets, or other
  operational data unless it directly helps that user's current task.

## Performance Basics

- No unnecessary re-renders (memoize where it measurably helps, not preemptively).
- Lazy-load routes/heavy components.
- Server: paginate list endpoints; never return unbounded results.

## Security Basics

- Validate every external input at the boundary with **Zod** (route handlers) before any logic runs.
- Never trust client data or expose secrets to the frontend.
- `.env` is git-ignored from the start; commit only `.env.example`, never `.env`.
- Parameterized DB queries only - no string-built SQL.
- **Supabase:** enable Row Level Security on every table.
- **AI models:** call hosted models from `apps/server` only.

## Definition of Done

A task is done when:

- [ ] Works as specified in PRD / task
- [ ] Tests written and passing (logic + edge cases)
- [ ] `pnpm verify` passes
- [ ] `pnpm docs:check` passes when docs changed or project docs were initialized
- [ ] UI work: rendered and self-reviewed against `docs/FRONTEND.md` and `docs/UI_UX.md` at the required viewports, with anything that missed fixed
- [ ] Route navigation is present and the current page/section is visibly active in
      desktop and mobile nav (`aria-current="page"`)
- [ ] Navbar/sidebar/bottom nav has a visible surface/background treatment on every route,
      including public, app, auth, and mobile contexts
- [ ] Public, auth, and app route contexts are connected; app/dashboard routes include a
      clear path back to landing/product home
- [ ] Footer/endcap is present on every public, app, and auth route with content suited to
      that route context
- [ ] Rich text/scannability was reviewed: useful emphasis, inline links, captions,
      metadata, helper text, lists, or callouts exist where they improve comprehension
- [ ] Card/surface usage was reviewed against `docs/UI_UX.md`; the page is not card-heavy
      by default
- [ ] Paper-prototype feel was reviewed: the page is not carried by pale bordered boxes,
      weak one-note neutrals, faded imagery, quiet controls, or empty bands
- [ ] Visible brand/logo treatment uses a real approved asset, the template icon, or a
      clean wordmark, not an invented initials tile or generic placeholder mark
- [ ] Public UI reviewed for implementation leaks: no provider names, health-check widgets,
      latency metrics, build/environment labels, or debug diagnostics visible to real users
- [ ] Public/customer-facing UI reviewed for audience-mismatched metrics: no internal KPIs,
      admin counters, operational dashboards, seller workflow stats, revenue summaries, or
      other data the user cannot act on
- [ ] Matches naming & folder conventions (ARCHITECTURE.md)
- [ ] API matches `docs/API.md` (if applicable)
- [ ] Backend/database/payment work matches the relevant domain doc (`BACKEND.md`,
      `DATABASE.md`, `PAYMENTS.md`)
- [ ] Database work uses committed migrations, not dashboard-only changes
- [ ] Relevant doc updated if its domain changed
