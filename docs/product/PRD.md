# PRD - Liem Center

## Summary

Liem Center is the official developer hub and marketplace for the Liem ecosystem. It is a single, account-based home where developers discover Liem products, claim free ones, purchase premium ones (one-time only), redeem gifts and codes, and manage a permanent library. GitHub-based products integrate natively: when a buyer activates a GitHub product, the platform sends an automatic repository invitation. It should feel like joining a developer ecosystem, not buying files.

Liem Center is **not** an ecommerce platform. It is the unified surface through which users discover, acquire, manage, access, and showcase ownership of Liem products.

## Target Users

- **Primary:** Indonesian developers and engineering teams who use or want to use Liem products (monorepo, UI kit, dev tooling).
- **Secondary:** Creators and students adopting the Liem brand for side projects, learning, or gifting.

## Goals

- Ship a single account-based hub where every Liem product lives, with permanent ownership tracking per user.
- Make purchase, claim, redeem, and gift flows reliable end-to-end with Midtrans + GitHub invite automation.
- Build a public developer-profile layer (tiers, badges, founders, showcase, activity) that makes the platform feel like an ecosystem, not a store.
- Provide first-class user communication: in-app notification center, transactional email, and a support-ticket system that keeps issues out of DMs.
- Give admins one dashboard to operate products, orders, codes, GitHub access, sales campaigns, and support without database access.

## Non-Goals

- **No subscriptions, no recurring billing, no usage-based billing.** Every product is a one-time purchase or free claim.
- **Not a generic ecommerce platform.** No physical goods, no shipping, no inventory management.
- **Not a third-party marketplace.** Only Liem-branded products. No external sellers, no seller onboarding, no split settlement, no seller payout.
- **No in-product downloads for source-code products.** GitHub products are delivered via repository invite, not zip download.
- **No social feed, comments, DMs, or follower graph.** Profiles include a personal activity timeline only — not a network.
- **GitHub is not required at signup.** It is only required when a user activates a GitHub-based product.
- **No referral system at launch.** Easy to abuse, complex to track, low launch value. Deferred.
- **No funnel / wishlist / referral analytics at launch.** Only revenue, sales, and orders surfaces in admin.
- **No multi-currency / multi-locale at launch.** IDR + English UI copy first; Indonesian copy follows.
- **No desktop installer, launcher, or sync daemon at launch** (Phase 2 / Liem Launcher only).

## Product Principles

- **Account-based ownership.** Even free products must be claimed; everything ties to one account forever.
- **Developer-native.** GitHub linking, repository invites, changelogs, roadmaps, and versioned ownership are first-class — not bolt-ons.
- **One-time, permanent.** No subscription mental model. Once owned, always owned.
- **Low signup friction.** Use the auth provider you already have; only link GitHub when the product needs it.
- **Communication you can rely on.** Every important event has an in-app notification and an email; support runs through tickets, not DMs.
- **Restraint over decoration.** Premium feel comes from typography, spacing, and quiet motion — not gradients or hero stock art.
- **Sales as events, not noise.** Seasonal campaigns and bundles are intentional moments, not always-on banners.

## Differentiators

1. GitHub-native product delivery (auto-invite on activation).
2. Permanent account-based ownership of every Liem product.
3. Developer-focused profile, tier, and badge system.
4. Premium ecosystem feel — calm, restrained, brand-led.
5. Designed to host every future Liem product without redesign.
