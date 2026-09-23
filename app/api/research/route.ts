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
      .from('research_records')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to reach Supabase.' }, { status: 503 })
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
      { error: 'Supabase is not configured. Add the server environment variables to save research.' },
      { status: 503 },
    )
  }

  const body = await request.json()
  if (!body.title || !body.research_data) {
    return NextResponse.json({ error: 'Research title and data are required.' }, { status: 400 })
  }

  const researchData = body.research_data

  let result
  try {
    result = await supabase
      .from('research_records')
      .insert({
        title: body.title,
        name: body.title,
        type: 'market_research_snapshot',
        key_features: researchData.competitors ?? [],
        gaps: researchData.risks ?? [],
        examples: researchData.examples ?? [],
        mexico_context: researchData.mexico ?? [],
        risks: researchData.risks ?? [],
        insights: researchData.insights ?? [],
        research_data: researchData,
      })
      .select()
      .single()
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to reach Supabase.' }, { status: 503 })
  }

  const { data, error } = result

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 })
  }

  return NextResponse.json({ record: data }, { status: 201 })
}
