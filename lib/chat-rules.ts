export type ChatBudget = number | "not sure";

export const GUARDRAIL_REPLIES = {
  personal_data:
    "For your safety, please don't share personal details like passport numbers, card numbers or passwords. I don't need them to help you plan.",
  visa_health_legal:
    "I can't give visa, health or legal advice. Please check official sources, like the destination's embassy or a doctor.",
} as const;

export function parseGroupSize(text: string): number | null {
  const match = text.match(/(?<![\d.,-])(\d{1,2})(?![\d.,])/);
  if (!match) return null;

  const groupSize = Number(match[1]);
  return Number.isInteger(groupSize) && groupSize >= 2 && groupSize <= 50
    ? groupSize
    : null;
}

export function parseBudget(text: string): ChatBudget | null {
  if (/\bnot\s+sure\b/i.test(text)) return "not sure";

  const match = text.match(
    /(?<![\d.,-])((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(?![\d.,])/,
  );
  if (!match) return null;

  const budget = Number(match[1].replaceAll(",", ""));
  return Number.isFinite(budget) ? budget : null;
}

export function checkGuardrail(
  text: string,
): keyof typeof GUARDRAIL_REPLIES | null {
  const hasCardLikeNumber =
    /(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)/.test(text);
  const mentionsPersonalData =
    /\bpassport\s*(?:number|no\.?|#)\b|\bID\s*(?:number|no\.?|#)\b|\bCURP\b|\bpassword\b/i.test(
      text,
    );

  if (hasCardLikeNumber || mentionsPersonalData) return "personal_data";

  const asksForRestrictedAdvice =
    /\bvisas?\b|\bvaccines?\b|\bmedicines?\b|\bmedication\b|\bhealth\b|\binsurance\s+claims?\b|\blaws?\b|\blegal(?:ity)?\b/i.test(
      text,
    );
  return asksForRestrictedAdvice ? "visa_health_legal" : null;
}

export function templateTips(
  destination: string,
  groupSize: number,
  budget: ChatBudget,
): string[] {
  const budgetText =
    budget === "not sure"
      ? "not sure yet"
      : `$${new Intl.NumberFormat("en-US").format(budget)} MXN`;
  const context = `${groupSize} people visiting ${destination}, with a budget of ${budgetText} per person`;

  return [
    `For ${context}, agree on a comfortable spending limit together before making plans.`,
    `For ${context}, compare transport options and decide together which trade-offs work best.`,
    `For ${context}, shortlist a few activities in ${destination} and check current prices before committing.`,
    `For ${context}, choose a convenient meeting point and share the plan with everyone in the group.`,
    `For ${context}, leave some room in the plan for unexpected costs and changes.`,
  ];
}
