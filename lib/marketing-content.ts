export const BRAND_SYSTEM = {
  name: "Travel Split",
  tagline: "Your whole trip, one place.",
  voice: {
    description: "Practical and trustworthy: short sentences, concrete benefits, no hype, no emojis in headlines.",
    do: ["Get a trip plan in minutes.", "Free to try."],
    dont: ["Revolutionary!", "The best app ever.", "Promises of features that are not built."],
  },
  colors: "the existing teal of the site.",
  typeAndLogo: "the existing fonts and compass logo.",
} as const;

export const PERSONA = {
  name: "Andrea",
  age: 28,
  fictional: true,
  who: "Organizes 3 to 5 group trips a year: family vacations, a friend's bachelorette, team offsites.",
  pain: "Plans live in a 40-message group chat; she repeats the same answers and chases everyone for decisions.",
  goal: 'Get a clear first plan to the group fast, so people stop asking "so what\'s the plan?".',
  whereSheIs: "Instagram and TikTok, saving travel tips and reels.",
  whatSheNeedsToHear: "Travel Split gives her a trip starter in minutes, for free.",
  objection: '"Another app my friends won\'t download" - Trip Starter works with no sign-up, so she can try it in a minute.',
} as const;

export const LANDING_COPY = {
  headline: "Stop organizing group trips in the chat.",
  subheadline: "Travel Split's Trip Starter turns your destination, dates and group into a first trip plan you can save, in minutes.",
  benefits: [
    "A clear first plan for everyone",
    "Starts from your destination, group size, budget and interests",
    "Free, no sign-up.",
  ],
  cta: "Try Trip Starter free.",
  honestyLine: "Trip Starter uses ready-made templates, not AI.",
} as const;

export const SOCIAL_POSTS = [
  {
    id: "post-1",
    channel: "Instagram",
    hook: "Stop planning trips in the group chat.",
    caption: "40 messages and still no plan? Trip Starter gives your group a first plan in minutes.",
    cta: "Try Trip Starter free (link in bio)",
  },
  {
    id: "post-2",
    channel: "TikTok",
    hook: "POV: you're the friend who always plans the trip.",
    caption: "Type the destination, dates and group size. Get a starting plan. Send it to the chat.",
    cta: "Try it free",
  },
  {
    id: "post-3",
    channel: "Instagram",
    hook: '"So what\'s the plan?" asked 12 times.',
    caption: "Answer it once. Make a trip starter and share it with the group.",
    cta: "Make yours free",
  },
  {
    id: "post-4",
    channel: "TikTok",
    hook: "3 things every group trip needs on day one.",
    caption: "A destination, dates and someone with a plan. Trip Starter handles the plan part.",
    cta: "Link in bio",
  },
  {
    id: "post-5",
    channel: "Instagram",
    hook: "Organizing a bachelorette? Start here.",
    caption: "Put in your city, dates and group size, and get a first plan to send the girls.",
    cta: "Try Trip Starter free",
  },
  {
    id: "post-6",
    channel: "TikTok",
    hook: "Planning a family trip in 60 seconds.",
    caption: "Watch me make a starting plan for 8 people in under a minute.",
    cta: "Try it yourself, free",
  },
  {
    id: "post-7",
    channel: "Instagram",
    hook: "Your group chat is not a planning tool.",
    caption: "Keep the chat for memes. Keep the plan in Travel Split.",
    cta: "Try Trip Starter free",
  },
  {
    id: "post-8",
    channel: "TikTok",
    hook: "The friend who plans the trip deserves a break.",
    caption: "Trip Starter gives you a first draft so you're not starting from zero.",
    cta: "Link in bio",
  },
  {
    id: "post-9",
    channel: "Instagram",
    hook: "Free. No sign-up. One trip plan.",
    caption: "That's Trip Starter. Try it before your next group trip.",
    cta: "Try it now",
  },
  {
    id: "post-10",
    channel: "TikTok",
    hook: "Rate my group trip plan.",
    caption: "I made this with Trip Starter in 2 minutes. What would you add?",
    cta: "Make your own, free",
  },
] as const;

export const VIDEO_SCRIPTS = [
  {
    id: "script-1",
    title: "The group chat chaos",
    scenes: [
      {
        timing: "0-3s",
        text: 'Phone screen with the group chat full of "so what\'s the plan?" messages. Text on screen: "Every group trip, ever."',
      },
      { timing: "3-12s", text: 'Me, tired: "I\'m always the one who has to figure it out."' },
      {
        timing: "12-30s",
        text: "Screen recording of Trip Starter: type destination, dates, group size, tap Generate, show the plan.",
      },
      { timing: "30-40s", text: '"Next time, start with this. It\'s free. Link in bio."' },
    ],
  },
  {
    id: "script-2",
    title: "Planning a trip in 60 seconds",
    scenes: [
      { timing: "0-3s", text: 'Timer on screen: "Can I plan a group trip in 60 seconds?"' },
      {
        timing: "3-45s",
        text: "Fill in Trip Starter step by step while the timer runs; show the result.",
      },
      { timing: "45-50s", text: '"Done. Try Trip Starter free, link in bio."' },
    ],
  },
  {
    id: "script-3",
    title: "The organizer",
    scenes: [
      {
        timing: "0-3s",
        text: '"If you\'re always the friend who plans the trip, this is for you."',
      },
      { timing: "3-15s", text: "Quick cuts: booking, messaging, reminding everyone." },
      {
        timing: "15-35s",
        text: '"Trip Starter gives you a first plan in minutes, so you\'re not starting from zero." Show the app.',
      },
      { timing: "35-40s", text: '"Free, no sign-up. Link in bio."' },
    ],
  },
] as const;

export const MARKETING_CALENDAR = [
  { id: "day-1", day: 1, channel: "Instagram", asset: "Post 1", goal: "Introduce the problem" },
  { id: "day-2", day: 2, channel: "TikTok", asset: "Script 1", goal: "Reach new organizers" },
  { id: "day-3", day: 3, channel: "Instagram", asset: "Post 3", goal: "Relate to the pain" },
  { id: "day-4", day: 4, channel: "TikTok", asset: "Post 2", goal: "Show who it's for" },
  { id: "day-5", day: 5, channel: "Instagram", asset: "Post 5", goal: "Bachelorette organizers" },
  { id: "day-6", day: 6, channel: "TikTok", asset: "Post 4", goal: "Useful tip, builds trust" },
  { id: "day-7", day: 7, channel: "Instagram", asset: "Post 7", goal: "Recap week 1 message" },
  { id: "day-8", day: 8, channel: "TikTok", asset: "Script 2", goal: "Show how fast it is" },
  { id: "day-9", day: 9, channel: "Instagram", asset: "Post 9", goal: "Push the free try" },
  { id: "day-10", day: 10, channel: "TikTok", asset: "Post 6", goal: "Family trip organizers" },
  { id: "day-11", day: 11, channel: "Instagram", asset: "Post 8", goal: "Empathy for the planner" },
  { id: "day-12", day: 12, channel: "TikTok", asset: "Script 3", goal: "Speak to the organizer" },
  { id: "day-13", day: 13, channel: "TikTok", asset: "Post 10", goal: "Engagement, comments" },
  { id: "day-14", day: 14, channel: "Instagram", asset: "Post 9 (repost as story)", goal: "Final push to try it free" },
] as const;
