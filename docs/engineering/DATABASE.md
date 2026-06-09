# Database

> Open this for Supabase/Postgres work: schema design, migrations, RLS policies, indexes,
> seed data, storage buckets, query performance, and data lifecycle decisions.

## Role

Supabase PostgreSQL is the source of truth for product data. Supabase Auth owns identities,
and Supabase Storage owns uploaded files. The app uses standard Postgres patterns instead of
inventing a custom persistence layer.

This file is the living data model catalog. Keep it updated as tables, columns, RLS
policies, indexes, storage buckets, and lifecycle rules change.

## Data Model Catalog

### Tables

#### `profiles`

Purpose: Public profile linked to a Supabase Auth user. One row per user.

| Column               | Type              | Required | Default  | Notes                                                          |
| -------------------- | ----------------- | -------- | -------- | -------------------------------------------------------------- |
| `id`                 | `uuid`            | yes      | none     | PK, references `auth.users.id`.                                |
| `username`           | `citext`          | yes      | none     | Unique. URL handle for `/u/[username]`.                        |
| `display_name`       | `text`            | yes      | none     | User-facing name.                                              |
| `avatar_url`         | `text`            | no       | none     | Public URL in `avatars` bucket.                                |
| `banner_url`         | `text`            | no       | none     | Public URL in `banners` bucket.                                |
| `country`            | `text`            | no       | none     | ISO code. Optional; never public unless `country_public=true`. |
| `country_public`     | `boolean`         | yes      | `false`  | When false, country is hidden from `/u/[username]`.            |
| `bio`                | `text`            | no       | none     | Short bio.                                                     |
| `founder_number`     | `int`             | no       | none     | Set on signup until cap reached.                               |
| `tier`               | `membership_tier` | yes      | `bronze` | Derived from lifetime spend; recomputed by trigger/job.        |
| `lifetime_spend_idr` | `bigint`          | yes      | `0`      | Whole rupiah (no cents). Recomputed on each paid order.        |
| `timeline_public`    | `boolean`         | yes      | `true`   | Privacy toggle for purchase timeline.                          |
| `created_at`         | `timestamptz`     | yes      | `now()`  |                                                                |
| `updated_at`         | `timestamptz`     | yes      | `now()`  |                                                                |
| `last_active_at`     | `timestamptz`     | no       | none     | Updated by server on signed-in routes.                         |

RLS:

- Read: public (anyone can view profile by username/id).
- Insert: trigger on `auth.users` insert.
- Update: `auth.uid() = id`.
- Delete: disallowed (account deletion is admin-only at launch).

Indexes: PK on `id`; unique on `username`.

#### `products`

Purpose: Catalog of Liem products.

| Column                      | Type             | Required | Default             | Notes                                     |
| --------------------------- | ---------------- | -------- | ------------------- | ----------------------------------------- |
| `id`                        | `uuid`           | yes      | `gen_random_uuid()` | PK                                        |
| `slug`                      | `text`           | yes      | none                | Unique URL slug.                          |
| `name`                      | `text`           | yes      | none                |                                           |
| `tagline`                   | `text`           | no       | none                | One-line.                                 |
| `description_md`            | `text`           | no       | none                | Markdown for product overview.            |
| `overview`                   | `text[]`         | yes      | `{}`                | API-ready overview paragraphs.            |
| `features`                   | `text[]`         | yes      | `{}`                | Included feature bullets.                 |
| `how_to_use`                 | `text[]`         | yes      | `{}`                | Product usage steps.                      |
| `type`                      | `product_type`   | yes      | none                | `free` / `github` / `download` / `bundle` |
| `category`                  | `product_category` | yes    | none                | Catalog category for filters.             |
| `price_idr`                 | `bigint`         | yes      | `0`                 | 0 for free; rupiah whole.                 |
| `version`                   | `text`           | no       | none                | Latest published version.                 |
| `github_repo`               | `text`           | no       | none                | `owner/repo` for `github` products.       |
| `download_path`             | `text`           | no       | none                | Storage path for `download` products.     |
| `cover_url`                 | `text`           | no       | none                | Hero image.                               |
| `status`                    | `product_status` | yes      | `draft`             | `draft` / `published` / `archived`.       |
| `published_at`              | `timestamptz`    | no       | none                |                                           |
| `created_at` / `updated_at` | `timestamptz`    | yes      | `now()`             |                                           |

RLS:

- Read: `status = 'published'` for everyone; admin reads all.
- Insert/Update/Delete: admin role only.

Indexes: unique on `slug`; partial index on `status='published'`.

#### `product_media`

Screenshots per product.

| Column       | Type   | Notes                        |
| ------------ | ------ | ---------------------------- |
| `id`         | `uuid` | PK                           |
| `product_id` | `uuid` | FK → `products.id`           |
| `url`        | `text` | Storage URL                  |
| `position`   | `int`  | Sort order                   |
| `kind`       | `text` | `screenshot` / `video-thumb` |

RLS: Read public when parent product is published; write admin-only.

#### `changelog_entries`

| Column        | Type   | Notes        |
| ------------- | ------ | ------------ |
| `id`          | `uuid` | PK           |
| `product_id`  | `uuid` | FK           |
| `version`     | `text` | e.g. `1.2.0` |
| `released_at` | `date` |              |
| `body_md`     | `text` |              |

RLS: Read public for published products; admin write.

#### `roadmap_items`

| Column       | Type             | Notes                                   |
| ------------ | ---------------- | --------------------------------------- |
| `id`         | `uuid`           | PK                                      |
| `product_id` | `uuid`           | FK                                      |
| `title`      | `text`           |                                         |
| `body_md`    | `text`           | optional                                |
| `status`     | `roadmap_status` | `planned` / `in_progress` / `completed` |
| `position`   | `int`            | sort within status                      |

RLS: Read public; admin write.

#### `bundles` and `bundle_items`

Bundles are themselves rows in `products` with `type='bundle'`. `bundle_items` (`bundle_product_id`, `child_product_id`, `position`) lists members. No separate `bundles` table required.

#### `orders`

Purpose: Buyer-facing order. One row per checkout.

| Column                      | Type           | Notes                                                            |
| --------------------------- | -------------- | ---------------------------------------------------------------- |
| `id`                        | `uuid`         | PK                                                               |
| `user_id`                   | `uuid`         | FK → `auth.users.id`. Buyer.                                     |
| `status`                    | `order_status` | `draft` / `awaiting_payment` / `paid` / `cancelled` / `refunded` |
| `total_idr`                 | `bigint`       | After discount.                                                  |
| `subtotal_idr`              | `bigint`       | Before discount.                                                 |
| `discount_idr`              | `bigint`       |                                                                  |
| `coupon_id`                 | `uuid`         | FK → `coupons.id`, nullable.                                     |
| `recipient_type`            | `text`         | `self` / `gift`                                                  |
| `created_at` / `updated_at` | `timestamptz`  |                                                                  |

RLS: Read by owner (`user_id = auth.uid()`); admin read all; insert by owner; update by server (service-role).

#### `order_items`

| Column           | Type     | Notes                                      |
| ---------------- | -------- | ------------------------------------------ |
| `id`             | `uuid`   | PK                                         |
| `order_id`       | `uuid`   | FK                                         |
| `product_id`     | `uuid`   | FK                                         |
| `unit_price_idr` | `bigint` | Snapshot at purchase.                      |
| `quantity`       | `int`    | Always 1 at launch (no quantity selector). |

#### `payments`

Payment attempts/records keyed by Midtrans transaction.

| Column                      | Type             | Notes                                                                |
| --------------------------- | ---------------- | -------------------------------------------------------------------- |
| `id`                        | `uuid`           | PK                                                                   |
| `order_id`                  | `uuid`           | FK                                                                   |
| `provider`                  | `text`           | `midtrans`                                                           |
| `provider_order_id`         | `text`           | Midtrans `order_id` (often equals our `orders.id`).                  |
| `provider_transaction_id`   | `text`           | Set after webhook.                                                   |
| `status`                    | `payment_status` | `pending` / `paid` / `failed` / `expired` / `cancelled` / `refunded` |
| `gross_amount_idr`          | `bigint`         |                                                                      |
| `signature_verified`        | `boolean`        | True only after server confirms hash.                                |
| `raw_payload`               | `jsonb`          | Last webhook body for audit.                                         |
| `created_at` / `updated_at` | `timestamptz`    |                                                                      |

RLS: Server-only writes; read by order owner (joined via `orders`).

Indexes: unique on `(provider, provider_order_id)`.

#### `entitlements`

Permanent ownership record.

| Column        | Type                 | Notes                                                         |
| ------------- | -------------------- | ------------------------------------------------------------- |
| `id`          | `uuid`               | PK                                                            |
| `user_id`     | `uuid`               | FK → `auth.users.id`. Owner.                                  |
| `product_id`  | `uuid`               | FK                                                            |
| `source`      | `entitlement_source` | `purchase` / `gift` / `redeem` / `free_claim` / `admin_grant` |
| `order_id`    | `uuid`               | FK, nullable.                                                 |
| `code_id`     | `uuid`               | FK → `codes.id`, nullable.                                    |
| `acquired_at` | `timestamptz`        |                                                               |
| `revoked_at`  | `timestamptz`        | nullable; non-null = revoked.                                 |

RLS: Read by owner; admin read/write; insert server-only.

Indexes: unique on `(user_id, product_id)` — one entitlement per user per product.

#### `github_invites`

GitHub invite status per entitlement.

| Column            | Type            | Notes                                                     |
| ----------------- | --------------- | --------------------------------------------------------- |
| `id`              | `uuid`          | PK                                                        |
| `entitlement_id`  | `uuid`          | FK                                                        |
| `github_repo`     | `text`          | snapshot of `products.github_repo`                        |
| `github_username` | `text`          | invitee's linked GitHub username                          |
| `status`          | `invite_status` | `pending` / `invited` / `accepted` / `failed` / `revoked` |
| `last_attempt_at` | `timestamptz`   |                                                           |
| `attempts`        | `int`           |                                                           |
| `error`           | `text`          | last error message                                        |

RLS: Read by entitlement owner; admin read/write; server write.

#### `codes`

Gift and promotional codes.

| Column        | Type          | Notes                                                 |
| ------------- | ------------- | ----------------------------------------------------- |
| `id`          | `uuid`        | PK                                                    |
| `code`        | `text`        | Uppercase, unique.                                    |
| `kind`        | `code_kind`   | `gift` / `promo` / `admin`                            |
| `product_id`  | `uuid`        | nullable for promo codes that aren't product-bound.   |
| `order_id`    | `uuid`        | nullable; set for gift codes generated from an order. |
| `status`      | `code_status` | `active` / `redeemed` / `expired` / `revoked`         |
| `redeemed_by` | `uuid`        | nullable FK → `auth.users.id`                         |
| `redeemed_at` | `timestamptz` |                                                       |
| `expires_at`  | `timestamptz` |                                                       |
| `usage_limit` | `int`         | for multi-use promo codes                             |
| `usage_count` | `int`         |                                                       |
| `created_by`  | `uuid`        | nullable; admin or buyer.                             |

RLS: Server-only reads/writes (codes are never enumerated client-side). Public redeem endpoint queries server-side.

#### `coupons`

| Column                | Type          | Notes                               |
| --------------------- | ------------- | ----------------------------------- |
| `id`                  | `uuid`        | PK                                  |
| `code`                | `text`        | Unique.                             |
| `kind`                | `coupon_kind` | `percent` / `fixed`                 |
| `value`               | `int`         | percent (1–100) or rupiah amount    |
| `product_eligibility` | `text[]`      | array of product slugs; empty = all |
| `expires_at`          | `timestamptz` |                                     |
| `usage_limit`         | `int`         |                                     |
| `usage_count`         | `int`         |                                     |
| `active`              | `boolean`     |                                     |

RLS: Read public (to validate at checkout) is acceptable, OR keep server-only and validate via API. Choose server-only.

#### `wishlist_items`

| Column       | Type          | Notes        |
| ------------ | ------------- | ------------ |
| `user_id`    | `uuid`        | composite PK |
| `product_id` | `uuid`        | composite PK |
| `added_at`   | `timestamptz` |              |

RLS: Owner-scoped CRUD.

#### `reviews`

| Column                      | Type          | Notes            |
| --------------------------- | ------------- | ---------------- |
| `id`                        | `uuid`        | PK               |
| `product_id`                | `uuid`        | FK               |
| `user_id`                   | `uuid`        | FK               |
| `rating`                    | `int`         | 1–5              |
| `title`                     | `text`        |                  |
| `body_md`                   | `text`        |                  |
| `hidden`                    | `boolean`     | admin moderation |
| `created_at` / `updated_at` | `timestamptz` |                  |

RLS: Read public when `hidden=false`; insert/update/delete by `user_id = auth.uid()` AND server-verified ownership of the product (enforced in API).

Indexes: unique `(product_id, user_id)`.

#### `badges` and `user_badges`

`badges`: catalog of badge definitions (`code`, `name`, `description`, `icon`).
`user_badges`: `(user_id, badge_code, awarded_at)`.

RLS: read public; insert/update server-only.

#### `campaigns`

| Column                  | Type          | Notes             |
| ----------------------- | ------------- | ----------------- |
| `id`                    | `uuid`        | PK                |
| `name`                  | `text`        |                   |
| `slug`                  | `text`        | unique            |
| `starts_at` / `ends_at` | `timestamptz` |                   |
| `banner_url`            | `text`        |                   |
| `discount_kind`         | `text`        | percent/fixed     |
| `discount_value`        | `int`         |                   |
| `product_ids`           | `uuid[]`      | included products |
| `active`                | `boolean`     |                   |

RLS: Read public when `active` and within window; admin write.

#### `notifications`

In-app notification feed. One row per delivered notification.

| Column       | Type                | Notes                                                                |
| ------------ | ------------------- | -------------------------------------------------------------------- |
| `id`         | `uuid`              | PK                                                                   |
| `user_id`    | `uuid`              | FK → `auth.users.id`                                                 |
| `type`       | `notification_type` | enum below                                                           |
| `title`      | `text`              |                                                                      |
| `message`    | `text`              |                                                                      |
| `link_url`   | `text`              | optional in-app route to open on click                               |
| `metadata`   | `jsonb`             | type-specific payload (entitlement id, product slug, ticket id, ...) |
| `is_read`    | `boolean`           | default `false`                                                      |
| `created_at` | `timestamptz`       |                                                                      |

RLS: Read by owner; admin read all; insert server-only; update `is_read` by owner.
Indexes: `(user_id, is_read, created_at desc)` for the unread feed.

#### `email_preferences`

Per-user toggles for the four optional email categories. One row per user; created on signup with defaults.

| Column            | Type          | Notes                    |
| ----------------- | ------------- | ------------------------ |
| `user_id`         | `uuid`        | PK, FK → `auth.users.id` |
| `product_updates` | `boolean`     | default `true`           |
| `sales`           | `boolean`     | default `true`           |
| `announcements`   | `boolean`     | default `true`           |
| `wishlist_alerts` | `boolean`     | default `true`           |
| `updated_at`      | `timestamptz` |                          |

RLS: Owner read/update; server read for email send.

#### `support_tickets`

| Column                      | Type              | Notes                                                       |
| --------------------------- | ----------------- | ----------------------------------------------------------- |
| `id`                        | `uuid`            | PK                                                          |
| `user_id`                   | `uuid`            | FK                                                          |
| `subject`                   | `text`            |                                                             |
| `category`                  | `text`            | `payment` / `github_invite` / `redeem` / `refund` / `other` |
| `status`                    | `ticket_status`   | `open` / `in_progress` / `resolved` / `closed`              |
| `priority`                  | `ticket_priority` | `low` / `normal` / `high`                                   |
| `related_order_id`          | `uuid`            | nullable FK → `orders.id`                                   |
| `last_admin_reply_at`       | `timestamptz`     | for unread-by-user indicator                                |
| `last_user_reply_at`        | `timestamptz`     | for admin queue sort                                        |
| `created_at` / `updated_at` | `timestamptz`     |                                                             |

RLS: Read/insert by owner; admin read/update all.

#### `support_messages`

| Column        | Type          | Notes                                    |
| ------------- | ------------- | ---------------------------------------- |
| `id`          | `uuid`        | PK                                       |
| `ticket_id`   | `uuid`        | FK                                       |
| `sender_id`   | `uuid`        | FK → `auth.users.id`                     |
| `sender_role` | `text`        | `user` / `admin` (denormalized for read) |
| `message`     | `text`        |                                          |
| `created_at`  | `timestamptz` |                                          |

RLS: Read by ticket owner or admin; insert by ticket owner OR admin.

#### `product_dependencies`

Declares that one product requires another.

| Column                | Type   | Notes |
| --------------------- | ------ | ----- |
| `id`                  | `uuid` | PK    |
| `product_id`          | `uuid` | FK    |
| `required_product_id` | `uuid` | FK    |

Constraints: unique `(product_id, required_product_id)`; `product_id <> required_product_id`.
RLS: Read public; admin write.

#### `activity_events`

Personal activity timeline rows. Source of `/u/[username]` activity feed and `/users/me/activity`.

| Column         | Type            | Notes                                                                           |
| -------------- | --------------- | ------------------------------------------------------------------------------- |
| `id`           | `uuid`          | PK                                                                              |
| `user_id`      | `uuid`          | FK                                                                              |
| `type`         | `activity_type` | `purchase` / `redeem` / `claim` / `gift_sent` / `tier_upgrade` / `badge_earned` |
| `subject_kind` | `text`          | `product` / `tier` / `badge`                                                    |
| `subject_ref`  | `text`          | product slug / tier code / badge code                                           |
| `metadata`     | `jsonb`         | optional                                                                        |
| `occurred_at`  | `timestamptz`   |                                                                                 |

RLS: Read by owner; public read only if `profiles.timeline_public = true`; insert server-only.

#### `sessions_view`

Active sessions are read from `auth.sessions` via a server endpoint (no app-owned table at launch). The `/settings` Security tab calls the server, which queries Supabase Auth admin APIs.

### Relationships

| From                         | Column        | To                                    | Cardinality | Delete behavior | Notes                      |
| ---------------------------- | ------------- | ------------------------------------- | ----------- | --------------- | -------------------------- |
| `profiles`                   | `id`          | `auth.users`                          | 1-1         | cascade         | Trigger-created on signup. |
| `products`                   | —             | `product_media`                       | 1-many      | cascade         |                            |
| `products`                   | —             | `changelog_entries` / `roadmap_items` | 1-many      | cascade         |                            |
| `orders`                     | `user_id`     | `auth.users`                          | many-1      | restrict        |                            |
| `orders`                     | —             | `order_items` / `payments`            | 1-many      | cascade         |                            |
| `entitlements`               | `user_id`     | `auth.users`                          | many-1      | restrict        |                            |
| `entitlements`               | `product_id`  | `products`                            | many-1      | restrict        |                            |
| `entitlements`               | —             | `github_invites`                      | 1-many      | cascade         | retry attempts.            |
| `codes`                      | `redeemed_by` | `auth.users`                          | many-1      | set null        |                            |
| `wishlist_items` / `reviews` | `user_id`     | `auth.users`                          | many-1      | cascade         |                            |

### Enums And Status Values

| Name                 | Values                                                                                                                                                                                                            | Used by                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `product_type`       | `free`, `github`, `download`, `bundle`                                                                                                                                                                            | `products.type`            |
| `product_category`   | `repos`, `apps`, `prompts`, `skills`, `templates`, `bundle`                                                                                                                                                       | `products.category`        |
| `product_status`     | `draft`, `published`, `archived`                                                                                                                                                                                  | `products.status`          |
| `roadmap_status`     | `planned`, `in_progress`, `completed`                                                                                                                                                                             | `roadmap_items.status`     |
| `order_status`       | `draft`, `awaiting_payment`, `paid`, `cancelled`, `refunded`                                                                                                                                                      | `orders.status`            |
| `payment_status`     | `pending`, `paid`, `failed`, `expired`, `cancelled`, `refunded`                                                                                                                                                   | `payments.status`          |
| `entitlement_source` | `purchase`, `gift`, `redeem`, `free_claim`, `admin_grant`                                                                                                                                                         | `entitlements.source`      |
| `invite_status`      | `pending`, `invited`, `accepted`, `failed`, `revoked`                                                                                                                                                             | `github_invites.status`    |
| `code_kind`          | `gift`, `promo`, `admin`                                                                                                                                                                                          | `codes.kind`               |
| `code_status`        | `active`, `redeemed`, `expired`, `revoked`                                                                                                                                                                        | `codes.status`             |
| `coupon_kind`        | `percent`, `fixed`                                                                                                                                                                                                | `coupons.kind`             |
| `membership_tier`    | `bronze`, `silver`, `gold`, `platinum`, `diamond`, `legendary`                                                                                                                                                    | `profiles.tier`            |
| `notification_type`  | `purchase_completed`, `product_redeemed`, `github_invite_sent`, `github_invite_accepted`, `github_invite_failed`, `product_updated`, `badge_earned`, `tier_upgraded`, `support_ticket_updated`, `admin_broadcast` | `notifications.type`       |
| `ticket_status`      | `open`, `in_progress`, `resolved`, `closed`                                                                                                                                                                       | `support_tickets.status`   |
| `ticket_priority`    | `low`, `normal`, `high`                                                                                                                                                                                           | `support_tickets.priority` |
| `activity_type`      | `purchase`, `redeem`, `claim`, `gift_sent`, `tier_upgrade`, `badge_earned`                                                                                                                                        | `activity_events.type`     |

### Indexes

| Table            | Index                           | Columns                                | Reason                           |
| ---------------- | ------------------------------- | -------------------------------------- | -------------------------------- |
| `products`       | `products_status_published_idx` | `(status) WHERE status='published'`    | Public catalog list.             |
| `entitlements`   | `entitlements_user_product_uq`  | `(user_id, product_id)` UNIQUE         | Idempotent ownership.            |
| `orders`         | `orders_user_created_idx`       | `(user_id, created_at desc)`           | Order history list.              |
| `payments`       | `payments_provider_order_uq`    | `(provider, provider_order_id)` UNIQUE | Webhook idempotency.             |
| `reviews`        | `reviews_product_user_uq`       | `(product_id, user_id)` UNIQUE         | One review per user per product. |
| `wishlist_items` | PK                              | `(user_id, product_id)`                | Composite PK.                    |
| `codes`          | `codes_code_uq`                 | `(code)` UNIQUE                        | Redeem lookup.                   |

### RLS Policy Matrix

| Table                                                 | Select                                             | Insert                     | Update                          | Delete   | Notes                        |
| ----------------------------------------------------- | -------------------------------------------------- | -------------------------- | ------------------------------- | -------- | ---------------------------- |
| `profiles`                                            | public                                             | trigger                    | `auth.uid()=id`                 | disabled |                              |
| `products`                                            | `status='published'` OR admin                      | admin                      | admin                           | admin    |                              |
| `product_media`, `changelog_entries`, `roadmap_items` | public if parent published                         | admin                      | admin                           | admin    |                              |
| `orders`                                              | owner OR admin                                     | owner                      | server-only                     | disabled |                              |
| `order_items`                                         | owner via order                                    | server                     | server                          | disabled |                              |
| `payments`                                            | owner via order                                    | server                     | server                          | disabled |                              |
| `entitlements`                                        | owner OR admin                                     | server                     | server                          | disabled | revoke = set `revoked_at`    |
| `github_invites`                                      | owner via entitlement OR admin                     | server                     | server                          | disabled |                              |
| `codes`                                               | server-only                                        | server                     | server                          | server   | never enumerated client-side |
| `coupons`                                             | server-only validation                             | admin                      | admin                           | admin    |                              |
| `wishlist_items`                                      | owner                                              | owner                      | owner                           | owner    |                              |
| `reviews`                                             | public when `hidden=false` OR own                  | owner + verified ownership | owner                           | owner    | admin can `hidden=true`      |
| `badges`                                              | public                                             | admin                      | admin                           | admin    |                              |
| `user_badges`                                         | public                                             | server                     | server                          | server   |                              |
| `campaigns`                                           | public when active in window                       | admin                      | admin                           | admin    |                              |
| `notifications`                                       | owner OR admin                                     | server                     | owner (is_read) / server        | disabled |                              |
| `email_preferences`                                   | owner                                              | server (signup)            | owner                           | disabled |                              |
| `support_tickets`                                     | owner OR admin                                     | owner                      | owner (limited fields) OR admin | disabled | admin owns status/priority   |
| `support_messages`                                    | owner-of-ticket OR admin                           | owner-of-ticket OR admin   | disabled                        | disabled | append-only                  |
| `product_dependencies`                                | public                                             | admin                      | admin                           | admin    |                              |
| `activity_events`                                     | owner; public when `profiles.timeline_public=true` | server                     | disabled                        | disabled | append-only                  |

### Storage Buckets

| Bucket          | Purpose                               | Path pattern                    | Public?    | RLS/policy summary                          |
| --------------- | ------------------------------------- | ------------------------------- | ---------- | ------------------------------------------- |
| `avatars`       | Profile avatars                       | `{user_id}/avatar.<ext>`        | yes (read) | Owner writes own path.                      |
| `banners`       | Profile banners                       | `{user_id}/banner.<ext>`        | yes (read) | Owner writes own path.                      |
| `product-media` | Screenshots, covers, campaign banners | `{product_id}/<file>`           | yes (read) | Admin writes.                               |
| `downloads`     | Files for `download` products         | `{product_id}/<version>/<file>` | no         | Read via signed URL granted only to owners. |

### Seed And Reference Data

| Name             | Where defined | Purpose                                                                                |
| ---------------- | ------------- | -------------------------------------------------------------------------------------- |
| `badges` catalog | seed          | Founding Member, Early Adopter, Beta Tester, Gift Giver, Bundle Collector, tier badges |
| Initial products | seed          | At least one product per type for local dev                                            |

## Schema Principles

- Model real product concepts, not screens.
- Plural lowercase `snake_case` table names.
- `uuid` PKs everywhere except composite (`wishlist_items`).
- `created_at` / `updated_at` on every business object.
- IDR amounts stored as `bigint` whole rupiah. Never cents-on-cents.
- Entitlement uniqueness `(user_id, product_id)` is load-bearing — duplicate prevention lives in the DB, not the app.

## RLS And Access

Row Level Security is required on every user-facing table. Browser uses anon key; trusted ops use service-role from `apps/server`. See policy matrix above. Codes and payments are server-only.

## Migrations

Migrations live in `supabase/migrations/`. Seed data for local development lives in
`supabase/seed.sql`. Generated database types live in `packages/types/src/database.types.ts`.

Workflow per AGENTS.md: `pnpm db:diff -- -f <name>` → review SQL in `supabase/migrations/` →
`pnpm db:reset` → `pnpm db:types` → update this catalog → `pnpm db:push` when ready.

## Data Lifecycle

- Orders, payments, entitlements: hard-delete disallowed. Refund = `status='refunded'`; revoke = `revoked_at` set.
- Reviews: soft-hide via `hidden=true`; hard delete by owner.
- Codes: never delete; transition to `revoked`/`expired`/`redeemed`.
- Profiles: hard delete only via admin tool (out of scope at launch).

## Sync Checklist

- [ ] Schema changes match `docs/product/FEATURES.md` and `docs/engineering/API.md`.
- [ ] Data Model Catalog is updated for new/changed tables, columns, relationships, RLS, indexes, storage buckets, lifecycle rules.
- [ ] API contracts in `packages/types` match persisted data shape where applicable.
- [ ] RLS policies protect every user-facing table.
- [ ] Storage buckets and policies are documented when used.
- [ ] Performance-sensitive queries have indexes.
- [ ] Data tasks are reflected in `docs/engineering/PROGRESS.md`.
- [ ] Major data model choices are appended to `docs/engineering/DECISIONS.md`.
