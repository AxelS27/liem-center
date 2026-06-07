# Backend

> Open this for `apps/server` work: routes, middleware, validation, services, auth guards,
> background jobs, integrations, and server-side tests.

## Role

`apps/server` is the trusted backend boundary. It owns API routes, server-only secrets,
trusted Supabase operations, payment integration, hosted AI calls, and any logic that must
not run in the browser.

The API contract source of truth is `docs/engineering/API.md` plus Zod schemas in `packages/types`.
This file explains how backend code should be structured and verified.

## Server Structure

Use feature-based modules as the app grows:

```text
apps/server/src/
  index.ts
  features/
    orders/
      orders.routes.ts
      orders.service.ts
      orders.test.ts
  lib/
    env.ts
    errors.ts
    supabase.ts
```

Keep files focused:

- `app.ts` owns the Hono app instance and route registration.
- `index.ts` starts the Node server and should stay thin.
- `*.routes.ts` owns Hono route registration, request parsing, and response envelopes.
- `*.service.ts` owns business logic and persistence calls.
- `*.test.ts` lives next to the code it verifies.
- Shared server helpers live in `apps/server/src/lib`.
- App-agnostic pure helpers belong in `packages/utils`.
- Request/response schemas belong in `packages/types`, not in route files.

## Route Rules

- Base URL is `/api/v1`.
- Resource names are plural and lowercase: `/users`, `/orders`, `/products`.
- Validate params, query, and body at the route boundary with Zod.
- Return the envelopes defined in `docs/engineering/API.md`: `{ data: ... }` or `{ error: ... }`.
- Never return raw arrays at the top level.
- Keep error codes stable and `SCREAMING_SNAKE_CASE`.
- Paginate list endpoints. Do not return unbounded lists.
- Route handlers should stay thin: validate, call service, shape response.

## Auth And Secrets

- Bearer tokens are Supabase Auth session tokens unless `docs/engineering/API.md` says a route is public.
- Server-only secrets stay in `apps/server` and environment variables without
  `NEXT_PUBLIC_`.
- The Supabase service-role key is never imported into `apps/web`.
- Public webhooks are still validated. Payment webhooks use provider signatures, not Bearer
  auth.

## Error Handling

Use plain-language messages for clients and stable machine-readable codes.

Example:

```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "No order was found for this id."
  }
}
```

Avoid leaking stack traces, SQL details, service-role errors, or provider secrets.

Also avoid leaking product internals through normal API responses. Public/client-facing
responses should not include database provider names, ORM/client names, upstream provider
debug output, server timing numbers, build IDs, environment names, or diagnostic payloads
unless the endpoint is an explicitly authenticated admin/observability surface. Keep those
details in server logs and monitoring.

## External Integrations

- Payments: see `docs/engineering/PAYMENTS.md`.
- Supabase/Postgres: see `docs/engineering/DATABASE.md`.
- Large AI models: call hosted Hugging Face APIs from `apps/server`; never ship model
  weights to web or Node runtime.

Wrap external providers behind feature services so route handlers do not know provider
details.

## Testing

Add focused tests for:

- Route contracts, like the starter `GET /api/v1/health` test.
- Zod validation success/failure.
- Service logic and edge cases.
- Auth/authorization branches.
- Error envelopes.
- Webhook signature verification, when payments are used.

Before marking backend work done:

- `pnpm --filter @repo/server lint`
- `pnpm --filter @repo/server typecheck`
- `pnpm --filter @repo/server test`
- Any relevant root `pnpm lint && pnpm typecheck && pnpm test` pass before shipping.

## Sync Checklist

- [ ] Any new endpoint is documented in `docs/engineering/API.md`.
- [ ] Request/response schemas live in `packages/types`.
- [ ] API tasks are reflected in `docs/engineering/PROGRESS.md`.
- [ ] Database changes are reflected in `docs/engineering/DATABASE.md`.
- [ ] Payment changes are reflected in `docs/engineering/PAYMENTS.md`.
- [ ] Security-sensitive decisions are added to `docs/engineering/DECISIONS.md` when they are real
      architectural choices.
