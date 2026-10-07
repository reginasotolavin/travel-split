import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRODUCT_FEATURES, type ProductTier } from "@/lib/product-data";
import { Check, Sparkles } from "lucide-react";

export const metadata = {
  title: "Product — Travel Split",
  description: "Explore the features Travel Split offers for group trips.",
};

const tiers: ProductTier[] = ["Gratis", "Viajero", "Grupo Pro"];

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
          <div className="mb-12 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Week 3 · Product architecture
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              What Travel Split offers.
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              A clear view of what you can use today and what is planned for
              future trips.
            </p>
          </div>

          <div className="space-y-12">
            {tiers.map((tier) => (
              <section key={tier} aria-labelledby={`tier-${tier}`}>
                <div className="mb-5 flex items-center gap-3">
                  <h2
                    id={`tier-${tier}`}
                    className="font-display text-2xl font-semibold text-foreground"
                  >
                    {tier}
                  </h2>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {PRODUCT_FEATURES.filter((feature) => feature.tier === tier)
                      .length}{" "}
                    features
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {PRODUCT_FEATURES.filter(
                    (feature) => feature.tier === tier,
                  ).map((feature) => (
                    <article
                      key={feature.name}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-lg font-semibold text-card-foreground">
                          {feature.name}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            feature.status === "Built"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {feature.status === "Built" && (
                            <Check
                              className="mr-1 inline h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          )}
                          {feature.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                      {feature.note && (
                        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                          {feature.note}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
