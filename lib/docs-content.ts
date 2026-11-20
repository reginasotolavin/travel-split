export const BUILD_LOG = [
  {
    module: 'Module 0',
    page: 'Home',
    whatShipped: 'Landing page with the Travel Split message, first built with v0',
    keyFix: '-',
  },
  {
    module: 'Module 1',
    page: '/core',
    whatShipped: 'Trip Starter: a template-based first trip plan (simulated, not AI) that can be saved',
    keyFix: '-',
  },
  {
    module: 'Module 2',
    page: '/research',
    whatShipped: 'Market research: 5 global examples, Mexico notes, risk map, searchable table of 8 competitors, saved snapshots',
    keyFix: 'Fixed a hydration error on /research',
  },
  {
    module: 'Module 3',
    page: '/product, /pricing',
    whatShipped: 'Feature map (Built vs Planned) and pricing simulator with 3 tiers, scenario toggle and saved scenarios',
    keyFix: 'Turned on Row Level Security for research_records',
  },
  {
    module: 'Module 4',
    page: '/marketing',
    whatShipped: 'Brand system, persona, landing copy, 10 posts, 3 video scripts, 14-day calendar, copy/export/save, A/B tests',
    keyFix: 'Limited voting to one vote per test per browser after a voter clicked many times; applied the winning headline',
  },
  {
    module: 'Module 5',
    page: '/chat',
    whatShipped: 'Trip assistant: 3 intake questions, human checkpoint, Gemini tips, guardrail, simulated fallback, 1-5 rating',
    keyFix: 'Fixed an unavailable Gemini model (404), a timeout on the live site (504), and tips that claimed unbuilt features',
  },
  {
    module: 'Module 6',
    page: '/dashboard, /docs, /demo',
    whatShipped: 'Full navigation, records dashboard, build docs, guided tour, agent map, testing summary, impact check, V2 roadmap',
    keyFix: 'Added jump-to-step buttons in /demo (tester feedback), labeled the Trip Starter as Simulated, counted off-topic requests in the guardrail, and fixed the dashboard hiding errors (Supabase project was paused)',
  },
]

export const PROMPT_LIBRARY = [
  {
    module: 'All modules',
    goal: 'Plan before coding',
    prompt:
      'ROLE: You are my disciplined AI-native product architect and coding partner. COURSE RULE: Do not let me code before the plan is clear. TASK: Help me complete this week\'s Build Discipline Packet, then create a precise implementation prompt for Codex or Claude Code. CONSTRAINTS: Free tools only. Next.js/React + Tailwind + Vercel + GitHub + Supabase when data is needed. Build small, testable features. No paid APIs required. If AI output is simulated, label it clearly. Require acceptance criteria before coding.',
  },
  {
    module: 'Module 3',
    goal: 'Pricing logic with tests',
    prompt:
      'Create lib/pricing.ts with pure functions for paying users, monthly revenue and annual revenue, and 2 Vitest tests for the 3 scenarios. Run npm test and STOP.',
  },
  {
    module: 'Module 4',
    goal: 'Fix repeated votes',
    prompt:
      'After someone votes in a test, disable both Vote buttons of that test in that browser and show \'Thanks, your vote was recorded\'. Also disable the button while the vote is being sent. Change only the A/B section.',
  },
  {
    module: 'Module 5',
    goal: 'Guardrail before AI',
    prompt:
      'Run checkGuardrail on every user message before anything else; if triggered, show the matching reply, do not use or store that message.',
  },
  {
    module: 'Module 5',
    goal: 'Find a server error safely',
    prompt:
      'The /api/chat route returns status 502. Find out why and fix it. Do NOT open, read or print .env.local or the value of any key. Add a server log of Gemini\'s status and error message, never the key.',
  },
  {
    module: 'Module 5',
    goal: 'Keep AI answers honest',
    prompt:
      'Tips must be only about the trip and must not mention Travel Split features. Only mention features when the user asks, and say clearly which are built and which are planned.',
  },
]
