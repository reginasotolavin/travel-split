# Travel Split Market Research

## Research prompt

> Build a directional market-research snapshot for Travel Split, a collaborative trip-planning product for groups. Compare five global products, explain the Mexico market context, map at least eight competitors or substitutes by features and gaps, and identify the main risks to competition, differentiation, adoption, trust, and monetization. Keep observations concise and useful for product validation. Do not scrape the web, invent live pricing, or present unverified market size claims.

This Week 2 snapshot is intentionally a maintained research artifact rather than live web scraping. The source data is kept in `components/research-workspace.tsx` so the same snapshot can be rendered, filtered, and saved as a record.

## Included examples

- Splitwise: shared expense tracking and settlement.
- TripIt: reservation aggregation and itinerary management.
- Wanderlog: collaborative itinerary, places, maps, and reservations.
- Sygic Travel: destination planning and offline guidance.
- Roadtrippers: road-trip discovery and routing.

## Mexico localization notes

- WhatsApp is a strong coordination default, so Travel Split should reduce chat clutter and create a shared source of truth.
- Mexico has both domestic and cross-border travel demand, with different needs across family, friends, and small-group trips.
- MXN budgets, cash and bank-transfer habits, bilingual content, and uneven connectivity should inform early workflows.

## Supabase setup

Add the existing server-only environment variables from the Core documentation to `.env.local` and Vercel. Then create the table below:

```sql
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
```

The same SQL is available in `docs/research_records.sql`. Run it in the Supabase SQL Editor once, then `/api/research` reads the eight newest records and inserts a complete snapshot with normalized research fields. It intentionally does not add authentication, ownership, real-time updates, scraping, pricing automation, or live charts.
