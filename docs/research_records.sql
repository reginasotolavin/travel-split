create table if not exists public.research_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  name text not null,
  type text not null,
  key_features jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  mexico_context jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  insights jsonb not null default '[]'::jsonb,
  research_data jsonb not null
);

create index if not exists research_records_created_at_idx
  on public.research_records (created_at desc);
