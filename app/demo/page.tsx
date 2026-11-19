'use client'

import { Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { DEMO_STEPS } from '@/lib/demo-steps'

const badgeStyles = {
  Built: 'bg-emerald-100 text-emerald-700',
  Simulated: 'bg-amber-100 text-amber-700',
  Planned: 'bg-slate-200 text-slate-700',
} as const

function DemoPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStepNumber = useMemo(() => {
    const rawValue = Number(searchParams.get('step') ?? '1')
    if (!Number.isFinite(rawValue) || rawValue < 1) {
      return 1
    }
    return Math.min(rawValue, DEMO_STEPS.length)
  }, [searchParams])

  const currentStep = DEMO_STEPS[currentStepNumber - 1]

  const changeStep = (nextStep: number) => {
    const safeStep = Math.min(Math.max(nextStep, 1), DEMO_STEPS.length)
    router.replace(`/demo?step=${safeStep}`, { scroll: false })
  }

  const renderCustomContent = () => {
    if (currentStep.kind === 'agent-map' && currentStep.agentMap) {
      return (
        <div className="space-y-6">
          {currentStep.agentMap.map((row) => (
            <div key={row.title} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{row.title}</h3>
              <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
                {row.boxes.map((box, index) => (
                  <div key={box.name} className="flex flex-col items-center gap-2 md:min-w-0 md:flex-1 md:flex-row">
                    <div className="w-full rounded-2xl border border-border bg-background p-4 shadow-sm md:min-h-full">
                      <div className="mb-2 text-sm font-semibold text-teal-700">{box.name}</div>
                      <p className="text-sm leading-6 text-muted-foreground">{box.line}</p>
                    </div>
                    {index < row.boxes.length - 1 && (
                      <>
                        <span aria-hidden="true" className="text-xl font-semibold text-teal-700 md:hidden">
                          ↓
                        </span>
                        <span aria-hidden="true" className="hidden text-xl font-semibold text-teal-700 md:inline">
                          →
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {row.sideBox && (
                <div className="mt-3 flex justify-center md:justify-end">
                  <div className="w-full rounded-2xl border border-dashed border-border bg-muted/50 p-4 shadow-sm md:max-w-xs">
                    <div className="mb-2 text-sm font-semibold text-teal-700">{row.sideBox.name}</div>
                    <p className="text-sm leading-6 text-muted-foreground">{row.sideBox.line}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    if (currentStep.kind === 'roadmap' && currentStep.roadmap) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {currentStep.roadmap.map((item) => (
            <div key={item.priority} className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                  {item.priority}
                </span>
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                  Planned
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mb-2 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">Why:</span> {item.why}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">Evidence:</span> {item.evidence}
              </p>
            </div>
          ))}
        </div>
      )
    }

    if (currentStep.kind === 'placeholder') {
      return (
        <div className="rounded-3xl border border-dashed border-border bg-muted/50 p-8 text-center text-lg font-medium text-muted-foreground">
          Coming next
        </div>
      )
    }

    return <p className="text-lg leading-8 text-foreground">{currentStep.text}</p>
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-6 py-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              Week 6 · Guided tour
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              See how Travel Split works.
            </h1>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg shadow-teal-950/5 md:p-8">
            <nav aria-label="Tour steps" className="mb-6 flex flex-wrap gap-2">
              {DEMO_STEPS.map((step) => {
                const stepLabel = step.page
                  ? step.page.slice(1).replace(/^\w/, (letter) => letter.toUpperCase())
                  : step.title

                return (
                  <button
                    key={step.id}
                    type="button"
                    aria-label={`Go to step ${step.id}: ${stepLabel}`}
                    aria-current={step.id === currentStepNumber ? 'step' : undefined}
                    onClick={() => changeStep(step.id)}
                    className={
                      step.id === currentStepNumber
                        ? 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal-700 bg-teal-700 text-sm font-semibold text-white'
                        : 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal-700 bg-background text-sm font-semibold text-teal-800 transition hover:bg-teal-50'
                    }
                  >
                    {step.id}
                  </button>
                )
              })}
            </nav>

            <div className="mb-6">
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all"
                  style={{ width: `${(currentStepNumber / DEMO_STEPS.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                <span>Step {currentStepNumber} of {DEMO_STEPS.length}</span>
                {currentStep.badge && (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[currentStep.badge]}`}>
                    {currentStep.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">{currentStep.title}</h2>

              {renderCustomContent()}

              {currentStep.page && (
                <div className="flex justify-start">
                  <a
                    href={currentStep.page}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 transition hover:bg-teal-100"
                  >
                    Open this page
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              {currentStepNumber > 1 ? (
                <button
                  type="button"
                  onClick={() => changeStep(currentStepNumber - 1)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => changeStep(currentStepNumber === DEMO_STEPS.length ? 1 : currentStepNumber + 1)}
                className="ml-auto rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-teal-800"
              >
                {currentStepNumber === DEMO_STEPS.length ? 'Start over' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1 px-6 py-10 md:py-16">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lg shadow-teal-950/5 md:p-8">
                <div className="mb-6">
                  <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/10 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Loading demo...</p>
                </div>
              </div>
            </div>
          </main>
          <SiteFooter />
        </div>
      }
    >
      <DemoPageContent />
    </Suspense>
  )
}
