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
- Use shared UI primitives and design tokens before creating one-off styles.
- Test responsive behavior at mobile and desktop widths. For public/landing pages, inspect every major section and section transition at 1366x768, 1440x900, and 1920x1080 so hard mid-screen dividers, stacked page slices, half-empty sections, and prematurely visible footers cannot slip through.
- Public-facing UI does not expose implementation details. No visible Supabase/Midtrans/Hono
  stack labels, API health badges, response-time numbers, build IDs, environment names,
  internal route names, or debug diagnostics unless the product itself is a developer/status
  tool and the user explicitly asked for that surface.

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
- [ ] Public UI reviewed for implementation leaks: no provider names, health-check widgets,
      latency metrics, build/environment labels, or debug diagnostics visible to real users
- [ ] Matches naming & folder conventions (ARCHITECTURE.md)
- [ ] API matches `docs/API.md` (if applicable)
- [ ] Backend/database/payment work matches the relevant domain doc (`BACKEND.md`,
      `DATABASE.md`, `PAYMENTS.md`)
- [ ] Database work uses committed migrations, not dashboard-only changes
- [ ] Relevant doc updated if its domain changed
