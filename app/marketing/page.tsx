"use client";

import { useEffect, useState } from "react";
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

type SavedAsset = {
  id: string;
  created_at: string;
  asset_id: string;
  asset_type: string;
  title: string;
  content: string;
};

const exportOrder = [
  "Brand system",
  "Persona",
  "Landing copy",
  "Social posts",
  "Video scripts",
  "14-day calendar",
] as const;

export default function MarketingPage() {
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({});
  const [savedAssets, setSavedAssets] = useState<SavedAsset[]>([]);
  const [saveState, setSaveState] = useState<Record<string, { status: "idle" | "success" | "error"; message: string }>>({});

  async function loadSavedAssets() {
    try {
      const response = await fetch("/api/marketing-assets");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load saved assets.");
      }
      setSavedAssets(Array.isArray(data.records) ? data.records : []);
    } catch {
      setSavedAssets([]);
    }
  }

  useEffect(() => {
    void loadSavedAssets();
  }, []);

  const setCopied = (id: string) => {
    setCopiedIds((current) => ({ ...current, [id]: true }));
    window.setTimeout(() => {
      setCopiedIds((current) => ({ ...current, [id]: false }));
    }, 2000);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(id);
    }
  };

  const handleExportAll = () => {
    const content = buildExportText();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "travel-split-marketing.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleSaveAsset = async (asset: {
    asset_id: string;
    asset_type: string;
    title: string;
    content: string;
  }) => {
    try {
      const response = await fetch("/api/marketing-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save this asset.");
      }

      setSaveState((current) => ({
        ...current,
        [asset.asset_id]: { status: "success", message: "Saved" },
      }));
      await loadSavedAssets();
    } catch (error) {
      setSaveState((current) => ({
        ...current,
        [asset.asset_id]: {
          status: "error",
          message: error instanceof Error ? error.message : "Unable to save this asset.",
        },
      }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
          <header className="mb-12 max-w-4xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Week 4 · Marketing engine
              </span>
              <button
                type="button"
                onClick={handleExportAll}
                className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Export all
              </button>
            </div>
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
              <InfoCard
                id="brand-system-name"
                label="Name"
                value={BRAND_SYSTEM.name}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-name"])}
              />
              <InfoCard
                id="brand-system-tagline"
                label="Tagline"
                value={BRAND_SYSTEM.tagline}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-tagline"])}
              />
              <InfoCard
                id="brand-system-voice"
                label="Voice"
                value={BRAND_SYSTEM.voice.description}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-voice"])}
              />
              <InfoCard
                id="brand-system-do"
                label="Do"
                value={BRAND_SYSTEM.voice.do.join(" ")}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-do"])}
              />
              <InfoCard
                id="brand-system-dont"
                label="Don't"
                value={BRAND_SYSTEM.voice.dont.join(" ")}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-dont"])}
              />
              <InfoCard
                id="brand-system-colors"
                label="Colors"
                value={BRAND_SYSTEM.colors}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-colors"])}
              />
              <InfoCard
                id="brand-system-type-and-logo"
                label="Type and logo"
                value={BRAND_SYSTEM.typeAndLogo}
                onCopy={handleCopy}
                copied={Boolean(copiedIds["brand-system-type-and-logo"])}
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
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {PERSONA.name}, {PERSONA.age} (fictional)
                </h3>
                <button
                  type="button"
                  onClick={() => handleCopy("persona-full", buildPersonaText())}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
                >
                  {copiedIds["persona-full"] ? "Copied" : "Copy"}
                </button>
              </div>
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
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Landing copy
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy("landing-copy-full", buildLandingCopyText())}
                    className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
                  >
                    {copiedIds["landing-copy-full"] ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveAsset({
                        asset_id: "landing-copy-full",
                        asset_type: "landing-copy",
                        title: "Landing copy",
                        content: buildLandingCopyText(),
                      })
                    }
                    className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              </div>
              {saveState["landing-copy-full"] ? (
                <p
                  className={`mt-3 text-xs ${
                    saveState["landing-copy-full"].status === "success"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {saveState["landing-copy-full"].message}
                </p>
              ) : null}
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
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
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {post.channel}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(post.id, buildPostText(post))}
                        className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
                      >
                        {copiedIds[post.id] ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveAsset({
                            asset_id: post.id,
                            asset_type: "post",
                            title: post.hook,
                            content: buildPostText(post),
                          })
                        }
                        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  {saveState[post.id] ? (
                    <p
                      className={`mt-3 text-xs ${
                        saveState[post.id].status === "success"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {saveState[post.id].message}
                    </p>
                  ) : null}
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
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {script.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(script.id, buildScriptText(script))}
                        className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
                      >
                        {copiedIds[script.id] ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveAsset({
                            asset_id: script.id,
                            asset_type: "script",
                            title: script.title,
                            content: buildScriptText(script),
                          })
                        }
                        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  {saveState[script.id] ? (
                    <p
                      className={`mt-3 text-xs ${
                        saveState[script.id].status === "success"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {saveState[script.id].message}
                    </p>
                  ) : null}
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

          <section className="mt-14" aria-labelledby="saved-assets-heading">
            <h2
              id="saved-assets-heading"
              className="mb-5 font-display text-2xl font-semibold text-foreground"
            >
              Saved assets
            </h2>
            {savedAssets.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                No saved assets yet
              </p>
            ) : (
              <ul className="space-y-3">
                {savedAssets.map((asset) => (
                  <li
                    key={asset.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{asset.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.asset_type} · {new Date(asset.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({
  id,
  label,
  value,
  onCopy,
  copied,
}: {
  id: string;
  label: string;
  value: string;
  onCopy: (id: string, text: string) => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <button
          type="button"
          onClick={() => onCopy(id, `${label}: ${value}`)}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
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

function buildPersonaText() {
  return [
    `Name: ${PERSONA.name}`,
    `Age: ${PERSONA.age}`,
    `Who: ${PERSONA.who}`,
    `Pain: ${PERSONA.pain}`,
    `Goal: ${PERSONA.goal}`,
    `Where she is: ${PERSONA.whereSheIs}`,
    `What she needs to hear: ${PERSONA.whatSheNeedsToHear}`,
    `Objection: ${PERSONA.objection}`,
  ].join("\n");
}

function buildLandingCopyText() {
  return [
    `Headline: ${LANDING_COPY.headline}`,
    `Subheadline: ${LANDING_COPY.subheadline}`,
    `Benefits: ${LANDING_COPY.benefits.join("; ")}`,
    `CTA: ${LANDING_COPY.cta}`,
    `Honesty line: ${LANDING_COPY.honestyLine}`,
  ].join("\n");
}

function buildPostText(post: (typeof SOCIAL_POSTS)[number]) {
  return [
    `${post.channel}`,
    `${post.hook}`,
    `${post.caption}`,
    `${post.cta}`,
  ].join("\n");
}

function buildScriptText(script: (typeof VIDEO_SCRIPTS)[number]) {
  return [
    `${script.title}`,
    ...script.scenes.map(
      (scene) => `${scene.timing}: ${scene.text}`,
    ),
  ].join("\n");
}

function buildExportText() {
  const sections = [
    "Brand system",
    `Name: ${BRAND_SYSTEM.name}`,
    `Tagline: ${BRAND_SYSTEM.tagline}`,
    `Voice: ${BRAND_SYSTEM.voice.description}`,
    `Do: ${BRAND_SYSTEM.voice.do.join("; ")}`,
    `Don't: ${BRAND_SYSTEM.voice.dont.join("; ")}`,
    `Colors: ${BRAND_SYSTEM.colors}`,
    `Type and logo: ${BRAND_SYSTEM.typeAndLogo}`,
    "",
    "Persona",
    `Name: ${PERSONA.name}`,
    `Age: ${PERSONA.age}`,
    `Who: ${PERSONA.who}`,
    `Pain: ${PERSONA.pain}`,
    `Goal: ${PERSONA.goal}`,
    `Where she is: ${PERSONA.whereSheIs}`,
    `What she needs to hear: ${PERSONA.whatSheNeedsToHear}`,
    `Objection: ${PERSONA.objection}`,
    "",
    "Landing copy",
    buildLandingCopyText(),
    "",
    "Social posts",
    ...SOCIAL_POSTS.flatMap((post) => [
      `${post.id} | ${post.channel}`,
      `${post.hook}`,
      `${post.caption}`,
      `${post.cta}`,
      "",
    ]),
    "Video scripts",
    ...VIDEO_SCRIPTS.flatMap((script) => [
      `${script.id} | ${script.title}`,
      ...script.scenes.map((scene) => `${scene.timing}: ${scene.text}`),
      "",
    ]),
    "14-day calendar",
    ...MARKETING_CALENDAR.map(
      (day) => `${day.id} | Day ${day.day} | ${day.channel} | ${day.asset} | ${day.goal}`,
    ),
  ];

  return sections.join("\n");
}
