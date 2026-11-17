export type ChatTestRow = {
  rating?: number | null
  guardrail_triggered?: boolean | null
  used_fallback?: boolean | null
}

export function summarizeChatTests(rows: Array<ChatTestRow | null | undefined>) {
  const validRows = rows.filter((row): row is ChatTestRow => Boolean(row))
  const count = validRows.length

  const ratings = validRows
    .map((row) => row.rating)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))

  const averageRating = ratings.length
    ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
    : null

  const guardrailPercent = count
    ? Math.round(
        (validRows.filter((row) => row.guardrail_triggered === true).length / count) * 100,
      )
    : 0

  const fallbackPercent = count
    ? Math.round((validRows.filter((row) => row.used_fallback === true).length / count) * 100)
    : 0

  return {
    count,
    averageRating,
    guardrailPercent,
    fallbackPercent,
  }
}
