# UI/UX Brief - Liem Center

## Summary

Liem Center should feel like a calm, premium developer hub — closer to Vercel, Linear, and Resend than to a retail store. The product is one-time purchase only and brand-led, so the surface should communicate restraint, quality, and ownership: clean white background, one strong accent, generous spacing, and editorial typography. Buy buttons, library, and profile carry the experience — never gradients, stock illustrations, or promo chaos.

## Design Inputs

- **User direction:** Premium developer hub. Combine developer-tool polish (Linear/Vercel/Resend) with the structural clarity of an account-based marketplace. Never a generic ecommerce store look.
- **Vertical playbook:** none (developer products / digital marketplace hybrid; ecommerce playbook does not apply because there is no cart, shipping, or seller flow)
- **Closest vertical from REFERENCES.md:** Developer tools & infrastructure (Vercel, Resend, Clerk, Supabase) + AI products (Anthropic, OpenAI)
- **Reference products/sites:** Vercel, Resend, Linear, Raycast, Anthropic, Clerk, Supabase
- **Starter design DNA to keep:** clean white surface, open bands, sticky nav, font wiring, footer shell, restraint with borders
- **Starter UI patterns not to copy:** placeholder copy, starter brand name, "feature highlight" boilerplate
- **Things the user explicitly likes:** premium feel, near-black accent from the closing library CTA, ecosystem framing, badges/tiers, GitHub-native delivery
- **Things the user explicitly dislikes:** subscription mental model, generic-AI gradients, cream/beige editorial palettes, card soup

## Product Personality

- **Premium-quiet** — restraint over decoration; the surface should feel earned, not loud.
- **Developer-native** — GitHub, repos, changelogs, version numbers are first-class UI elements.
- **Ecosystem, not store** — the user is joining something. Library, profile, and tier are the heart, not the cart.
- **Calm momentum** — motion exists but is subtle; nothing pulses, slides, or auto-rotates.
- **Honest** — prices in IDR, ownership permanent, no fake urgency outside real seasonal campaigns.

## Layout Principles

- **Primary layout model:** Top navbar across all public, app, and auth routes. No sidebar at launch — library, orders, profile, and admin all live under the same top-nav shell with a sub-nav strip where needed.
- **Page composition:**
  - Landing = open bands (hero → featured products → ecosystem narrative → seasonal slot → footer).
  - Catalog = open grid of product cards on a white surface, filter strip above.
  - Product detail = two-column on desktop (left: media + tabs, right: sticky purchase panel), single-column on mobile.
  - Library = open list/table with status pills, not a card grid.
  - Profile = editorial: avatar header band, stats row, pinned showcase, timeline.
  - Admin = denser table-first layout; still no sidebar (top tabs).
- **Surface budget:** Cards are reserved for **product cards** in the catalog, **dialog/sheet** content, and **stat tiles in admin**. Everything else uses open bands, lists, and tables. Hero, library, profile sections, and admin filters are not card-wrapped.
- **Open composition:** Hero, ecosystem narrative, profile sections, and library are open bands divided by spacing and section rhythm. Only product listings and admin metric tiles are framed.
- **Navigation placement:** Top navbar everywhere. Mobile collapses to a drawer with the same links. No bottom nav.
- **Navigation surface:** `sticky top-0 bg-background/80 border-b border-border backdrop-blur` with active state + `aria-current="page"`. Auth pages keep the same navbar (signed-out variant).
- **First viewport:** Landing hero headline + supporting line + one primary CTA (browse products) + one secondary (sign in) visible at ~720px desktop height. Featured product strip starts just below the fold, not pushed by oversized hero padding.
- **Route connectivity:** App routes (`/library`, `/orders`, `/profile`) include the same public navbar so users can always return to landing or product index. Auth pages link back to landing via the wordmark. Admin shell links to public via the wordmark.
- **Footer model:**
  - Public/landing/catalog: full footer — wordmark, product columns (Browse, Library, Profile), Liem ecosystem links, legal, copyright.
  - App (library/orders/profile): compact footer — wordmark, support link, legal, copyright.
  - Auth: minimal endcap — wordmark + copyright + privacy/terms.
  - Admin: minimal endcap — env label + copyright.
- **Desktop gutters:** Wide page shells with small desktop gutters; product detail and reading flows (changelog, roadmap) use a narrower reading column inside the same shell.

## Visual System

- **App name for metadata:** Liem Center
- **Browser title pattern:** `<Page> | Liem Center` (e.g. `Library | Liem Center`, `Liem Monorepo | Liem Center`)
- **Icon/brand asset direction:** Use template default favicon/icon until product branding lands. When it lands, expect a wordmark "Liem Center" with a small mark, not initials.
- **Color direction:** White background, neutral grays for surfaces and borders, one deliberate near-black accent matching the closing "Build your permanent Liem library" CTA. This should feel premium, developer-native, and brand-led, not blue SaaS, violet/indigo, emerald, or cream-editorial. Exact `--primary` HSL lives in `globals.css`. Semantic colors (success/warning/destructive) are separate and used sparingly (status pills, refunds, failed invites).
- **Typography direction:** Modern geometric sans wired via `next/font` to `--font-sans`. Default: **Inter** (or **Geist Sans** if the project prefers Vercel's stack). Weights used: 400 body, 500/600 medium, 700 bold. No display serif at launch.
- **Density and spacing:** Comfortable on landing and product detail; denser on library/orders/admin tables. Section vertical rhythm uses 64px / 80px / 96px bands on landing, 32px / 48px inside app pages.
- **Non-boxy hierarchy:** Spacing, weight, and section bands carry hierarchy before borders. Product detail tabs use an underline strip, not boxed tab containers. Library status uses pills inline in a list row, not a card per entitlement.
- **Rich text/scannability:** Product descriptions use real headings, short paragraphs, inline links, code spans for commands, and callouts for prerequisites. Changelog uses version headings + bullet lists. Roadmap uses three columns by status with short item titles + optional one-line context.
- **Audience-appropriate data:** Public product page shows price, type, last updated, version, owners count (optional, only if it adds trust). Library shows per-user status. Admin shows revenue, conversion, redemption counts. Internal KPIs never appear on public surfaces.
- **Radius and borders:** Subtle radius (`rounded-md` / `rounded-lg`), thin borders using `border-border`. No heavy shadows; use `shadow-sm` at most on the sticky product purchase panel.
- **Cards and surfaces:** See surface budget above. Catalog product cards are the dominant card use; everything else stays open.
- **Imagery/product visuals:** Each product needs real screenshots / hero image. No stock photos. No illustrated mascots. GitHub products may show a code/terminal screenshot.
- **Icon style:** `lucide-react`. Use icons for: search, filter, GitHub, library, profile, cart-equivalent (Buy), gift, redeem, link-out, check, alert, copy. Buttons keep text labels primary; icon-only is reserved for compact controls (copy code, link-out, close).
- **Motion:** Subtle. Hover transitions 150ms. Page-level entrance fades only on the hero and modal/sheet open. No parallax, no auto-rotating banners.

## Navigation Model

- `/` — Landing. Hero, featured products, ecosystem narrative.
- `/products` — Product catalog with filter.
- `/products/[slug]` — Product detail with tabs (Overview, Changelog, Roadmap, Reviews).
- `/library` — Owned products list (auth required).
- `/orders` — Order history (auth required).
- `/orders/[id]` — Order detail.
- `/wishlist` — Saved products (auth required).
- `/redeem` — Redeem a gift or promo code. **Public view** — page opens without sign-in; auth is required only when the user confirms the redeem.
- `/notifications` — In-app notification center (auth required; also opened as a drawer from the 🔔 icon in the navbar).
- `/support` — Support landing + new-ticket form. **Public view** — page opens without sign-in; auth is required only when the user submits a ticket. The list of *your* tickets requires auth.
- `/support/new` — File a new ticket (public form; sign-in prompt on submit).
- `/support/[id]` — Ticket detail with message thread (auth required — only the owner/admin can view a specific ticket).
- `/u/[username]` — Public profile.
- `/settings` — Tabs: Profile, Connected Accounts, Notifications, Security.
- `/checkout` — Checkout for a single product or bundle.
- `/checkout/success` — Post-payment confirmation.
- `/signin`, `/signup`, `/forgot-password`, `/auth/callback` — Auth.
- `/unsubscribe` — No-auth unsubscribe page reached from email footers.
- `/admin` — Admin shell with sub-tabs: Products, Orders, Users, Codes, Coupons, Campaigns, GitHub Access, Reviews, Support, Analytics. (Coupons + Campaigns are P2 tabs.)

## Auth Providers Surface

Sign-in and sign-up screens expose three providers at launch, in this order: Google, GitHub, Email. GitHub does **not** appear as required during signup — it is one option among the three. A separate "Connect GitHub" prompt appears later (in `/library` and on the order success page) only when the user is about to activate a GitHub product. Apple is deferred (ADR-019) and not shown on the auth screens at launch. See `docs/product/FEATURES.md` §2 and §6.

## Auth Gating Model

Two levels of protection, not one:

- **Protected routes (redirect on entry):** `/library`, `/orders`, `/wishlist`, `/notifications`, `/settings`, a specific `/support/[id]` ticket, and all of `/admin`. Opening these while signed out redirects to `/signin?next=` the requested path.
- **Public routes with an action gate (no redirect on entry):** `/redeem` and `/support` (incl. `/support/new`). The page renders fully for guests — they can read it, type into the form, see how it works. **Only the confirm/submit action requires auth.** If a signed-out user clicks "Redeem code" or "Submit ticket", route them to `/signin?next=` the same path; after sign-in they land back on the same page. Preserve typed input across the sign-in hop where feasible (carry the redeem code in the `next` URL or restore from session/local storage), so the user does not retype.

This keeps discovery friction low (the whole point of these two pages) while still binding the actual action to an account. Product detail Buy/Claim follow the same action-gate idea: the page is public, the purchase/claim action sends a signed-out user to sign-in first.

## Notification Center UX

- 🔔 bell icon in the signed-in navbar, with a small unread count badge.
- Click opens a right-side drawer (desktop) or full-screen page on mobile.
- List rows: icon by type, title, one-line context, relative time. Unread rows use a subtle accent dot.
- "Mark all read" action at the top; per-row mark-as-read on click.
- Empty state: friendly one-liner + "Browse products" or "Go to library" CTA.
- Notification settings link in the drawer footer routes to `/settings` → Notifications tab.

## Support Ticket UX

- `/support` is publicly viewable: it shows the new-ticket entry and help context to everyone. The "your tickets" list (Subject · Status pill (Open / In Progress / Resolved / Closed) · Last activity · Unread indicator if admin replied) only appears for signed-in users; guests see a sign-in link in that spot instead of a redirect.
- `/support/new` form: subject, category select (Payment issue / GitHub invite failed / Redeem code invalid / Refund request / Other), message, optional order link. Guests can fill it in; **Submit** routes to sign-in (with `next` back to the form) when signed out.
- `/support/[id]` thread: each message is a row with author, time, and text. Reply box at the bottom. Status pill at the top right.
- Admin queue in `/admin/support` uses a denser table with priority and SLA hints.

## Page UX Map

| Route / Area        | User goal                                                      | Primary action                         | Layout notes                                                                                 | States needed                                                                                           |
| ------------------- | -------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`                 | Understand the ecosystem, find something worth claiming/buying | "Browse products" CTA                  | Hero open band, featured strip, ecosystem narrative band, optional sale banner               | Active-campaign vs. no-campaign                                                                         |
| `/products`         | Find a product                                                 | Click product card                     | Filter strip + responsive card grid                                                          | Empty (filter yields none), loading skeleton, error                                                     |
| `/products/[slug]`  | Decide to claim/buy/wishlist                                   | Buy / Claim / Buy as Gift              | Two-column desktop; sticky right purchase panel; tabs for Overview/Changelog/Roadmap/Reviews | Owned (shows "In your library" instead of Buy), not-signed-in (CTAs route to sign-in), out-of-stock N/A |
| `/checkout`         | Pay                                                            | "Pay with Midtrans"                    | Single-column focused form, line items left, summary right (desktop)                         | Coupon applied/invalid, payment pending, error                                                          |
| `/checkout/success` | Confirm purchase + reach library                               | "Go to library"                        | Open band confirmation, status of GitHub invite if applicable                                | Pending (webhook not in), success, failed                                                               |
| `/library`          | Access owned products                                          | Open product / retry invite / download | List/table with status pills                                                                 | Empty (no entitlements yet), per-row pending/failed                                                     |
| `/orders`           | See history, get invoice                                       | Open order                             | List with date, total, status                                                                | Empty, refunded row                                                                                     |
| `/wishlist`         | Watch products                                                 | Open product                           | List                                                                                         | Empty, on-sale highlight                                                                                |
| `/redeem`           | Enter a code                                                   | "Redeem"                               | Public single-input page, simple confirmation                                                | Signed-out → confirm routes to sign-in (code preserved), invalid, expired, already-redeemed, success    |
| `/notifications`    | See activity at a glance                                       | Mark as read / open target             | Drawer (desktop) or full page (mobile); list rows                                            | Empty, loading skeleton                                                                                 |
| `/support`          | Get help, file/track issues                                    | New ticket / open ticket               | Public help + new-ticket entry; "your tickets" list for signed-in users                      | Signed-out → list area shows sign-in link (no redirect), empty (no tickets), unread reply highlight     |
| `/support/new`      | File a ticket                                                  | Submit                                 | Public single-column form                                                                    | Signed-out → submit routes to sign-in (form preserved), validation, success → ticket detail             |
| `/support/[id]`     | Resolve issue                                                  | Reply                                  | Thread view, status pill, reply box                                                          | Closed (reply disabled)                                                                                 |
| `/u/[username]`     | Showcase / view profile                                        | View pinned products                   | Editorial header band, stats row, pinned grid, activity feed                                 | Country hidden when not opted in, own-profile edit affordance                                           |
| `/settings`         | Manage account, providers, notifications, security             | Save                                   | Tabbed section page (Profile / Connected Accounts / Notifications / Security)                | Linked/unlinked Google/GitHub, OAuth error, active sessions list                                        |
| `/signin` `/signup` | Authenticate                                                   | Sign in                                | Minimal centered form, navbar present                                                        | OAuth pending, error                                                                                    |
| `/admin`            | Operate                                                        | Per-section actions                    | Top-tabs shell, tables, filter strip, drawers for edit                                       | Empty, loading, error per table                                                                         |

## Components And Patterns

- **Buttons and CTAs:** Primary actions (Buy, Claim, Redeem, Save) use solid `--primary` text labels, no icon by default. Icon + label for actions where the icon clarifies (GitHub-connect, Copy code, Buy as Gift). Icon-only allowed for: copy, link-out, close, expand. Always include `aria-label`.
- **Navigation active states:** Stronger text or a quiet filled background for active desktop top nav and utility icons; filled pill background for mobile drawer; `aria-current="page"` everywhere. Until auth/session state exists, the public navbar may preview the full product surface (Products, Library, Orders, Redeem, Support, Wishlist, Cart/Checkout, Notifications, Profile, Sign in, Create account) so the hub feels connected.
- **Route links:** Wordmark → `/`. App pages → `/library` in nav. Auth pages → wordmark links home. Library row → product detail. Order row → order detail. Profile pinned card → product detail.
- **Click affordance:** Product cards have hover lift (subtle) + focus ring. Table rows in library/orders/admin show hover background and a chevron on the right when navigable. Inline text links use `--primary` underline-on-hover.
- **Footer/endcap:** As defined under Layout Principles → Footer model.
- **Cards/lists/tables:** Product cards in catalog only. Library and orders use rows. Admin uses tables with sticky header.
- **Product/list metadata:** Catalog cards show name, one-line summary, type badge (Free / GitHub / Download), price (or "Free"), version, last updated. Owned products show an "Owned" badge replacing price.
- **Metrics and stats:** Public profile stats are limited and humane (owned count, reviews, joined date, tier progress). Admin metric tiles are denser and labeled.
- **Forms:** Single-column, labels above inputs, helper text under, error inline under field. Settings form sections are banded with a heading + description on the left, fields on the right at desktop.
- **Empty states:** Friendly one-line message + a clear next action button (Browse products / Connect GitHub / Redeem a code). Never just blank.
- **Error states:** Inline for forms; full-page only for unrecoverable route errors with a return-to-landing CTA.
- **Loading states:** Skeletons that match shape (card grid skeleton, list row skeleton, profile header skeleton). No full-page spinners.
- **Status pills:** Used for invite status, payment status, order status, code status. Colors come from semantic tokens.

## Copy Tone

- **Voice:** Calm, specific, developer-fluent. Short sentences. No marketing filler.
- **Words to use:** "Own", "claim", "redeem", "library", "version", "invite", "code", "repository".
- **Words to avoid:** "Unleash", "supercharge", "next-level", "revolutionary", "ecosystem of possibilities", any em dash in UI copy.
- **Example headline style:** "Every Liem product. One account." / "Your developer library, permanent."
- **Example button style:** "Buy now", "Claim", "Buy as gift", "Redeem code", "Go to library", "Open repository".

## Responsive Rules

- Mobile: single column everywhere. Drawer nav. Product detail collapses purchase panel to a sticky bottom bar with Buy CTA.
- Tablet: two-column product detail when room allows; catalog 2-up grid.
- Desktop: full nav, two-column product detail with sticky purchase panel, catalog 3- or 4-up grid.

## Accessibility Notes

- Keyboard: every interactive element tabbable; drawer and dialogs trap focus.
- Focus states: 2px ring at accent + 2px offset, visible on all surfaces.
- Contrast: body text and labels must hit WCAG AA on white. Status pills must hit AA on their fills.
- Motion sensitivity: all animations gated behind `prefers-reduced-motion`.

## Explicit UI Non-Goals

- No cream/beige editorial palette.
- No violet/indigo or warm-orange gradients.
- No hero illustration of a "developer at desk".
- No card-soup layouts (every section boxed).
- No auto-rotating product carousels.
- No bottom navigation.
- No dark mode at launch (planned later; not P0).
- No language switcher at launch (English first; Indonesian copy strings noted later).

## Sync Checklist

Before building or updating PROGRESS.md:

- [x] This brief matches `docs/product/PRD.md` goals and non-goals.
- [x] This brief covers all relevant `docs/product/FEATURES.md` modules.
- [x] This brief follows `docs/engineering/FRONTEND.md`; any conflict is resolved in favor of FRONTEND.md.
- [x] Selected references come from, or are added to, `docs/product/REFERENCES.md`.
- [x] Route/page intent here is reflected as tasks in `docs/engineering/PROGRESS.md`.
- [x] Any API/data needs implied by UX are reflected in `docs/engineering/API.md` and `packages/types`.
