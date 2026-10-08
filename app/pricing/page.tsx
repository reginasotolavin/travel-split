"use client";

import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { PRODUCT_FEATURES, type ProductTier } from "@/lib/product-data";
import {
  CONVERSION_SCENARIOS,
  DEFAULT_ANNUAL_SHARE_PERCENT,
  PRICING_SEGMENTS,
  PRICING_TIERS,
  annualRevenueFromPercent,
  formatConversionRate,
  monthlyRevenue,
} from "@/lib/pricing";

type ScenarioKey = keyof typeof CONVERSION_SCENARIOS;

const scenarioKeys: ScenarioKey[] = ["pessimistic", "base", "optimistic"];
const tierNames: ProductTier[] = ["Gratis", "Viajero", "Grupo Pro"];
const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const assumptionReasons = {
  universityUsers: "Small early audience from one campus network",
  organizerUsers: "Smaller group that plans more often",
  conversion: "Freemium apps convert a small share of free users",
  annualShare: "Most users try monthly first",
  viajeroPrice: "Below the cost of one group dinner; students are price-sensitive",
  grupoProPrice: "Organizers save hours per trip and manage several trips",
};

function FeatureStatus({ status }: { status: "Built" | "Planned" }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
        status === "Built"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export default function PricingPage() {
  const [scenario, setScenario] = useState<ScenarioKey>("base");
  const [universityUsers, setUniversityUsers] = useState(
    String(PRICING_SEGMENTS.universityGroups.defaultUsers),
  );
  const [organizerUsers, setOrganizerUsers] = useState(
    String(PRICING_SEGMENTS.frequentOrganizers.defaultUsers),
  );
  const [annualSharePercent, setAnnualSharePercent] = useState(
    String(DEFAULT_ANNUAL_SHARE_PERCENT),
  );

  const conversionRate = CONVERSION_SCENARIOS[scenario].rate;
  const monthly = monthlyRevenue({
    universityUsers: Number(universityUsers),
    organizerUsers: Number(organizerUsers),
    rate: conversionRate,
  });
  const annual = annualRevenueFromPercent(monthly, Number(annualSharePercent));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
          <div className="mb-12 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Week 3 · Pricing model
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Simple plans for better group trips.
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Compare what each plan includes and explore revenue scenarios
              using the assumptions below.
            </p>
          </div>

          <section className="mb-16" aria-labelledby="plans-heading">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Plans
              </p>
              <h2
                id="plans-heading"
                className="mt-2 font-display text-2xl font-semibold text-foreground"
              >
                Choose the right fit for your group
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {tierNames.map((tierName) => {
                const tier = Object.values(PRICING_TIERS).find(
                  (item) => item.name === tierName,
                );
                const features = PRODUCT_FEATURES.filter(
                  (feature) => feature.tier === tierName,
                );
                if (!tier) return null;

                return (
                  <article
                    key={tierName}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-card-foreground">
                      {tier.name}
                    </h3>
                    <div className="mt-4">
                      <p className="font-display text-3xl font-bold text-foreground">
                        {currency.format(tier.monthlyPrice)}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          / month
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currency.format(tier.annualPrice)} / year
                      </p>
                    </div>
                    <ul className="mt-6 flex-1 space-y-4 border-t border-border pt-5">
                      {features.map((feature) => (
                        <li
                          key={feature.name}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <span className="leading-relaxed text-card-foreground">
                            {feature.name}
                          </span>
                          <FeatureStatus status={feature.status} />
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mb-16" aria-labelledby="calculator-heading">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Revenue calculator
              </p>
              <h2
                id="calculator-heading"
                className="mt-2 font-display text-2xl font-semibold text-foreground"
              >
                Explore a few possible outcomes
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                <fieldset>
                  <legend className="text-sm font-semibold text-foreground">
                    Conversion scenario
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scenarioKeys.map((key) => (
                      <Button
                        key={key}
                        type="button"
                        variant={scenario === key ? "default" : "outline"}
                        aria-pressed={scenario === key}
                        onClick={() => setScenario(key)}
                      >
                        {CONVERSION_SCENARIOS[key].name} (
                        {formatConversionRate(CONVERSION_SCENARIOS[key].rate)})
                      </Button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    University users
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={universityUsers}
                      onChange={(event) =>
                        setUniversityUsers(event.target.value)
                      }
                      className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    Organizer users
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={organizerUsers}
                      onChange={(event) =>
                        setOrganizerUsers(event.target.value)
                      }
                      className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
                    Share on annual plan (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={annualSharePercent}
                      onChange={(event) =>
                        setAnnualSharePercent(event.target.value)
                      }
                      className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <article className="rounded-2xl border border-primary/20 bg-secondary/45 p-6 md:p-8">
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly revenue
                  </p>
                  <p className="mt-3 font-display text-3xl font-bold text-foreground">
                    {currency.format(monthly)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    At the {CONVERSION_SCENARIOS[scenario].name.toLowerCase()}{" "}
                    conversion rate
                  </p>
                </article>
                <article className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                  <p className="text-sm font-medium text-muted-foreground">
                    Annual revenue
                  </p>
                  <p className="mt-3 font-display text-3xl font-bold text-foreground">
                    {currency.format(annual)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    With {annualSharePercent || "0"}% on annual plans
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section aria-labelledby="assumptions-heading">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Model notes
              </p>
              <h2
                id="assumptions-heading"
                className="mt-2 font-display text-2xl font-semibold text-foreground"
              >
                Assumptions behind the estimate
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Assumption</th>
                      <th className="px-5 py-4 font-semibold">Value</th>
                      <th className="px-5 py-4 font-semibold">Why</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <th className="px-5 py-4 font-medium text-foreground">
                        University users
                      </th>
                      <td className="px-5 py-4 text-card-foreground">
                        {universityUsers}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {assumptionReasons.universityUsers}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-foreground">
                        Organizer users
                      </th>
                      <td className="px-5 py-4 text-card-foreground">
                        {organizerUsers}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {assumptionReasons.organizerUsers}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-foreground">
                        Conversion
                      </th>
                      <td className="px-5 py-4 text-card-foreground">
                        {formatConversionRate(conversionRate)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {assumptionReasons.conversion}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-foreground">
                        Annual share
                      </th>
                      <td className="px-5 py-4 text-card-foreground">
                        {annualSharePercent || "0"}%
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {assumptionReasons.annualShare}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-foreground">
                        Viajero price
                      </th>
                      <td className="px-5 py-4 text-card-foreground">
                        {currency.format(PRICING_TIERS.viajero.monthlyPrice)} /
                        month
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {assumptionReasons.viajeroPrice}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-foreground">
                        Grupo Pro price
                      </th>
                      <td className="px-5 py-4 text-card-foreground">
                        {currency.format(PRICING_TIERS.grupoPro.monthlyPrice)} /
                        month
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {assumptionReasons.grupoProPrice}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
