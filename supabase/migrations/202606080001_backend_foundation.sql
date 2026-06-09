create extension if not exists citext with schema public;
create extension if not exists pgcrypto with schema public;

do $$ begin
  create type public.product_type as enum ('free', 'github', 'download', 'bundle');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.product_category as enum ('repos', 'apps', 'prompts', 'skills', 'templates', 'bundle');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.product_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.roadmap_status as enum ('planned', 'in_progress', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum ('draft', 'awaiting_payment', 'paid', 'cancelled', 'refunded');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.entitlement_source as enum ('purchase', 'gift', 'redeem', 'free_claim', 'admin_grant');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.invite_status as enum ('pending', 'invited', 'accepted', 'failed', 'revoked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.membership_tier as enum ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'legendary');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ticket_priority as enum ('low', 'normal', 'high');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext not null unique,
  display_name text not null,
  avatar_url text,
  banner_url text,
  country text,
  country_public boolean not null default false,
  bio text,
  founder_number int,
  tier public.membership_tier not null default 'bronze',
  lifetime_spend_idr bigint not null default 0,
  timeline_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description_md text,
  overview text[] not null default '{}',
  features text[] not null default '{}',
  how_to_use text[] not null default '{}',
  type public.product_type not null,
  category public.product_category not null,
  price_idr bigint not null default 0,
  version text,
  github_repo text,
  download_path text,
  cover_url text,
  status public.product_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position int not null default 0,
  kind text not null default 'screenshot',
  created_at timestamptz not null default now()
);

create table if not exists public.changelog_entries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  version text not null,
  released_at date not null,
  changes text[] not null default '{}',
  body_md text,
  created_at timestamptz not null default now()
);

create table if not exists public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  body_md text,
  status public.roadmap_status not null default 'planned',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_dependencies (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  required_product_id uuid not null references public.products(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (product_id, required_product_id),
  constraint product_dependencies_no_self check (product_id <> required_product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status public.order_status not null default 'awaiting_payment',
  subtotal_idr bigint not null default 0,
  discount_idr bigint not null default 0,
  total_idr bigint not null default 0,
  coupon_id uuid,
  recipient_type text not null default 'self' check (recipient_type in ('self', 'gift')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  unit_price_idr bigint not null default 0,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'midtrans',
  provider_order_id text not null,
  provider_transaction_id text,
  status public.payment_status not null default 'pending',
  gross_amount_idr bigint not null default 0,
  signature_verified boolean not null default false,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_order_id)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  source public.entitlement_source not null,
  order_id uuid references public.orders(id) on delete set null,
  code_id uuid,
  acquired_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, product_id)
);

create table if not exists public.github_invites (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.entitlements(id) on delete cascade,
  github_repo text not null,
  github_username text,
  status public.invite_status not null default 'pending',
  last_attempt_at timestamptz,
  attempts int not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text not null default '',
  body_md text not null default '',
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  link_url text,
  metadata jsonb not null default '{}',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  category text not null,
  status public.ticket_status not null default 'open',
  priority public.ticket_priority not null default 'normal',
  related_order_id uuid references public.orders(id) on delete set null,
  last_admin_reply_at timestamptz,
  last_user_reply_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.email_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  product_updates boolean not null default true,
  sales boolean not null default true,
  announcements boolean not null default true,
  wishlist_alerts boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_published_idx on public.products(status) where status = 'published';
create index if not exists products_category_idx on public.products(category);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists entitlements_user_product_idx on public.entitlements(user_id, product_id);
create index if not exists notifications_user_read_created_idx on public.notifications(user_id, is_read, created_at desc);
create index if not exists support_tickets_user_created_idx on public.support_tickets(user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists github_invites_set_updated_at on public.github_invites;
create trigger github_invites_set_updated_at before update on public.github_invites
for each row execute function public.set_updated_at();

drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at before update on public.support_tickets
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at before update on public.reviews
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.changelog_entries enable row level security;
alter table public.roadmap_items enable row level security;
alter table public.product_dependencies enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.entitlements enable row level security;
alter table public.github_invites enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.email_preferences enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles owner update" on public.profiles for update using (auth.uid() = id);

create policy "products published read" on public.products for select using (status = 'published');
create policy "product_media published read" on public.product_media for select using (
  exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
);
create policy "changelog published read" on public.changelog_entries for select using (
  exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
);
create policy "roadmap published read" on public.roadmap_items for select using (
  exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
);
create policy "dependencies public read" on public.product_dependencies for select using (true);

create policy "orders owner read" on public.orders for select using (auth.uid() = user_id);
create policy "order_items owner read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "payments owner read" on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "entitlements owner read" on public.entitlements for select using (auth.uid() = user_id);
create policy "github_invites owner read" on public.github_invites for select using (
  exists (select 1 from public.entitlements e where e.id = entitlement_id and e.user_id = auth.uid())
);
create policy "wishlist owner select" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "wishlist owner insert" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "wishlist owner delete" on public.wishlist_items for delete using (auth.uid() = user_id);
create policy "reviews public read" on public.reviews for select using (hidden = false);
create policy "notifications owner read" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications owner update" on public.notifications for update using (auth.uid() = user_id);
create policy "support_tickets owner read" on public.support_tickets for select using (auth.uid() = user_id);
create policy "support_tickets owner insert" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "support_messages owner read" on public.support_messages for select using (
  exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid())
);
create policy "support_messages owner insert" on public.support_messages for insert with check (
  exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid())
);
create policy "email_preferences owner read" on public.email_preferences for select using (auth.uid() = user_id);
create policy "email_preferences owner update" on public.email_preferences for update using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', split_part(new.email, '@', 1), 'user'), '[^a-zA-Z0-9_]+', '', 'g'));
  if base_username = '' then
    base_username := 'user';
  end if;

  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', candidate))
  on conflict (id) do nothing;

  insert into public.email_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
