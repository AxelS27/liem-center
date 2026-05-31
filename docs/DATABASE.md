# Database

> Open this for Supabase/Postgres work: schema design, migrations, RLS policies, indexes,
> seed data, storage buckets, query performance, and data lifecycle decisions.

## Role

Supabase PostgreSQL is the source of truth for product data. Supabase Auth owns identities,
and Supabase Storage owns uploaded files. The app should use standard Postgres patterns
instead of inventing a custom persistence layer.

This file is also the living data model catalog. Keep it updated as tables, columns,
relationships, RLS policies, indexes, storage buckets, and data lifecycle rules change.

## Data Model Catalog

<!--
  Fill this from PRD.md, FEATURES.md, API.md, and the actual migrations.
  Keep it current. A developer should be able to open this section and understand
  what tables exist, what each table is for, and how the important fields relate.
-->

### Tables

<!--
  One subsection per table. Delete the example once real tables exist.
-->

#### Example: `profiles` <!-- delete this example block -->

Purpose: Public application profile linked to a Supabase Auth user.

| Column         | Type          | Required | Default | Notes                                    |
| -------------- | ------------- | -------- | ------- | ---------------------------------------- |
| `id`           | `uuid`        | yes      | none    | Primary key, references `auth.users.id`. |
| `display_name` | `text`        | no       | none    | User-facing name.                        |
| `avatar_url`   | `text`        | no       | none    | Public URL for avatar stored in Storage. |
| `created_at`   | `timestamptz` | yes      | `now()` | Created timestamp.                       |
| `updated_at`   | `timestamptz` | yes      | `now()` | Updated timestamp.                       |

Relationships:

- `profiles.id` -> `auth.users.id`

RLS:

- Read: <who can read rows>
- Insert: <who can insert rows>
- Update: <who can update rows>
- Delete: <who can delete rows>

Indexes:

- Primary key on `id`.

Lifecycle:

- <hard delete / soft delete / retention / audit notes>

### Relationships

<!--
  Summarize cross-table relationships so the data model is scannable without reading
  every table block.
-->

| From table | Column | To table  | Cardinality | Delete behavior  | Notes |
| ---------- | ------ | --------- | ----------- | ---------------- | ----- |
| `<table>`  | `<fk>` | `<table>` | one-to-many | restrict/cascade |       |

### Enums And Status Values

<!--
  Keep durable status values here so API, database, and UI stay aligned.
-->

| Name     | Values             | Used by          | Notes |
| -------- | ------------------ | ---------------- | ----- |
| `<enum>` | `<value>, <value>` | `<table.column>` |       |

### Indexes

<!--
  Include important non-primary indexes and why they exist.
-->

| Table     | Index          | Columns     | Reason                             |
| --------- | -------------- | ----------- | ---------------------------------- |
| `<table>` | `<index_name>` | `<columns>` | `<query/filter/order it supports>` |

### RLS Policy Matrix

<!--
  Keep policy intent readable. SQL lives in migrations; the product rule lives here.
-->

| Table     | Select   | Insert   | Update   | Delete   | Notes |
| --------- | -------- | -------- | -------- | -------- | ----- |
| `<table>` | `<rule>` | `<rule>` | `<rule>` | `<rule>` |       |

### Storage Buckets

<!-- Fill only when the product uses Supabase Storage. -->

| Bucket     | Purpose     | Path pattern           | Public? | RLS/policy summary |
| ---------- | ----------- | ---------------------- | ------- | ------------------ |
| `<bucket>` | `<purpose>` | `<user-or-org>/<file>` | yes/no  | `<rule>`           |

### Seed And Reference Data

<!--
  Document required static data, seed data, or product defaults.
-->

| Name     | Where defined           | Purpose     | Notes |
| -------- | ----------------------- | ----------- | ----- |
| `<seed>` | `<migration/seed file>` | `<purpose>` |       |

## Schema Principles

- Model real product concepts, not screens.
- Prefer clear table names: plural, lowercase, `snake_case`.
- Use `uuid` primary keys unless a different key is justified.
- Add `created_at` and `updated_at` where records are user or business objects.
- Use foreign keys for relationships.
- Add indexes for frequent filters, joins, and ordering.
- Avoid JSON blobs for data you need to query, filter, join, or authorize.
- Do not add an ORM unless a new ADR accepts it.

## RLS And Access

Row Level Security is required on every user-facing table.

- Browser access uses the Supabase anon key and must be safe under RLS.
- Trusted server operations use the service-role key from `apps/server` only.
- Policies should be explicit and easy to reason about.
- Never rely on client-side filtering for authorization.

Typical policy questions:

- Who can read this row?
- Who can create it?
- Who can update it?
- Who can delete it?
- Is access based on `auth.uid()`, organization membership, ownership, role, or public
  visibility?

## Migrations

Use migrations for schema changes. Do not make manual dashboard-only changes that the repo
cannot reproduce.

Migrations live in `supabase/migrations/`. Seed data for local development lives in
`supabase/seed.sql`. Generated database types live in
`packages/types/src/database.types.ts`.

Supabase CLI may generate migration SQL for you, but the workflow is still
migration-based:

1. Make schema changes locally or in the linked development project.
2. Generate a migration with `pnpm db:diff -- -f <migration_name>` or create an empty one
   with `pnpm db:new <migration_name>`.
3. Review and edit the generated SQL. Do not blindly trust generated diffs.
4. Apply locally with `pnpm db:reset` when testing from a clean state.
5. Regenerate types with `pnpm db:types`.
6. Update this Data Model Catalog.
7. Apply to the linked remote only when ready with `pnpm db:push`.

Avoid direct production/dashboard-only changes. If you must inspect or prototype in the
dashboard, pull or recreate the change as a committed migration before treating it as part
of the product.

Migration checklist:

- [ ] Tables, columns, constraints, and indexes are included.
- [ ] RLS is enabled where needed.
- [ ] Policies are included.
- [ ] Seed/reference data is intentional and repeatable.
- [ ] `packages/types/src/database.types.ts` is regenerated when schema changes.
- [ ] The Data Model Catalog above is updated.
- [ ] Roll-forward strategy is clear if production data exists.

## Storage

Use Supabase Storage for user-uploaded files.

- Buckets need RLS policies.
- Store file metadata and public URLs in Postgres when the product needs to query them.
- Store files under user or organization scoped paths.
- Do not store large file bytes or base64 content in Postgres.

## Query And Performance Rules

- Paginate list queries.
- Add indexes before shipping queries that filter or sort large tables.
- Select only columns needed by the API/view.
- Avoid N+1 query patterns in server services.
- Keep expensive reporting queries behind dedicated endpoints or materialized views when
  needed.

## Data Lifecycle

Decide per feature:

- Hard delete vs soft delete.
- Audit trail requirements.
- Retention and export needs.
- Whether records are tenant-scoped, user-scoped, or public.

Do not add soft delete globally just in case. Add it when the feature needs recovery,
auditability, legal retention, or payment/order history.

## Sync Checklist

- [ ] Schema changes match `docs/FEATURES.md` and `docs/API.md`.
- [ ] Data Model Catalog is updated for new/changed tables, columns, relationships, RLS,
      indexes, storage buckets, and lifecycle rules.
- [ ] API contracts in `packages/types` match persisted data shape where applicable.
- [ ] RLS policies protect every user-facing table.
- [ ] Storage buckets and policies are documented when used.
- [ ] Performance-sensitive queries have indexes.
- [ ] Data tasks are reflected in `docs/PROGRESS.md`.
- [ ] Major data model choices are appended to `docs/DECISIONS.md`.
