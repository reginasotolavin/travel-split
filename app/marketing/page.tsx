import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  BRAND_SYSTEM,
  LANDING_COPY,
  MARKETING_CALENDAR,
  PERSONA,
  SOCIAL_POSTS,
  VIDEO_SCRIPTS,
} from "@/lib/marketing-content";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
          <header className="mb-12 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Week 4 · Marketing engine
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              How Travel Split reaches organizers.
            </h1>
          </header>

          <section className="mb-14" aria-labelledby="brand-system-heading">
            <h2
              id="brand-system-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              Brand system
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard label="Name" value={BRAND_SYSTEM.name} />
              <InfoCard label="Tagline" value={BRAND_SYSTEM.tagline} />
              <InfoCard label="Voice" value={BRAND_SYSTEM.voice.description} />
              <InfoCard label="Do" value={BRAND_SYSTEM.voice.do.join(" ")} />
              <InfoCard label="Don't" value={BRAND_SYSTEM.voice.dont.join(" ")} />
              <InfoCard
                label="Colors"
                value={BRAND_SYSTEM.colors}
              />
              <InfoCard
                label="Type and logo"
                value={BRAND_SYSTEM.typeAndLogo}
              />
            </div>
          </section>

          <section className="mb-14" aria-labelledby="persona-heading">
            <h2
              id="persona-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              Persona
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-foreground">
                {PERSONA.name}, {PERSONA.age} (fictional)
              </h3>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <InfoItem label="Who" value={PERSONA.who} />
                <InfoItem label="Pain" value={PERSONA.pain} />
                <InfoItem label="Goal" value={PERSONA.goal} />
                <InfoItem label="Where she is" value={PERSONA.whereSheIs} />
                <InfoItem
                  label="What she needs to hear"
                  value={PERSONA.whatSheNeedsToHear}
                />
                <InfoItem label="Objection" value={PERSONA.objection} />
              </dl>
            </div>
          </section>

          <section className="mb-14" aria-labelledby="landing-copy-heading">
            <h2
              id="landing-copy-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              Landing copy
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Headline
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                {LANDING_COPY.headline}
              </h3>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
                Subheadline
              </p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {LANDING_COPY.subheadline}
              </p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
                Benefits
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                {LANDING_COPY.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
                CTA
              </p>
              <p className="mt-2 font-semibold text-foreground">
                {LANDING_COPY.cta}
              </p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
                Honesty line
              </p>
              <p className="mt-2 text-muted-foreground">
                {LANDING_COPY.honestyLine}
              </p>
            </div>
          </section>

          <section className="mb-14" aria-labelledby="social-posts-heading">
            <h2
              id="social-posts-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              Social posts
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {SOCIAL_POSTS.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {post.channel}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {post.hook}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {post.caption}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-primary">
                    {post.cta}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-14" aria-labelledby="video-scripts-heading">
            <h2
              id="video-scripts-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              Video scripts
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {VIDEO_SCRIPTS.map((script) => (
                <article
                  key={script.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {script.title}
                  </h3>
                  <ol className="mt-5 space-y-4">
                    {script.scenes.map((scene, index) => (
                      <li key={scene.timing} className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-primary">
                            {scene.timing}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {scene.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="calendar-heading">
            <h2
              id="calendar-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              14-day calendar
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Day</th>
                    <th className="px-5 py-3 font-semibold">Channel</th>
                    <th className="px-5 py-3 font-semibold">Asset</th>
                    <th className="px-5 py-3 font-semibold">Goal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MARKETING_CALENDAR.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3 font-medium text-foreground">
                        {item.day}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {item.channel}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {item.asset}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {item.goal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {value}
      </dd>
    </div>
  );
}
