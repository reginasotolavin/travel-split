'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, CircleAlert, Database, Search, ShieldAlert, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Example = { name: string; description: string }
type Competitor = { name: string; type: 'Competitor' | 'Substitute'; features: string; gaps: string }
type Risk = { label: string; level: 'High' | 'Medium'; detail: string }
type ResearchData = {
  examples: Example[]
  mexico: string[]
  competitors: Competitor[]
  risks: Risk[]
  insights: { label: string; value: string; detail: string }[]
}
type SavedResearch = { id: string; created_at: string; title: string; research_data: ResearchData }

const researchData: ResearchData = {
  examples: [
    { name: 'Splitwise', description: 'Shared expense tracking with balances, IOUs, and settlement reminders for groups.' },
    { name: 'TripIt', description: 'Reservation inbox that turns travel confirmations into a centralized itinerary.' },
    { name: 'Wanderlog', description: 'Collaborative itinerary builder combining places, maps, reservations, and planning notes.' },
    { name: 'Sygic Travel', description: 'Destination planning with attractions, route ideas, and offline travel guidance.' },
    { name: 'Roadtrippers', description: 'Road-trip discovery and routing with stops, lodging, and practical trip details.' },
  ],
  mexico: [
    'WhatsApp is the default coordination layer for many groups, so Travel Split must earn its place by reducing chat clutter rather than replacing it overnight.',
    'Mexico combines strong domestic travel demand with cross-border and family travel, creating a broad but varied early audience.',
    'MXN budgets, bank transfer and cash habits, bilingual content, and uneven connectivity should shape the first useful workflows.',
  ],
  competitors: [
    { name: 'Splitwise', type: 'Competitor', features: 'Shared expenses, balances, settlements', gaps: 'Weak itinerary and reservation context' },
    { name: 'TripIt', type: 'Competitor', features: 'Reservation import, itinerary, alerts', gaps: 'No group decisions or expense coordination' },
    { name: 'Wanderlog', type: 'Competitor', features: 'Collaborative plans, maps, reservations', gaps: 'Expense workflow is not central' },
    { name: 'Tricount', type: 'Competitor', features: 'Simple group expense splitting', gaps: 'Limited trip planning and shared memory' },
    { name: 'Google Sheets', type: 'Substitute', features: 'Flexible budgets, lists, custom templates', gaps: 'Manual setup and poor mobile group experience' },
    { name: 'WhatsApp groups', type: 'Substitute', features: 'Fast chat, media, polls, voice notes', gaps: 'Information gets buried; no source of truth' },
    { name: 'Notion', type: 'Substitute', features: 'Flexible pages, databases, collaboration', gaps: 'High setup cost for casual travelers' },
    { name: 'Shared notes', type: 'Substitute', features: 'Quick lists and links on a phone', gaps: 'No structured ownership, budget, or itinerary view' },
  ],
  risks: [
    { label: 'Competition', level: 'High', detail: 'Established tools already own expenses, reservations, or chat.' },
    { label: 'Low differentiation', level: 'High', detail: 'A broad “all-in-one trip app” can sound like a bundle of familiar features.' },
    { label: 'Adoption risk', level: 'High', detail: 'One organizer may do the work while the rest of the group stays in chat.' },
    { label: 'Trust and privacy', level: 'Medium', detail: 'Travel plans and money details need clear controls and dependable handling.' },
    { label: 'Monetization', level: 'Medium', detail: 'Casual groups may resist subscriptions unless value arrives before payment.' },
  ],
  insights: [
    { label: 'Opportunity', value: 'Group context', detail: 'Connect decisions, plans, and costs around one trip.' },
    { label: 'Beachhead', value: 'Mexico groups', detail: 'Localize for WhatsApp-first, MXN-aware planning.' },
    { label: 'Proof point', value: 'Shared source of truth', detail: 'Make the group organizer’s work visibly lighter.' },
    { label: 'Watch closely', value: 'Activation', detail: 'Measure whether invitees contribute, not just sign up.' },
  ],
}

function formatSavedDate(createdAt: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(createdAt))
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function ResearchWorkspace() {
  const [query, setQuery] = useState('')
  const [savedRecords, setSavedRecords] = useState<SavedResearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/research')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load saved research.')
        setSavedRecords(Array.isArray(data.records) ? data.records : [])
        if (!data.configured) setMessage('Connect Supabase to save and revisit research snapshots.')
      })
      .catch(() => setMessage('Saved research is unavailable right now.'))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredCompetitors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return researchData.competitors
    return researchData.competitors.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery))
  }, [query])

  const keyRisks = researchData.risks.filter((risk) => ['Competition', 'Low differentiation', 'Adoption risk'].includes(risk.label))

  async function handleSave() {
    setIsSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Travel Split market research', research_data: researchData }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save this research.')
      setSavedRecords((current) => [data.record, ...current].slice(0, 8))
      setSaved(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save this research.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Week 2 · Market research
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">Find the opening in the group trip.</h1>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">A working snapshot of the products, substitutes, and risks Travel Split needs to understand before building deeper.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <span className="font-display font-semibold text-foreground">5</span> global examples <span className="mx-2 text-border">·</span> <span className="font-display font-semibold text-foreground">8</span> alternatives
          </div>
          <Button type="button" onClick={handleSave} disabled={isSaving || saved} variant={saved ? 'secondary' : 'default'} className="gap-2">
            {isSaving ? <Database className="h-4 w-4 animate-pulse" aria-hidden="true" /> : saved ? <Check className="h-4 w-4" aria-hidden="true" /> : <Database className="h-4 w-4" aria-hidden="true" />}
            {saved ? 'Saved' : 'Save Research'}
          </Button>
        </div>
      </div>

      {message && <p role="status" className="mb-8 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{message}</p>}

      <section className="mb-16">
        <SectionHeading eyebrow="Dashboard snapshot" title="What the research says at a glance" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {researchData.insights.map((insight) => (
            <article key={insight.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{insight.label}</p>
              <h3 className="mt-3 font-display text-lg font-semibold text-card-foreground">{insight.value}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{insight.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading eyebrow="Global scan" title="Five products worth learning from" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {researchData.examples.map((example, index) => (
            <article key={example.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm last:lg:col-span-1">
              <p className="font-display text-sm font-semibold text-primary">0{index + 1}</p>
              <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">{example.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{example.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-primary/20 bg-secondary/45 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Mexico localization</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Meet the market where it plans.</h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {researchData.mexico.map((note) => <li key={note} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />{note}</li>)}
          </ul>
        </div>
        <div>
          <SectionHeading eyebrow="Risk map" title="Where the idea can get stuck" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {keyRisks.map((risk) => (
              <article key={risk.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">{risk.label}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive">
                    <CircleAlert className="h-3 w-3" aria-hidden="true" />{risk.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{risk.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading eyebrow="Competitive landscape" title="Competitors and substitutes">
          <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search competitors by name</span>
            <input aria-label="Search competitors by name" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
        </SectionHeading>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table aria-label="Competitive landscape" className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">Name</th>
                <th scope="col" className="px-5 py-4 font-medium">Type</th>
                <th scope="col" className="px-5 py-4 font-medium">Key features</th>
                <th scope="col" className="px-5 py-4 font-medium">Gaps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCompetitors.map((entry) => <tr key={entry.name} className="align-top"><td className="px-5 py-4 font-display font-semibold text-card-foreground">{entry.name}</td><td className="px-5 py-4"><span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{entry.type}</span></td><td className="px-5 py-4 leading-relaxed text-muted-foreground">{entry.features}</td><td className="px-5 py-4 leading-relaxed text-muted-foreground">{entry.gaps}</td></tr>)}
            </tbody>
          </table>
          {filteredCompetitors.length === 0 && <p className="p-6 text-sm text-muted-foreground">No matching alternatives found.</p>}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Showing {filteredCompetitors.length} of {researchData.competitors.length} entries.</p>
      </section>

      <section className="border-t border-border pt-10">
        <SectionHeading eyebrow="Saved snapshots" title="Saved Research">
          <span className="text-sm text-muted-foreground">{savedRecords.length} saved</span>
        </SectionHeading>
        {isLoading ? <p className="mt-6 text-sm text-muted-foreground">Loading saved research...</p> : savedRecords.length === 0 ? <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Saved research snapshots will show up here after you save one.</p> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{savedRecords.map((record) => <article key={record.id} className="rounded-xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">{formatSavedDate(record.created_at)}</p><h3 className="mt-2 font-display font-semibold text-card-foreground">{record.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{record.research_data.competitors.length} alternatives mapped across {record.research_data.risks.length} market risks.</p></article>)}</div>}
      </section>

      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"><ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />Research is a directional snapshot, not live market data.</div>
    </section>
  )
}
