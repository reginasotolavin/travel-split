export type DemoBadge = 'Built' | 'Simulated' | 'Planned'

export type DemoStep = {
  id: number
  title: string
  badge?: DemoBadge
  page?: string
  text: string
  kind?: 'agent-map' | 'roadmap' | 'testing-impact' | 'placeholder'
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
  testingSummary?: {
    testers: Array<{
      tester: string
      whatTheyTested: string
      rating: string
      quote: string
    }>
    regressionLine: string
    impactItems: Array<{ label: string; text: string }>
  }
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
    kind: 'testing-impact',
    text: 'What testers learned and how their feedback shaped the product.',
    testingSummary: {
      testers: [
        {
          tester: 'U1 Natalia',
          whatTheyTested: '/chat, trip to Italy (Module 5)',
          rating: '5/5',
          quote: 'The tips felt pretty good, a bit generic, but they work.',
        },
        {
          tester: 'U2 Ximena',
          whatTheyTested: '/chat, trip to San Diego (Module 5)',
          rating: '5/5',
          quote: '100% I would use it for my trips.',
        },
        {
          tester: 'U3 Regina R.',
          whatTheyTested: '/chat, trip to the Bahamas (Module 5)',
          rating: '5/5',
          quote: 'I liked that it gave me tips to save money and go to more local places.',
        },
        {
          tester: 'U4 Regina S.',
          whatTheyTested: 'Whole app through /demo (Module 6)',
          rating: '5/5',
          quote: 'Planning a trip takes time, and this makes it much simpler and more practical.',
        },
        {
          tester: 'U5 Ana Camila',
          whatTheyTested: 'Whole app through /demo, trip to Milan (Module 6)',
          rating: '5/5',
          quote: 'It makes deciding easier, because you get concrete proposals.',
        },
        {
          tester: 'U6 Valeria',
          whatTheyTested: 'Whole app through /demo (Module 6)',
          rating: '5/5',
          quote: 'I liked that it helps plan an itinerary, but it can be very general.',
        },
      ],
      regressionLine:
        'Full-site regression test (Nov 18-19, 2026): 10 of 12 checks passed on the first run. R3 (/core missing a Simulated label) and R8 (homework not counted by the guardrail) failed, were fixed and retested. All 12 checks pass now.',
      impactItems: [
        {
          label: 'Who it helps',
          text: 'The person who organizes group trips and gets stuck answering the same questions in long group chats.',
        },
        {
          label: 'Evidence',
          text: '6 external testers, all rated it 5/5. U1-U3 tested the trip assistant in Module 5; U4-U6 tested the whole app through this tour. All 6 said they would use it, at least for trip tips, and nobody found anything broken.',
        },
        {
          label: 'What users get today',
          text: 'Built - research, pricing simulator, marketing, trip assistant, dashboard. Simulated - Trip Starter templates. Planned - expense splitting, group invites, reservations, itinerary.',
        },
        {
          label: 'Limits users noticed',
          text: 'Tips can feel generic (U1, U6), the app helps more with tips than with planning the whole trip (U3), and reaching the chat step took too many clicks (U5).',
        },
        {
          label: 'What changed because of testing',
          text: 'Numbered buttons to jump to any step (from U5), a Simulated label on the Trip Starter (from regression R3), and homework or coding requests now counted by the guardrail (from regression R8).',
        },
      ],
    },
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
