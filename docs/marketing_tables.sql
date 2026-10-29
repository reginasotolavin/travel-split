create table if not exists public.marketing_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  asset_id text not null,
  asset_type text not null,
  title text not null,
  content text not null
);

alter table public.marketing_assets enable row level security;

create policy "marketing_assets_select_policy"
  on public.marketing_assets
  for select
  using (true);

create policy "marketing_assets_insert_policy"
  on public.marketing_assets
  for insert
  with check (true);

create table if not exists public.ab_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  test_id text not null check (test_id in ('headline', 'button')),
  variant text not null check (variant in ('A', 'B'))
);

alter table public.ab_votes enable row level security;

create policy "ab_votes_select_policy"
  on public.ab_votes
  for select
  using (true);

create policy "ab_votes_insert_policy"
  on public.ab_votes
  for insert
  with check (true);
