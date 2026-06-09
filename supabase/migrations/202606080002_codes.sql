-- Redeem/gift/promo codes. A code grants one or more products and can be redeemed up to `uses`
-- times. Reads/writes go through the server service client, so RLS denies direct client access.

do $$ begin
  create type public.code_kind as enum ('gift', 'promo', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.code_status as enum ('active', 'redeemed', 'expired', 'revoked');
exception when duplicate_object then null;
end $$;

create table if not exists public.codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  kind public.code_kind not null default 'gift',
  status public.code_status not null default 'active',
  uses int not null default 1 check (uses >= 1),
  uses_count int not null default 0 check (uses_count >= 0),
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.code_products (
  code_id uuid not null references public.codes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (code_id, product_id)
);

create index if not exists codes_code_idx on public.codes (code);

alter table public.codes enable row level security;
alter table public.code_products enable row level security;
-- No policies: only the server (service role) may read or write codes.
