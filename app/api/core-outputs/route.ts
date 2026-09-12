import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type CoreOutput = {
  id: string
  created_at: string
  destination: string
  travelers: number
  duration: string
  budget: string
  interests: string
  trip_summary: string
  priorities: string[]
  first_steps: string[]
}

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

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({ outputs: [], configured: false })
  }

  const { data, error } = await supabase
    .from('core_outputs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const outputs = (data ?? []).map((output) => ({
    ...output,
    priorities: normalizeList(output.priorities),
    first_steps: normalizeList(output.first_steps),
  }))

  return NextResponse.json({ outputs: outputs as CoreOutput[], configured: true })
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Add the server environment variables to save results.' },
      { status: 503 },
    )
  }

  const body = await request.json()
  const requiredFields = [
    'destination',
    'travelers',
    'duration',
    'budget',
    'interests',
    'trip_summary',
    'priorities',
    'first_steps',
  ]

  if (requiredFields.some((field) => body[field] === undefined || body[field] === '')) {
    return NextResponse.json({ error: 'All Trip Starter fields are required.' }, { status: 400 })
  }

  const priorities = normalizeList(body.priorities)
  const firstSteps = normalizeList(body.first_steps)

  const { data, error } = await supabase
    .from('core_outputs')
    .insert({
      destination: body.destination,
      travelers: body.travelers,
      duration: body.duration,
      budget: body.budget,
      interests: body.interests,
      trip_summary: body.trip_summary,
      priorities,
      first_steps: firstSteps,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    output: {
      ...data,
      priorities: normalizeList(data.priorities),
      first_steps: normalizeList(data.first_steps),
    } as CoreOutput,
  }, { status: 201 })
}