'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Check, Compass, LoaderCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FormValues = {
  destination: string
  travelers: string
  duration: string
  budget: string
  interests: string
}

type TripStarter = {
  destination: string
  travelers: number
  duration: string
  budget: string
  interests: string
  trip_summary: string
  priorities: string[]
  first_steps: string[]
}

type SavedOutput = TripStarter & { id: string; created_at: string }

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value !== 'string' || !value.trim()) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : [value]
  } catch {
    return [value]
  }
}

const initialValues: FormValues = {
  destination: '',
  travelers: '4',
  duration: '5 days',
  budget: '$1,000-$1,500 per person',
  interests: '',
}

function generateTripStarter(values: FormValues): TripStarter {
  const destination = values.destination.trim()
  const interests = values.interests.trim() || 'local food, easy-going exploring, and time together'
  const travelers = Number(values.travelers)

  return {
    destination,
    travelers,
    duration: values.duration,
    budget: values.budget,
    interests,
    trip_summary: `A ${values.duration} group trip to ${destination} for ${travelers} travelers, shaped around ${interests}. The first pass keeps the plan flexible while giving everyone a clear place to start.`,
    priorities: [
      `Choose a shared home base in ${destination} that keeps the group close to the things you care about.`,
      `Protect room in the budget for the experiences that matter most to the group.`,
      'Agree on the trip rhythm before filling in the calendar: anchor plans, open time, and one group check-in.',
    ],
    first_steps: [
      `Ask everyone to add one must-do in ${destination} and one thing they would happily skip.`,
      "Shortlist two neighborhoods or areas that fit the group's pace and budget.",
      'Pick a 20-minute planning window to make the first shared decisions together.',
    ],
  }
}

function validateForm(values: FormValues) {
  if (!values.destination.trim() || !values.duration.trim() || !values.budget.trim() || !values.interests.trim()) {
    return 'Please complete all fields before generating your Trip Starter.'
  }

  const travelers = Number(values.travelers)
  if (!Number.isInteger(travelers) || travelers < 1) {
    return 'Please enter a whole number of travelers greater than 0.'
  }

  return ''
}

function formatSavedDate(createdAt: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(createdAt))
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  invalid = false,
}: {
  label: string
  name: keyof FormValues
  value: string
  onChange: (name: keyof FormValues, value: string) => void
  placeholder: string
  type?: string
  invalid?: boolean
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        aria-required="true"
        aria-invalid={invalid}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
      />
    </label>
  )
}

function SavedOutputCard({ output }: { output: SavedOutput }) {
  const priorities = normalizeList(output.priorities)
  const firstSteps = normalizeList(output.first_steps)

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{formatSavedDate(output.created_at)}</p>
      <h3 className="mt-2 font-display text-lg font-semibold text-card-foreground">{output.destination}</h3>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Travelers</dt>
          <dd className="mt-1 text-card-foreground">{output.travelers}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Duration</dt>
          <dd className="mt-1 text-card-foreground">{output.duration}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Budget</dt>
          <dd className="mt-1 text-card-foreground">{output.budget}</dd>
        </div>
      </dl>
      <div className="mt-5 space-y-5 border-t border-border pt-5">
        <section>
          <h4 className="font-display text-sm font-semibold text-card-foreground">Interests</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{output.interests}</p>
        </section>
        <section>
          <h4 className="font-display text-sm font-semibold text-card-foreground">Trip Summary</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{output.trip_summary}</p>
        </section>
        <section>
          <h4 className="font-display text-sm font-semibold text-card-foreground">Priorities</h4>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {priorities.map((priority) => <li key={priority} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{priority}</li>)}
          </ul>
        </section>
        <section>
          <h4 className="font-display text-sm font-semibold text-card-foreground">First Steps</h4>
          <ol className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {firstSteps.map((step, index) => <li key={step} className="flex gap-2"><span className="font-display font-semibold text-primary">0{index + 1}</span>{step}</li>)}
          </ol>
        </section>
      </div>
    </article>
  )
}

export function CoreWorkspace() {
  const [values, setValues] = useState(initialValues)
  const [starter, setStarter] = useState<TripStarter | null>(null)
  const [savedOutputs, setSavedOutputs] = useState<SavedOutput[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSaved, setIsLoadingSaved] = useState(true)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    fetch('/api/core-outputs')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load saved outputs.')
        setSavedOutputs(Array.isArray(data.outputs) ? data.outputs : [])
        if (!data.configured) setMessage('Connect Supabase to save and revisit your Trip Starters.')
      })
      .catch(() => setMessage('Saved outputs are unavailable right now.'))
      .finally(() => setIsLoadingSaved(false))
  }, [])

  function updateValue(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setSaved(false)
    setValidationMessage('')
  }

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const error = validateForm(values)
    if (error) {
      setValidationMessage(error)
      return
    }

    setStarter(generateTripStarter(values))
    setSaved(false)
    setMessage('')
    setValidationMessage('')
  }

  async function handleSave() {
    if (!starter) return
    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/core-outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(starter),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save this Trip Starter.')
      setSavedOutputs((current) => [data.output, ...current].slice(0, 8))
      setSaved(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save this Trip Starter.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
      <div className="mb-12 max-w-2xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Week 1 · Generative Core
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Give the group a place to begin.
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Add the few things you already know. Core turns them into a shared first draft your group can react to.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
        <form onSubmit={handleGenerate} className="flex h-fit flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
          <div className="mb-1 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-card-foreground">Start with the basics</h2>
              <p className="text-sm text-muted-foreground">You can change everything later.</p>
            </div>
          </div>
          <Field label="Destination" name="destination" value={values.destination} onChange={updateValue} placeholder="Lisbon, Portugal" invalid={Boolean(validationMessage && !values.destination.trim())} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Travelers" name="travelers" value={values.travelers} onChange={updateValue} placeholder="4" type="number" invalid={Boolean(validationMessage && (!Number.isInteger(Number(values.travelers)) || Number(values.travelers) < 1))} />
            <Field label="Trip duration" name="duration" value={values.duration} onChange={updateValue} placeholder="5 days" invalid={Boolean(validationMessage && !values.duration.trim())} />
          </div>
          <Field label="Budget" name="budget" value={values.budget} onChange={updateValue} placeholder="$1,000 per person" invalid={Boolean(validationMessage && !values.budget.trim())} />
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Travel style / interests
            <textarea
              name="interests"
              value={values.interests}
              onChange={(event) => updateValue('interests', event.target.value)}
              placeholder="Local food, beaches, live music, slow mornings..."
              aria-required="true"
              aria-invalid={Boolean(validationMessage && !values.interests.trim())}
              rows={4}
              className="resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </label>
          {validationMessage && <p role="alert" className="text-sm text-destructive">{validationMessage}</p>}
          <Button type="submit" size="lg" className="mt-1 w-full gap-2">
            Generate Trip Starter
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        <div className="min-w-0">
          {starter ? (
            <article className="overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-sm">
              <div className="border-b border-border bg-secondary/45 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Trip Starter</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-card-foreground">{starter.destination}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{starter.travelers} travelers · {starter.duration} · {starter.budget}</p>
              </div>
              <div className="space-y-7 p-6 md:p-8">
                <section>
                  <h3 className="font-display text-base font-semibold text-card-foreground">Trip Summary</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{starter.trip_summary}</p>
                </section>
                <section>
                  <h3 className="font-display text-base font-semibold text-card-foreground">Priorities</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {normalizeList(starter.priorities).map((priority) => <li key={priority} className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />{priority}</li>)}
                  </ul>
                </section>
                <section>
                  <h3 className="font-display text-base font-semibold text-card-foreground">Suggested First Steps</h3>
                  <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {normalizeList(starter.first_steps).map((step, index) => <li key={step} className="flex gap-3"><span className="font-display font-semibold text-primary">0{index + 1}</span>{step}</li>)}
                  </ol>
                </section>
                <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
                  <Button type="button" onClick={handleSave} disabled={isSaving || saved} variant={saved ? 'secondary' : 'default'} className="gap-2">
                    {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : saved ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                    {saved ? 'Saved' : 'Save Result'}
                  </Button>
                  {message && <p className="text-sm text-muted-foreground">{message}</p>}
                </div>
              </div>
            </article>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
              <h2 className="mt-5 font-display text-xl font-semibold text-foreground">Your starter will appear here</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">The group&apos;s first shared direction, in three useful sections.</p>
            </div>
          )}
        </div>
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Your dashboard preview</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Saved Outputs</h2>
          </div>
          <span className="text-sm text-muted-foreground">{savedOutputs.length} saved</span>
        </div>
        {isLoadingSaved ? <p className="mt-6 text-sm text-muted-foreground">Loading saved starters...</p> : savedOutputs.length === 0 ? <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Saved Trip Starters will show up here after you save one.</p> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{savedOutputs.map((output) => <SavedOutputCard key={output.id} output={output} />)}</div>}
      </section>
    </section>
  )
}