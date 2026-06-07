# Build Progress & Feature Map

> Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked.
> Pointer-based checklist. Detail lives in source docs — do not restate it here.

## Source docs

- `docs/product/PRD.md` — scope, goals, non-goals.
- `docs/product/FEATURES.md` — feature modules with P0/P1/P2 phases.
- `docs/product/UI_UX.md` — product-specific UI/UX direction.
- `docs/engineering/API.md` — endpoint contracts.
- `docs/engineering/FRONTEND.md` — universal frontend rules.
- `docs/engineering/BACKEND.md` — server module layout and rules.
- `docs/engineering/DATABASE.md` — schema catalog, RLS, indexes, storage.
- `docs/engineering/PAYMENTS.md` — Midtrans + entitlement flow.
- `docs/engineering/QUALITY.md` — Definition of Done.

## Launch scope (reminder)

- **P0:** Auth · Catalog · Product Pages · Checkout/Midtrans · GitHub Integration · Library · Profile · Tiers · Badges · In-app Notifications · Email System · Support Tickets · Admin Dashboard · Foundation/Public shell · Account Settings (Profile / Connected Accounts / Notifications / Security).
- **P1:** Gifts · Redeem · Wishlist · Reviews · Changelog · Roadmap · Founder Program · Activity Feed · Ownership Metadata · Product Dependencies.
- **P2:** Bundles · Complete-Your-Collection · Seasonal Sales · Coupons · Advanced product analytics · Liem Launcher · One-click repo generation.

## Now building

- `[ ]` Docs synchronized; review pass with the user before code.

## Build map

### Public shell (`/`, navbar, footer) — P0

- `[ ]` Site-header with wordmark + top-level routes (Products, Library, Profile, Sign in) + 🔔 unread badge (signed-in). (UI_UX.md "Notification Center UX")
- `[ ]` Active route state + `aria-current="page"` desktop + mobile drawer. (docs/engineering/FRONTEND.md)
- `[ ]` Site-footer with brand, product/library/profile/legal/support columns. (UI_UX.md "Footer model")
- `[ ]` Landing `/` — open-band hero, featured products strip, ecosystem narrative band. (UI_UX.md)
- `[ ]` Replace starter copy and palette accent in `globals.css` (white background stays). (DESIGN_DNA.md)
- `[ ]` Metadata + browser title pattern `<Page> | Liem Center`. (UI_UX.md "Visual System")
- `[ ]` 404 + generic error route with link back home. (docs/engineering/FRONTEND.md)

### Database foundation — P0

- `[ ]` Migration: enums (product/order/payment/entitlement/invite/code/coupon/membership/roadmap/notification/ticket/activity). (docs/engineering/DATABASE.md "Enums")
- `[ ]` Migration: `profiles` (with `country_public`), `products`, `product_media`, `changelog_entries`, `roadmap_items`. (docs/engineering/DATABASE.md)
- `[ ]` Migration: `orders`, `order_items`, `payments`, `entitlements`, `github_invites`. (docs/engineering/DATABASE.md)
- `[ ]` Migration: `codes`, `coupons`, `wishlist_items`, `reviews`. (docs/engineering/DATABASE.md)
- `[ ]` Migration: `notifications`, `email_preferences`, `support_tickets`, `support_messages`, `activity_events`, `product_dependencies`. (docs/engineering/DATABASE.md)
- `[ ]` Migration: `badges`, `user_badges`, `campaigns`. (docs/engineering/DATABASE.md)
- `[ ]` RLS policies per matrix. (docs/engineering/DATABASE.md "RLS Policy Matrix")
- `[ ]` Indexes per catalog. (docs/engineering/DATABASE.md "Indexes")
- `[ ]` Storage buckets `avatars`, `banners`, `product-media`, `downloads`. (docs/engineering/DATABASE.md "Storage")
- `[ ]` Seed: badges catalog + at least one product per type. (docs/engineering/DATABASE.md)
- `[ ]` Triggers: profile + `email_preferences` row on `auth.users` insert; founder number assignment up to cap. (docs/engineering/DATABASE.md, docs/product/FEATURES.md §16)
- `[ ]` `pnpm db:types` regenerated; types exported to `packages/types`. (AGENTS.md)

### Auth (`/signin`, `/signup`, `/forgot-password`, `/auth/callback`) — P0

- `[ ]` Sign in / sign up forms (email + password). (docs/engineering/FRONTEND.md "Forms")
- `[ ]` Google OAuth button. (docs/product/FEATURES.md §2)
- `[ ]` GitHub OAuth button (signup option, not gating). (docs/product/FEATURES.md §2)
- Apple OAuth — deferred to P2, not built at launch. (ADR-019)
- `[ ]` Password reset request + reset confirmation routes. (docs/product/FEATURES.md §2)
- `[ ]` Auth callback route with redirect target. (docs/engineering/FRONTEND.md)
- `[ ]` Protected route middleware (Supabase session). (docs/engineering/BACKEND.md, docs/engineering/FRONTEND.md)
- `[ ]` Welcome email on first signup. (docs/product/FEATURES.md §18, docs/engineering/BACKEND.md `lib/email.ts`)

### Catalog (`/products`, `/products/[slug]`) — P0/P1

- `[ ]` `/products` filter strip + responsive card grid. (docs/product/UI_UX.md)
- `[ ]` Product card — name, tagline, type badge, price/Free, version, owned badge. (docs/product/UI_UX.md)
- `[ ]` Product detail two-column desktop with sticky purchase panel; tabs Overview/Changelog/Roadmap/Reviews. (docs/product/UI_UX.md)
- `[ ]` Dependency strip ("Requires: …") on product detail. (docs/product/FEATURES.md §24)
- `[ ]` `GET /api/v1/products`, `GET /api/v1/products/:slug` + Zod contracts. (docs/engineering/API.md)
- `[ ]` `GET /api/v1/products/:slug/changelog | roadmap | reviews` (P1). (docs/engineering/API.md)
- `[ ]` Empty / loading / error states. (docs/engineering/FRONTEND.md)
- `[ ]` Self-review code-based double-check after UI. (DESIGN_DNA.md)

### Checkout & Payments (`/checkout`, webhook) — P0

- `[ ]` `/checkout` page — line items + summary + Pay CTA. (docs/product/UI_UX.md)
- `[ ]` Dependency pre-check — warn buyer if required products are not owned + offer to add. (docs/product/FEATURES.md §24)
- `[ ]` `POST /api/v1/checkout` — create order, Midtrans Snap token. (docs/engineering/API.md, docs/engineering/BACKEND.md)
- `[ ]` Midtrans Snap opens client-side. (docs/engineering/PAYMENTS.md)
- `[ ]` `POST /api/v1/payments/notification` webhook — Zod + SHA512 signature verify. (docs/engineering/PAYMENTS.md)
- `[ ]` Idempotency via `(provider, provider_order_id)`. (docs/engineering/DATABASE.md)
- `[ ]` Paid-event fan-out: entitlements + GitHub invites + tier recompute + badges + notification + email + activity row (`lib/events.ts`). (docs/engineering/BACKEND.md)
- `[ ]` Purchase confirmation email. (docs/product/FEATURES.md §18)
- `[ ]` `/checkout/success` page — pending / paid / failed states; GitHub-activation prompt when needed. (docs/product/UI_UX.md)
- `[ ]` Admin refund endpoint (P1). (docs/engineering/API.md)

### Library & Ownership (`/library`) — P0/P1

- `[ ]` `/library` list/table with status pills (Open / Pending / Invited / Failed / Active / Revoked). (docs/product/UI_UX.md)
- `[ ]` Filter by source. (docs/product/FEATURES.md §5)
- `[ ]` Per-entitlement ownership metadata block: Owned Since / Source / Access / GitHub Status (P1). (docs/product/FEATURES.md §5)
- `[ ]` `GET /api/v1/library` returns entitlements + product snapshot + invite status. (docs/engineering/API.md)
- `[ ]` "Connect GitHub" CTA on first GitHub product when not linked. (docs/product/FEATURES.md §6)
- `[ ]` "Retry invite" action (rate-limited). (docs/product/FEATURES.md §6)
- `[ ]` Signed download URL flow for `download` products. (docs/engineering/DATABASE.md)
- `[ ]` Empty state with "Browse products" CTA. (docs/engineering/FRONTEND.md)

### GitHub integration — P0

- `[ ]` Just-in-time GitHub-link flow from library / order success. (docs/product/FEATURES.md §6)
- `[ ]` `/settings` Connected Accounts manual link/unlink. (docs/product/FEATURES.md §27)
- `[ ]` GitHub App setup (installation token flow) for sending invites; user OAuth token not persisted. (ADR-018)
- `[ ]` Server-side invite call on entitlement create via `lib/github.ts`. (docs/engineering/BACKEND.md, ADR-018)
- `[ ]` Retry + admin revoke endpoints. (docs/engineering/API.md)
- `[ ]` "GitHub invitation sent" + "failed" emails + notifications. (docs/product/FEATURES.md §17/§18)

### Free claim — P0

- `[ ]` "Claim" button on free product detail. (docs/product/UI_UX.md)
- `[ ]` `POST /api/v1/products/:slug/claim` — idempotent. (docs/engineering/API.md)

### Orders (`/orders`, `/orders/[id]`) — P0

- `[ ]` `/orders` list. (docs/product/UI_UX.md)
- `[ ]` `/orders/[id]` detail. (docs/product/FEATURES.md §20)
- `[ ]` `GET /api/v1/orders` + `GET /api/v1/orders/:id`. (docs/engineering/API.md)

### Profile (`/u/[username]`) — P0/P1

- `[ ]` Editorial header band (avatar, banner, display name, tier badge, member since). (docs/product/UI_UX.md)
- `[ ]` Country shown only when `country_public=true`. (docs/engineering/DATABASE.md, docs/product/FEATURES.md §13)
- `[ ]` Public stats row. (docs/product/FEATURES.md §13)
- `[ ]` Pinned showcase grid. (docs/product/FEATURES.md §13)
- `[ ]` Activity feed section (P1). (docs/product/FEATURES.md §13)
- `[ ]` Tier progress bar. (docs/product/FEATURES.md §14)
- `[ ]` Badge list. (docs/product/FEATURES.md §15)
- `[ ]` `GET /api/v1/users/:username` + `GET /api/v1/users/me`. (docs/engineering/API.md)

### Settings (`/settings`) — P0

Tabs: Profile / Connected Accounts / Notifications / Security.

- `[ ]` Profile tab — avatar, banner, display name, username, country (optional, hidden default), bio. (docs/product/FEATURES.md §27)
- `[ ]` Connected Accounts tab — Google / GitHub link/unlink with status; Apple listed as future, not wired. (docs/product/FEATURES.md §27, ADR-019)
- `[ ]` Notifications tab — toggles for product updates / sales / announcements / wishlist alerts; note that mandatory emails always send. (docs/product/FEATURES.md §18/§27)
- `[ ]` Security tab — change password, active sessions, log out all. (docs/product/FEATURES.md §27)
- `[ ]` `PATCH /api/v1/users/me`, email-preferences GET/PATCH, sessions GET/revoke, integrations link/unlink endpoints. (docs/engineering/API.md)

### Notification Center — P0

- `[ ]` Drawer (desktop) / page (mobile) with list rows and unread badge. (docs/product/UI_UX.md "Notification Center UX")
- `[ ]` `GET /api/v1/notifications`, `POST /:id/read`, `POST /read-all`, `GET /unread-count`. (docs/engineering/API.md)
- `[ ]` Server hooks insert notifications on payment paid, redeem, invite events, badge award, tier upgrade, ticket reply. (docs/engineering/BACKEND.md `lib/events.ts`)

### Email System — P0/P1

- `[ ]` `lib/email.ts` Resend sender + React Email template registry. (docs/engineering/BACKEND.md, ADR-017)
- `[ ]` Mandatory templates: welcome, purchase confirmation, GitHub invite sent, GitHub invite failed, support ticket reply. (docs/product/FEATURES.md §18)
- `[ ]` Mandatory P1 templates: gift purchase, product redeemed. (docs/product/FEATURES.md §18)
- `[ ]` Optional templates: product updates, new product, sales, wishlist alerts. Respect `email_preferences`. (docs/product/FEATURES.md §18)
- `[ ]` `/unsubscribe/:token` no-auth page + endpoint. (docs/engineering/API.md "Unsubscribe")

### Support Tickets (`/support`) — P0

- `[ ]` `/support` list with status pills + unread-reply highlight. (docs/product/UI_UX.md "Support Ticket UX")
- `[ ]` `/support/new` form (category, subject, message, optional order link). (docs/product/UI_UX.md)
- `[ ]` `/support/[id]` thread + reply box; status pill. (docs/product/UI_UX.md)
- `[ ]` Endpoints: list/create/get/append-message/close. (docs/engineering/API.md "Support")
- `[ ]` Reply triggers notification + email. (docs/product/FEATURES.md §17/§18)
- `[ ]` Admin queue under `/admin/support` with priority + status controls. (docs/product/FEATURES.md §25)

### Tiers, Badges, Founder — P0/P1

- `[ ]` Tier recompute on `payments.status='paid'`; emit `tier_upgrade` notification + activity row. (docs/engineering/BACKEND.md)
- `[ ]` Badge award rules: signup (Founding Member up to cap), first purchase, first gift sent, etc. (docs/product/FEATURES.md §15)
- `[ ]` Founder-number trigger up to cap (P1). (docs/product/FEATURES.md §16, docs/engineering/DATABASE.md)

### Activity Feed — P1

- `[ ]` `activity_events` write helper inside `lib/events.ts`. (docs/engineering/BACKEND.md)
- `[ ]` `GET /api/v1/users/me/activity` + public timeline endpoint. (docs/engineering/API.md)
- `[ ]` Profile renderer respects `timeline_public`. (docs/engineering/DATABASE.md, docs/product/UI_UX.md)

### Product Dependencies — P1

- `[ ]` Admin CRUD (`POST /api/v1/admin/products/:id/dependencies`, `DELETE`). (docs/engineering/API.md)
- `[ ]` Product detail "Requires" strip. (docs/product/FEATURES.md §24)
- `[ ]` Checkout warning + add-to-cart helper. (docs/product/FEATURES.md §24)

### Gifts & Redeem (`/redeem`) — P1

- `[ ]` "Buy as Gift" path in checkout → `gift` code on payment. (docs/product/FEATURES.md §8)
- `[ ]` Gift success screen + copy. (docs/product/UI_UX.md)
- `[ ]` `/redeem` input page. (docs/product/UI_UX.md)
- `[ ]` `POST /api/v1/codes/redeem` server-only. (docs/engineering/API.md)
- `[ ]` Redeem fires GitHub-activation prompt when GitHub-type product + GitHub not linked. (docs/product/FEATURES.md §8/§6)
- `[ ]` Mandatory emails: gift purchase, product redeemed. (docs/product/FEATURES.md §18)

### Wishlist (`/wishlist`) — P1

- `[ ]` `/wishlist` list + add/remove on product detail. (docs/product/FEATURES.md §10)
- `[ ]` `GET/POST/DELETE /api/v1/wishlist`. (docs/engineering/API.md)

### Reviews — P1

- `[ ]` Review form (owner-only). (docs/product/UI_UX.md)
- `[ ]` `POST /api/v1/products/:slug/reviews` with ownership check. (docs/engineering/API.md)
- `[ ]` Public list on product page. (docs/product/UI_UX.md)
- `[ ]` Admin moderation toggle. (docs/engineering/API.md)

### Changelog & Roadmap — P1

- `[ ]` Public render on product page. (docs/product/UI_UX.md)
- `[ ]` Admin CRUD. (docs/engineering/API.md)
- `[ ]` Publishing a changelog entry fires `product_updated` notification to owners + optional email. (docs/product/FEATURES.md §12/§17/§18)

### Admin (`/admin/*`) — P0/P1/P2

- `[ ]` Admin shell with top-tabs + role check. (docs/engineering/FRONTEND.md, docs/engineering/BACKEND.md)
- `[ ]` Products CRUD + archive. (docs/product/FEATURES.md §25)
- `[ ]` Orders list + refund. (docs/product/FEATURES.md §25, docs/engineering/PAYMENTS.md)
- `[ ]` Users search + grant + suspend. (docs/product/FEATURES.md §25)
- `[ ]` Support queue + reply + status. (docs/product/FEATURES.md §25/§19)
- `[ ]` GitHub access view + retry + revoke. (docs/product/FEATURES.md §6)
- `[ ]` Codes batch + revoke (P1). (docs/product/FEATURES.md §9)
- `[ ]` Coupons CRUD (P2). (docs/product/FEATURES.md §21)
- `[ ]` Campaigns CRUD (P2). (docs/product/FEATURES.md §23)
- `[ ]` Changelog/Roadmap CRUD per product (P1). (docs/product/FEATURES.md §12)
- `[ ]` Product dependencies admin (P1). (docs/product/FEATURES.md §24)
- `[ ]` Reviews moderation (P1). (docs/product/FEATURES.md §11)
- `[ ]` Notification broadcast (P1). (docs/product/FEATURES.md §25)
- `[ ]` Analytics summary — revenue + sales + orders only at launch. (docs/product/FEATURES.md §26)

### Bundles & sales — P2

- `[ ]` Bundle product type. (docs/product/FEATURES.md §22)
- `[ ]` "Complete your collection" auto-discount calc. (docs/product/FEATURES.md §22)
- `[ ]` Campaign banner + per-product sale price + wishlist sale highlight. (docs/product/FEATURES.md §23)
- `[ ]` Coupons at checkout. (docs/product/FEATURES.md §21)

## Shared building blocks

- `[x]` Golden path baseline (health Zod contract, Hono health route, typed web service, starter page, baseline tests)
- `[x]` Responsive starter landing baseline
- `[ ]` Public + app + auth layout shells (one navbar; footer variants)
- `[ ]` Design tokens in `globals.css` — Liem accent in `--primary`/`--ring`; white background untouched
- `[ ]` `next/font` wiring (Inter or Geist Sans) → `--font-sans`
- `[ ]` Shared status pill component (entitlement / payment / order / code / ticket)
- `[ ]` Shared rich-text renderer (`description_md`, changelog, roadmap, reviews, ticket messages)
- `[ ]` Shared product card
- `[ ]` Shared notification drawer + bell badge
- `[ ]` Auth wiring (Supabase) + protected-route middleware
- `[ ]` Data layer (typed fetch to `apps/server`; types from `packages/types`)
- `[ ]` API contract layer (Zod schemas + Hono routes)
- `[ ]` Backend services per BACKEND.md feature module list
- `[ ]` `lib/events.ts` event fan-out + `lib/email.ts` template registry + `lib/github.ts`
- `[ ]` Database layer (migrations, RLS, storage, seed)
- `[ ]` Payments layer (Midtrans Snap + webhook + entitlement fan-out)
- `[ ]` Verification pass (`pnpm lint`, `pnpm typecheck`, `pnpm test`, code-based UI self-review per DESIGN_DNA.md)

## Done log

- 2026-06-07 — Locked ADR-017 (email via Resend), ADR-018 (GitHub delivery via GitHub App, identity via OAuth), ADR-019 (launch auth = Google + GitHub + Email; Apple deferred to P2). Docs updated to match.
- 2026-06-07 — Updated docs for v1.1 PRD additions: 4-provider auth (Google/Apple/Email/GitHub) with GitHub not required at signup; in-app notification center; transactional + optional email system; support ticket system; activity feed; product dependencies; ownership metadata; referrals deferred; analytics trimmed; country optional/private by default; new tables `notifications`, `email_preferences`, `support_tickets`, `support_messages`, `activity_events`, `product_dependencies`.
- 2026-06-07 — Initialized Liem Center docs (PRD, FEATURES, UI_UX, API, BACKEND, DATABASE, PAYMENTS, PROGRESS) from product brief.
- 2026-05-31 — Responsive starter landing baseline added.
