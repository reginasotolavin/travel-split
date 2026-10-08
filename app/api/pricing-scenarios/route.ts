import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({ records: [], configured: false })
  }

  let result
  try {
    result = await supabase
      .from('pricing_scenarios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reach Supabase.' },
      { status: 503 },
    )
  }

  const { data, error } = result

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 })
  }

  return NextResponse.json({ records: data ?? [], configured: true })
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Add the server environment variables to save pricing scenarios.' },
      { status: 503 },
    )
  }

  const body = await request.json()
  if (!body.name || !body.scenario) {
    return NextResponse.json({ error: 'Scenario name and scenario are required.' }, { status: 400 })
  }

  const payload = {
    name: body.name,
    scenario: body.scenario,
    university_users: body.university_users ?? null,
    organizer_users: body.organizer_users ?? null,
    annual_share: body.annual_share ?? null,
    conversion_rate: body.conversion_rate ?? null,
    monthly_revenue: body.monthly_revenue ?? null,
    annual_revenue: body.annual_revenue ?? null,
  }

  let result
  try {
    result = await supabase.from('pricing_scenarios').insert(payload).select().single()
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reach Supabase.' },
      { status: 503 },
    )
  }

  const { data, error } = result

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 })
  }

  return NextResponse.json({ record: data }, { status: 201 })
}
