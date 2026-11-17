import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { summarizeChatTests } from '@/lib/dashboard'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function logReadFailure(table: string, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string'
        ? error.message
        : 'Unknown Supabase error.'

  console.error(`[dashboard] Failed to read ${table}: ${message}`)
}

async function countTableRows(table: string) {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error(`[dashboard] Failed to read ${table}: Supabase server client is not configured.`)
    return null
  }

  try {
    const { data, error } = await supabase.from(table).select('*')

    if (error) {
      logReadFailure(table, error)
      return null
    }

    return data?.length ?? 0
  } catch (error) {
    logReadFailure(table, error)
    return null
  }
}

async function loadAbVoteCounts() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('[dashboard] Failed to read ab_votes: Supabase server client is not configured.')
    return null
  }

  try {
    const { data, error } = await supabase.from('ab_votes').select('test_id, variant')

    if (error) {
      logReadFailure('ab_votes', error)
      return null
    }

    const counts = {
      headline: { A: 0, B: 0 },
      button: { A: 0, B: 0 },
    }

    for (const row of data) {
      const testId = row.test_id as 'headline' | 'button' | undefined
      const variant = row.variant as 'A' | 'B' | undefined
      if (testId && variant && testId in counts) {
        counts[testId][variant] += 1
      }
    }

    return counts
  } catch (error) {
    logReadFailure('ab_votes', error)
    return null
  }
}

async function loadAssistantTestSummary() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('[dashboard] Failed to read chat_tests: Supabase server client is not configured.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('chat_tests')
      .select('rating, guardrail_triggered, used_fallback')

    if (error) {
      logReadFailure('chat_tests', error)
      return null
    }

    return summarizeChatTests((data ?? []) as Array<{
      rating?: number | null
      guardrail_triggered?: boolean | null
      used_fallback?: boolean | null
    }>)
  } catch (error) {
    logReadFailure('chat_tests', error)
    return null
  }
}

export default async function DashboardPage() {
  const [coreOutputs, researchRecords, pricingScenarios, marketingAssets, abVotes, assistantTests] =
    await Promise.all([
      countTableRows('core_outputs'),
      countTableRows('research_records'),
      countTableRows('pricing_scenarios'),
      countTableRows('marketing_assets'),
      loadAbVoteCounts(),
      loadAssistantTestSummary(),
    ])

  const updatedAt = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Mexico_City',
    hour: 'numeric',
    minute: '2-digit',
  })

  const cards = [
    {
      title: 'Trip starters',
      value: coreOutputs === null ? 'Not available' : String(coreOutputs),
      detail: 'Saved trip-start plans',
    },
    {
      title: 'Research snapshots',
      value: researchRecords === null ? 'Not available' : String(researchRecords),
      detail: 'Saved market notes',
    },
    {
      title: 'Pricing scenarios',
      value: pricingScenarios === null ? 'Not available' : String(pricingScenarios),
      detail: 'Saved pricing runs',
    },
    {
      title: 'Marketing assets',
      value: marketingAssets === null ? 'Not available' : String(marketingAssets),
      detail: 'Saved campaign assets',
    },
    {
      title: 'A/B tests',
      value:
        abVotes === null
          ? 'Not available'
          : `Headline A ${abVotes.headline.A} / B ${abVotes.headline.B} · Button A ${abVotes.button.A} / B ${abVotes.button.B}`,
      detail: 'Headline and button tests',
    },
    {
      title: 'Assistant tests',
      value:
        assistantTests === null
          ? 'Not available'
          : `${assistantTests.count} total · Avg ${assistantTests.averageRating ?? 'n/a'} · Guardrail ${assistantTests.guardrailPercent}% · Fallback ${assistantTests.fallbackPercent}%`,
      detail: 'Chat-test summary',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-6 py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Week 6 · Dashboard
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                What Travel Split has saved.
              </h1>
            </div>
            <div className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm text-teal-800">
              Updated just now · {updatedAt}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-teal-950/5"
              >
                <p className="mb-3 text-sm font-medium text-muted-foreground">{card.title}</p>
                <div className="text-2xl font-bold text-foreground md:text-3xl">{card.value}</div>
                <p className="mt-3 text-sm text-muted-foreground">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
