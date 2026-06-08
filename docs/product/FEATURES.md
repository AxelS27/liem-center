# Features - Liem Center

> Scope is bounded by `docs/product/PRD.md`. Nothing here may contradict the PRD Non-Goals.

## Build phases

Phases reflect the final launch scope agreed with the product owner.

- **P0 — Launch.** Auth, Catalog, Product Pages, Checkout (Midtrans), GitHub integration, Library, Profile, Tiers, Badges, In-app Notifications, Email System, Support Tickets, Admin Dashboard, Foundation/Public shell.
- **P1 — Complete product.** Gifts, Redeem, Wishlist, Reviews, Changelog, Roadmap, Founder Program, Activity Feed, Product Ownership Metadata, Product Dependencies.
- **P2 — Depth and polish.** Bundles, "Complete Your Collection" pricing, Seasonal Sales, Coupons, Advanced product analytics, Liem Launcher integration, One-click repository generation.

Tag every capability below with `P0`, `P1`, or `P2`.

---

## 1. Foundation & Public Shell

Public landing, navigation, and footer that frame the entire ecosystem.

- Public landing (`/`) with hero, featured products, and ecosystem narrative `P0`
- Sticky public navbar with active-route state and mobile drawer `P0`
- Context-aware footer (brand, product links, legal, social) `P0`
- 404 / generic error states with route back to landing `P0`
- Seasonal sale banner slot on landing (hidden when no campaign active) `P2`

## 2. Authentication

Account creation and sign in. Supabase Auth. **GitHub is not required at signup.**

- Email + password sign up and sign in `P0`
- Google OAuth `P0`
- GitHub OAuth `P0`
- Apple OAuth — **deferred** (see ADR-019; not wired at launch) `P2`
- Password reset via Supabase email `P0`
- Sign out, session refresh, active sessions list, "log out all devices" `P0`
- Just-in-time GitHub linking when activating a GitHub-based product (separate from sign-in OAuth) `P0`

## 3. Product Catalog

Browse and discover Liem products.

- Product index (`/products`) with type filter (free / GitHub / download) `P0`
- Product detail page (`/products/[slug]`) with screenshots, description, features, pricing `P0`
- Changelog tab on product page `P1`
- Roadmap tab on product page (Planned / In Progress / Completed) `P1`
- Reviews tab on product page (verified owners only) `P1`
- Buttons: Claim / Buy Now / Buy as Gift / Add to Wishlist (rendered by product type + ownership) `P0`
- Guest preview mode (browse + view, no claim/buy buttons active) `P0`
- Product dependency display ("Requires: Liem Code") `P1`

## 4. Checkout & Payments

One-time purchase via Midtrans. Server-authoritative state.

- Checkout page (single product) `P0`
- Midtrans Snap integration (server creates transaction, browser opens Snap) `P0`
- Webhook (`POST /api/v1/payments/notification`) with signature verification `P0`
- Order success page with library link + GitHub-activation prompt when applicable `P0`
- Coupon code application at checkout (% or fixed) `P2`
- Bundle checkout (multi-product, single order) `P2`
- "Complete your collection" auto-discount when user owns part of a bundle `P2`

## 5. Product Library & Ownership Metadata

Personal owned-products view with full ownership transparency.

- Library (`/library`) lists every entitlement: name, type, source, owned-since, status `P0`
- Filter by source (Purchase / Gift / Redeem / Free Claim / Admin Grant) `P0`
- Per-entitlement metadata block: Owned Since · Acquisition Source · Access Status (Active/Revoked) · GitHub Status (Pending/Invited/Accepted/Failed/Revoked) `P1`
- GitHub product row shows invite status `P0`
- "Activate" / "Connect GitHub" CTA on first GitHub product when GitHub is not yet linked `P0`
- "Resend invite" action when status is Failed or Pending (rate-limited) `P0`
- Download link for download-type products `P0`
- Open external link for GitHub-type products after invite accepted `P0`

## 6. GitHub Integration

Native GitHub delivery for source-code products. **Linked on-demand, not at signup.**

- Just-in-time GitHub-link flow triggered by first GitHub product activation `P0`
- GitHub account linking from `/settings` (manual flow) `P0`
- Auto-invite to repository on entitlement creation if GitHub already linked `P0`
- Invite status tracked per entitlement (Pending / Invited / Accepted / Failed / Revoked) `P0`
- Retry invite from library (user) and admin dashboard (admin) `P0`
- Admin revoke access (removes collaborator + marks Revoked) `P1`

## 7. Free Claim Flow

Zero-cost products still go through an account-bound claim.

- "Claim" button on free product pages `P0`
- Claim creates entitlement with source = `free_claim` `P0`
- Claim is idempotent per user/product `P0`

## 8. Gift Purchase & Redeem

Buy for someone else; redeem a code.

- Buy as Gift: same checkout, generates a redeem code on success `P1`
- Gift success page shows code + share UI (copy link, copy code) `P1`
- Redeem page (`/redeem`) is publicly viewable; guests can enter a code, but **confirming** the redeem requires sign-in (routes to `/signin?next=/redeem`, code preserved) `P1`
- On confirm by a signed-in user, creates entitlement `P1`
- Redeem fires GitHub activation prompt when product is GitHub-type and GitHub not yet linked `P1`
- Code states: Active / Redeemed / Expired / Revoked `P1`

## 9. Promotional & Admin Codes

Codes that grant entitlements without purchase.

- Admin-generated single-use or multi-use codes `P1`
- Redeem flow shared with gift redeem `P1`
- Expiration date and usage limit enforced server-side `P1`

## 10. Wishlist

Save products to come back to.

- Add/remove from wishlist on product page `P1`
- Wishlist page (`/wishlist`) `P1`

## 11. Reviews

Verified-owner reviews on product pages.

- Submit review (rating + title + comment) — only for owners `P1`
- Edit/delete own review `P1`
- Public read on product page `P1`
- Admin moderation (hide/restore) `P1`

## 12. Changelog & Roadmap

Demonstrate active maintenance per product.

- Changelog entries (version, date, bullets) shown on product page `P1`
- Roadmap items grouped by status (Planned / In Progress / Completed) `P1`
- Admin CRUD for both `P1`
- Significant version releases publish an in-app notification to owners; optional email when the user has opted in to product updates `P1`

## 13. Profile & Showcase

Public developer profile.

- Profile page (`/u/[username]`) with avatar, banner, display name, member since, tier, badges, last active `P0`
- Country shown only if the user has set it AND opted to display it publicly; default is hidden `P0`
- Public stats: products owned, purchased, claimed, redeemed, wishlist count, reviews written `P0`
- Pinned product showcase (user picks up to N owned products) `P0`
- Activity Feed (personal-only timeline; not a social feed): purchases, redeems, tier upgrades, badge awards `P1`
- Profile settings: avatar, banner, display name, username, country (optional, default hidden), bio, privacy toggles `P0`

## 14. Membership Tiers

Lifetime-spend-based tiers with display perks only (no commerce gating except Legendary early access).

- Tier calculation: Bronze / Silver / Gold / Platinum / Diamond / Legendary based on lifetime IDR spend `P0`
- Tier badge on profile `P0` (also rendered on review cards once Reviews ship — see §11, `P1`)
- Progress bar to next tier on profile `P0`
- Legendary early sale access (gate sale start time by tier) `P2`

## 15. Badges

Achievement-style badges shown on profile.

- Badge system: Founding Member, Early Adopter, Beta Tester, Gift Giver, Bundle Collector, seasonal-sale badges, product-owner badges, tier badges `P0` (catalog + tier badges at launch; richer event-driven badges across P0/P1 as triggers come online)
- Server-side badge award rules on relevant events `P0`

## 16. Founder Program

Limited founder number for first N users.

- Founder number assigned on signup until cap reached (e.g. 500) `P1`
- Founder badge + number displayed on profile `P1`

## 17. In-App Notification Center

Persistent in-app feed so users do not rely on email alone. Accessed via 🔔 icon in the navbar.

- Notification list (`/notifications` or drawer) with unread badge `P0`
- Notification types: Purchase completed, Product redeemed, GitHub invitation sent, GitHub invitation accepted, GitHub invitation failed, Product updated, Badge earned, Membership tier upgraded, Support ticket updated `P0`
- Mark single / mark all as read `P0`
- In-app notifications are always created for every event type — the notification center is the durable record and is not muted by preferences. The `/settings` toggles govern **optional email only**, not whether the in-app notification appears. `P0`

## 18. Email System (Transactional + Optional)

All important events fire email. Mandatory emails always send; optional emails respect user preferences.

**Mandatory (always sent):**

- Welcome email on registration `P0`
- Purchase confirmation `P0`
- Gift purchase confirmation (with redeem code + sharing instructions) `P1`
- Product redeemed `P1`
- GitHub invitation sent `P0`
- GitHub invitation failed (with corrective action) `P0`
- Support ticket reply notification `P0`

**Optional (user-controlled):**

- Product update digests (e.g. "Liem Monorepo v2.1 Released") `P1`
- Seasonal sale announcements `P2`
- New product announcements `P1`
- Wishlist discount alerts (only when wishlisted product enters a sale) `P2`

- Email preference center under `/settings` with one toggle per optional category `P0`
- Unsubscribe link in every optional email; unsubscribe page resolves without auth `P0`

## 19. Support Ticket System

Keep support out of DMs.

- `/support` and `/support/new` are publicly viewable: guests can read the page and fill the form. **Submitting** a ticket requires sign-in (routes to `/signin?next=/support/new`, form preserved) `P0`
- Ticket list of the user's own tickets shows only when signed in; guests see a sign-in link in that area (no redirect on page entry) `P0`
- Ticket detail (`/support/[id]`) is protected — only the owner or an admin can open a specific ticket `P0`
- Ticket detail with message thread (user ↔ admin) `P0`
- Ticket states: Open / In Progress / Resolved / Closed `P0`
- Admin ticket queue + reply + state changes `P0`
- Reply triggers in-app notification + email `P0`
- Common categories surfaced in the new-ticket form: Payment succeeded but entitlement missing, GitHub invite failed, Redeem code invalid, Refund request, Other `P0`

## 20. Order History

Personal history of purchases, gifts, redemptions, refunds.

- Orders page (`/orders`) `P0`
- Order detail page with payment status, items, invoice metadata `P0`
- Refund status when applicable `P1`

## 21. Coupons

Discount codes at checkout.

- Percentage and fixed-amount coupons `P2`
- Expiration, usage limit, product eligibility `P2`
- Stacking rule: one coupon per order `P2`

## 22. Bundles & "Complete Your Collection"

Multi-product packages with smart pricing.

- Bundle product type (groups multiple products) `P2`
- Bundle detail page lists included products `P2`
- If buyer already owns part of the bundle, price auto-reduces by owned-item value `P2`
- Bundle checkout creates one order, multiple entitlements `P2`

## 23. Seasonal Sales

Time-bound campaigns.

- Admin-created campaign: name, window, product list, discount, banner asset `P2`
- Homepage banner + countdown timer during active campaign `P2`
- Per-product sale price shown on catalog and product page `P2`
- Sale badge on wishlisted items `P2`

## 24. Product Dependencies

Support future ecosystem growth (e.g. "Liem AI Plugin requires Liem Code").

- Admin defines dependencies per product (`product_id` → `required_product_id`) `P1`
- Product page shows "Requires: X" with a link `P1`
- Checkout warns if buyer does not own required products and offers to add them `P1`

## 25. Admin Dashboard

Single internal surface for ops.

- Auth-gated `/admin` shell with role check `P0`
- Products: list, create, edit, archive `P0`
- Orders: list, search, view, refund `P0`
- Users: search, view library, grant product, suspend `P0`
- Coupons: create, disable, view usage `P2`
- Codes (gift + promo): generate batch, revoke, view redemption status `P1`
- GitHub access: view invite status per entitlement, retry, revoke `P0`
- Campaigns: create, schedule, edit, end `P2`
- Changelog/roadmap CRUD per product `P1`
- Product dependencies admin `P1`
- Reviews moderation `P1`
- Support tickets queue + reply + close `P0`
- Notification broadcast (custom in-app + optional-email push to a product's owners) `P1`

## 26. Analytics (Trimmed)

Internal admin metrics. **Launch scope is deliberately small.**

- Revenue (total, monthly) `P0`
- Product sales counts `P0`
- Orders count and statuses `P0`
- Advanced product analytics (per-product trends, cohort views) `P2`
- Explicitly out of scope at launch: conversion funnels, referral analytics, wishlist analytics.

## 27. Account Settings

Single `/settings` surface.

- **Profile:** avatar, banner, display name, username, country (optional, hidden by default), bio `P0`
- **Connected Accounts:** Google / GitHub link/unlink status `P0`; Apple shown as a future provider, not wired (ADR-019) `P2`
- **Notifications:** master toggles per optional **email** category (product updates, sales, announcements, wishlist alerts) — mandatory emails are not toggleable, and in-app notifications are never muted `P0`
- **Security:** change password, active sessions list, "log out all devices" `P0`

---

## Explicitly out of scope

- **Referral system** — deferred to a later phase. Abuse-prone and low launch value.
- **Conversion / referral / wishlist analytics** — not at launch.
- **Public country display by default** — country is optional and hidden unless the user opts in.
- Subscriptions, recurring billing, usage billing.
- Third-party sellers, split settlement, marketplace payouts.
- Physical goods, shipping, inventory.
- Social feed, follows, comments, DMs.
- Multi-currency, multi-locale beyond IDR + English (Indonesian copy follows later).
- Desktop launcher / installer / sync (Phase 2 only).
- Direct download of source code for GitHub products (delivery is via repo invite).
