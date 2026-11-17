export type DemoBadge = 'Built' | 'Simulated' | 'Planned'

export type DemoStep = {
  id: number
  title: string
  badge?: DemoBadge
  page?: string
  text: string
  kind?: 'agent-map' | 'roadmap' | 'placeholder'
  roadmap?: Array<{
    priority: number
    title: string
    why: string
    evidence: string
  }>
  agentMap?: {
    title: string
    boxes: Array<{ name: string; line: string }>
    sideBox?: { name: string; line: string }
  }[]
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: 'Welcome to Travel Split',
    text:
      'Travel Split helps the friend who always organizes the group trip. This tour shows every part of the app in about 5 minutes, and tells you clearly what is built, simulated or planned.',
  },
  {
    id: 2,
    title: 'Trip Starter',
    badge: 'Simulated',
    page: '/core',
    text:
      'Type a destination, group size, budget and interests, and get a first trip plan you can save. It uses ready-made templates, not AI.',
  },
  {
    id: 3,
    title: 'Market research',
    badge: 'Built',
    page: '/research',
    text:
      'The research behind the idea: global examples, notes for the Mexican market, a risk map and a searchable table of 8 competitors.',
  },
  {
    id: 4,
    title: 'Product and pricing',
    badge: 'Built',
    page: '/pricing',
    text:
      'What the app offers (Built vs Planned) and a pricing simulator with 3 plans. Open /product from the menu to see the feature map.',
  },
  {
    id: 5,
    title: 'Marketing engine',
    badge: 'Built',
    page: '/marketing',
    text:
      'Brand, persona, 10 social posts, 3 video scripts and a 14-day campaign, plus A/B tests voted by real people.',
  },
  {
    id: 6,
    title: 'Trip assistant',
    badge: 'Built',
    page: '/chat',
    text:
      'Answer 3 questions, confirm the summary, and get 5 tips from Google Gemini. It blocks personal data and visa, health or legal questions.',
  },
  {
    id: 7,
    title: 'Dashboard',
    badge: 'Built',
    page: '/dashboard',
    text:
      'Everything the app has saved, live from the database: starters, research, pricing scenarios, marketing assets, A/B votes and assistant ratings.',
  },
  {
    id: 8,
    title: 'How it\'s built',
    badge: 'Built',
    page: '/docs',
    kind: 'agent-map',
    text: 'The system behind the product, from planning to publication and app logic.',
    agentMap: [
      {
        title: 'How it was built',
        boxes: [
          { name: 'Me', line: 'plan, decisions, testing, every commit' },
          { name: 'Coding agent', line: 'Codex/Copilot in GitHub Codespaces writes the code from my prompts' },
          { name: 'GitHub', line: 'public repo, one commit per task' },
          { name: 'Vercel', line: 'publishes the live site on every push' },
        ],
      },
      {
        title: 'How it works inside the app',
        boxes: [
          { name: 'Visitor', line: 'uses the app' },
          { name: 'Guardrail', line: 'rules in the page block personal data and visa, health or legal questions' },
          { name: 'Human checkpoint', line: 'the user confirms the trip summary' },
          { name: 'Gemini', line: 'free tier, writes the tips' },
          { name: 'Supabase', line: 'stores summaries, ratings and other records' },
        ],
        sideBox: { name: 'Trip Starter', line: 'templates, simulated, no AI' },
      },
    ],
  },
  {
    id: 9,
    title: 'Testing and impact',
    badge: 'Built',
    kind: 'placeholder',
    text: 'This section will be filled in after the final user feedback is added.',
  },
  {
    id: 10,
    title: "What's next",
    badge: 'Planned',
    kind: 'roadmap',
    text: 'A short version 2 roadmap for the next product phase.',
    roadmap: [
      {
        priority: 1,
        title: 'Expense splitting for the group',
        why: 'The feature the homepage promises most, and the main reason to pay for Viajero',
        evidence: 'Listed as Planned on /product; the assistant has to tell users it isn\'t built',
      },
      {
        priority: 2,
        title: 'Login and group invites',
        why: 'So the whole group can share one trip, not just the organizer',
        evidence: 'Today every visit is anonymous and nothing is shared',
      },
      {
        priority: 3,
        title: 'Personalized Trip Starter with Gemini',
        why: 'Make Trip Starter tips fit the destination, group and budget',
        evidence: 'Testers said tips can feel a bit generic; the Module 2 test user asked for this',
      },
      {
        priority: 4,
        title: 'Reservations and day-by-day itinerary',
        why: 'Keep bookings and the plan in one place',
        evidence: 'Listed as Planned on /product',
      },
    ],
  },
]
