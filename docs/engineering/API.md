# API Contract

## Conventions

- Built with **Hono**. Every route validates input (body, query, params) with a **Zod** schema at the boundary before any logic runs.
- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <token>` (Supabase Auth session token).
- Content-Type: `application/json`
- Request/response contracts are **Zod schemas in `packages/types`**, imported by both apps. The server validates with the schema; the client infers its types from it.
- Backend implementation rules live in `docs/engineering/BACKEND.md`. Payment-specific endpoints and
  webhooks must also follow `docs/engineering/PAYMENTS.md`.

## Success Envelope

```json
{ "data": {} }
```

## Error Envelope

```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "Human readable message" } }
```

## Standard Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | OK               |
| 201  | Created          |
| 400  | Validation error |
| 401  | Unauthenticated  |
| 403  | Unauthorized     |
| 404  | Not found        |
| 409  | Conflict         |
| 500  | Server error     |

---

## Example Endpoint

### `GET /api/v1/health`

Check that the API is running.

**Request**

```
GET /api/v1/health
```

**Response - 200**

```json
{ "data": { "status": "ok" } }
```

Contract: `healthResponseSchema` in `packages/types`.

This endpoint is for infrastructure checks and internal verification. Do not surface it as
a public website widget, footer badge, or marketing-page status panel.

---

## Liem Center Endpoints

All routes return the standard envelope. Auth-required unless marked `public`. Admin routes require role check.

### Catalog

- `GET /api/v1/products` `public` — paginated list, supports `?type=`, `?search=`, `?sort=`.
- `GET /api/v1/products/:slug` `public` — full product detail (overview, pricing, version, last updated).
- `GET /api/v1/products/:slug/changelog` `public` — paginated version entries.
- `GET /api/v1/products/:slug/roadmap` `public` — items grouped by status.
- `GET /api/v1/products/:slug/reviews` `public` — paginated; `POST /reviews` to submit (owner-only).

### Library & Entitlements

- `GET /api/v1/library` — entitlements for current user.
- `POST /api/v1/products/:slug/claim` — claim a free product (idempotent).
- `POST /api/v1/entitlements/:id/retry-invite` — re-trigger GitHub invite for owned entitlement.

### Checkout & Orders

- `POST /api/v1/checkout` — create order + Midtrans transaction. Body: `{ items: [...], couponCode?, recipient?: { type: "self" | "gift" } }`. Returns `{ orderId, snapToken, redirectUrl }`.
- `GET /api/v1/orders` — paginated history.
- `GET /api/v1/orders/:id` — order detail.
- `POST /api/v1/payments/notification` `public` — Midtrans webhook. Signature-verified (SHA512 hash). See `docs/engineering/PAYMENTS.md`.

### Gifts & Codes

- `POST /api/v1/codes/redeem` — body `{ code }`; creates entitlement; fires GitHub invite if applicable.
- `GET /api/v1/codes/mine` — codes the user generated as gifts.

### Wishlist

- `GET /api/v1/wishlist`
- `POST /api/v1/wishlist` — body `{ productId }`
- `DELETE /api/v1/wishlist/:productId`

### Profile

- `GET /api/v1/users/me` — current user profile + tier + badges.
- `PATCH /api/v1/users/me` — update profile (display name, banner, country, privacy).
- `POST /api/v1/users/me/showcase` — set pinned products.
- `GET /api/v1/users/:username` `public` — public profile view.

### Settings

- `POST /api/v1/integrations/github/link` — start OAuth-link flow (returns redirect URL).
- `DELETE /api/v1/integrations/github` — unlink GitHub (does not revoke existing invites).
- `POST /api/v1/integrations/google/link` / `DELETE` — same shape.
- Apple link/unlink endpoints are deferred (ADR-019); not implemented at launch.
- `GET /api/v1/sessions` — active sessions for current user.
- `POST /api/v1/sessions/revoke` — revoke a single session by id.
- `POST /api/v1/sessions/revoke-all` — log out of every other device.
- `GET /api/v1/users/me/email-preferences` / `PATCH` — per-category toggles for optional emails.

### Notifications

- `GET /api/v1/notifications` — paginated; `?unread=true` filter.
- `POST /api/v1/notifications/:id/read` — mark single read.
- `POST /api/v1/notifications/read-all` — mark all read.
- `GET /api/v1/notifications/unread-count` — for the navbar badge.

### Support

- `GET /api/v1/support/tickets` — current user's tickets.
- `POST /api/v1/support/tickets` — body `{ subject, category, message, orderId? }`. Creates ticket in `open` state.
- `GET /api/v1/support/tickets/:id` — ticket + thread.
- `POST /api/v1/support/tickets/:id/messages` — append a message (reopens `resolved` → `open`).
- `POST /api/v1/support/tickets/:id/close` — owner-close.

### Unsubscribe

- `GET /api/v1/unsubscribe/:token` `public` — resolves a signed token, returns the email category about to be disabled.
- `POST /api/v1/unsubscribe/:token` `public` — disables that category.

### Activity Feed

- `GET /api/v1/users/me/activity` — personal activity timeline.
- `GET /api/v1/users/:username/activity` `public` — public timeline (subject to user privacy toggle).

### Product Dependencies

- Exposed inline in `GET /api/v1/products/:slug` as `dependencies: [{ slug, name }]`. Admin CRUD via admin endpoints below.

### Admin (`role = admin`)

- `POST /api/v1/admin/products`, `PATCH /api/v1/admin/products/:id`, `POST /api/v1/admin/products/:id/archive`
- `GET /api/v1/admin/orders`, `POST /api/v1/admin/orders/:id/refund`
- `GET /api/v1/admin/users`, `POST /api/v1/admin/users/:id/grant`
- `POST /api/v1/admin/coupons`, `PATCH /api/v1/admin/coupons/:id`
- `POST /api/v1/admin/codes/batch`, `POST /api/v1/admin/codes/:id/revoke`
- `GET /api/v1/admin/github/invites`, `POST /api/v1/admin/entitlements/:id/revoke-invite`
- `POST /api/v1/admin/campaigns`, `PATCH /api/v1/admin/campaigns/:id`
- `POST /api/v1/admin/products/:id/changelog`, `POST /api/v1/admin/products/:id/roadmap`
- `POST /api/v1/admin/products/:id/dependencies`, `DELETE /api/v1/admin/products/:id/dependencies/:requiredId`
- `GET /api/v1/admin/support/tickets`, `POST /api/v1/admin/support/tickets/:id/messages`, `PATCH /api/v1/admin/support/tickets/:id` (status / priority)
- `POST /api/v1/admin/notifications/broadcast` — push a custom notification (and optional email) to a product's owners
- `GET /api/v1/admin/analytics/summary` — revenue, sales counts, orders only at launch (no funnels/referrals/wishlist analytics)

---

## Consistency Rules

- Resource names plural, lowercase: `/users`, `/orders`.
- Always wrap payloads in `data` / `error` envelopes.
- Never return raw arrays at the top level (wrap in `data`).
- Error `code` is SCREAMING_SNAKE_CASE and stable (clients may switch on it).
- New endpoint → add its Zod schema to `packages/types` first, then implement the route against it.
- Pagination uses `{ items, nextCursor }` inside `data`.

---

## Payments & Auth

- **Auth flows** (sign up, sign in, OAuth with Google/GitHub, password reset, avatar upload) run through the **Supabase SDK** from `apps/web`, not custom API endpoints. Server endpoints exist only for trusted operations that need the service-role key (entitlement grants, GitHub invites, admin actions).
- **Payment webhook** `POST /api/v1/payments/notification` is the one route not Bearer-authenticated: Midtrans calls it server-to-server, so verify the **signature hash** instead (SHA512 of `order_id + status_code + gross_amount + server_key`). Still validate the body with Zod and treat it as the source of truth for order status. See ADR-012 and `docs/engineering/PAYMENTS.md`.
- **GitHub linking** uses Supabase's GitHub OAuth provider for sign-in, but a separate link flow may be needed to request `repo` invite scope. Capture and store the linked GitHub username + user id; never store the user's GitHub token in the database long-term unless required for invites — prefer a per-action server-side App installation token.
