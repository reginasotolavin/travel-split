export const PRICING_TIERS = {
  gratis: { name: "Gratis", monthlyPrice: 0, annualPrice: 0 },
  viajero: { name: "Viajero", monthlyPrice: 49, annualPrice: 490 },
  grupoPro: { name: "Grupo Pro", monthlyPrice: 149, annualPrice: 1490 },
} as const;

export const PRICING_SEGMENTS = {
  universityGroups: { name: "University groups", defaultUsers: 1000, tier: "Viajero" },
  frequentOrganizers: { name: "Frequent organizers", defaultUsers: 200, tier: "Grupo Pro" },
} as const;

export const CONVERSION_SCENARIOS = {
  pessimistic: { name: "Pessimistic", rate: 0.02 },
  base: { name: "Base", rate: 0.05 },
  optimistic: { name: "Optimistic", rate: 0.1 },
} as const;

export const DEFAULT_ANNUAL_SHARE = 0.2;
export const DEFAULT_ANNUAL_SHARE_PERCENT = 20;

export function payingUsers(users: number, rate: number): number {
  return Math.floor(users * rate);
}

export function monthlyRevenue({
  universityUsers,
  organizerUsers,
  rate,
}: {
  universityUsers: number;
  organizerUsers: number;
  rate: number;
}): number {
  return (
    payingUsers(universityUsers, rate) * PRICING_TIERS.viajero.monthlyPrice +
    payingUsers(organizerUsers, rate) * PRICING_TIERS.grupoPro.monthlyPrice
  );
}

export function annualRevenue(monthly: number, annualShare: number): number {
  const revenue = monthly * (12 * (1 - annualShare) + 10 * annualShare);
  return Math.round(revenue * 100) / 100;
}

export function annualRevenueFromPercent(monthly: number, annualSharePercent: number): number {
  return annualRevenue(monthly, annualSharePercent / 100);
}

export function formatConversionRate(rate: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(rate);
}
