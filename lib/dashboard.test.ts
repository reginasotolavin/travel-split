import { describe, expect, it } from 'vitest'
import { summarizeChatTests } from './dashboard'

describe('summarizeChatTests', () => {
  it('summarizes rating and guardrail/fallback percentages for the sample rows', () => {
    const summary = summarizeChatTests([
      { rating: 5, guardrail_triggered: false, used_fallback: false },
      { rating: 4, guardrail_triggered: true, used_fallback: false },
      { rating: null, guardrail_triggered: false, used_fallback: true },
      { rating: 3, guardrail_triggered: true, used_fallback: true },
    ])

    expect(summary).toEqual({
      count: 4,
      averageRating: 4.0,
      guardrailPercent: 50,
      fallbackPercent: 50,
    })
  })
})
