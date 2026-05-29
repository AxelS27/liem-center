# API Contract

## Conventions

- Built with **Hono**. Every route validates input (body, query, params) with a **Zod** schema at the boundary before any logic runs.
- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <token>` (Supabase Auth session token).
- Content-Type: `application/json`
- Request/response contracts are **Zod schemas in `packages/types`**, imported by both apps. The server validates with the schema; the client infers its types from it.

## Success Envelope
```json
{ "data": { } }
```

## Error Envelope
```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "Human readable message" } }
```

## Standard Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Unauthorized |
| 404 | Not found |
| 409 | Conflict |
| 500 | Server error |

---

## Example Endpoint

### `GET /api/v1/users/:id`
Fetch a single user.

**Request**
```
GET /api/v1/users/123
Authorization: Bearer <token>
```

**Response - 200**
```json
{ "data": { "id": "123", "name": "Ada", "email": "ada@example.com" } }
```

**Response - 404**
```json
{ "error": { "code": "USER_NOT_FOUND", "message": "No user with id 123" } }
```

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
