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
a public website widget, footer badge, or marketing-page status panel. Product UI should
not reveal provider names, API latency, uptime diagnostics, build hashes, or environment
details unless the user explicitly asks for a developer/status product.

---

## Consistency Rules

- Resource names plural, lowercase: `/users`, `/orders`.
- Always wrap payloads in `data` / `error` envelopes.
- Never return raw arrays at the top level (wrap in `data`).
- Error `code` is SCREAMING_SNAKE_CASE and stable (clients may switch on it).
- New endpoint → add its Zod schema to `packages/types` first, then implement the route against it.

---

## Payments & Auth (when used)

- **Auth flows** (sign up, sign in, OAuth with Google/GitHub, password reset, avatar upload) run through the **Supabase SDK** from `apps/web`, not custom API endpoints. Add a server endpoint only for trusted operations that need the service-role key.
- **Payment webhook** (e.g. `POST /api/v1/payments/notification`) is the one route that is **not** Bearer-authenticated: Midtrans calls it server-to-server, so verify the **signature hash** instead (SHA512 of `order_id + status_code + gross_amount + server_key`). Still validate the body with Zod like any other route, and treat it as the source of truth for order status. See ADR-012.
