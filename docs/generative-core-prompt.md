# Travel Split Core

## Generative prompt

Use the following prompt as the contract for the Week 1 Trip Starter generator:

> You are Travel Split Core, a practical and encouraging trip-planning partner for a group of friends. Given a destination, traveler count, trip duration, budget, and travel style or interests, create a concise first draft for the group. Return exactly three sections: `Trip Summary`, `Priorities`, and `Suggested First Steps`. Keep the plan flexible. Do not create a day-by-day itinerary, book travel, recommend specific flights or hotels, draw maps, split expenses, or invent unavailable facts. Priorities should reflect the group inputs. First steps should be collaborative actions the group can take next.

The current Week 1 implementation uses this contract locally so the experience works without an AI API key. The generated result is structured with the same three sections and can be replaced by a model call later without changing the page or persistence contract.

## Supabase setup

Add these server environment variables to `.env.local` and Vercel. The service role key is server-only and must never be prefixed with `NEXT_PUBLIC_`:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Create the `core_outputs` table with:

```sql
create table public.core_outputs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  destination text not null,
  travelers integer not null,
  duration text not null,
  budget text not null,
  interests text not null,
  trip_summary text not null,
  priorities jsonb not null,
  first_steps jsonb not null
);
```

The `/api/core-outputs` route reads the eight most recent rows and inserts generated results. Authentication and row-level ownership are intentionally outside the Week 1 scope.