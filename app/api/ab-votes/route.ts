import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ counts: { headline: { A: 0, B: 0 }, button: { A: 0, B: 0 } }, configured: false });
  }

  let result;
  try {
    result = await supabase.from("ab_votes").select("test_id, variant");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reach Supabase." },
      { status: 503 },
    );
  }

  const { data, error } = result;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  const counts: {
    headline: { A: number; B: number };
    button: { A: number; B: number };
  } = {
    headline: { A: 0, B: 0 },
    button: { A: 0, B: 0 },
  };

  for (const row of data ?? []) {
    const testId = row.test_id as "headline" | "button" | undefined;
    const variant = row.variant as "A" | "B" | undefined;

    if (testId && variant && testId in counts) {
      counts[testId][variant] += 1;
    }
  }

  return NextResponse.json({ counts, configured: true });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add the server environment variables to save votes." },
      { status: 503 },
    );
  }

  const body = await request.json();
  if (!body.test_id || !body.variant) {
    return NextResponse.json({ error: "test_id and variant are required." }, { status: 400 });
  }

  if (!['headline', 'button'].includes(body.test_id)) {
    return NextResponse.json({ error: 'test_id must be either "headline" or "button".' }, { status: 400 });
  }

  if (!['A', 'B'].includes(body.variant)) {
    return NextResponse.json({ error: 'variant must be either "A" or "B".' }, { status: 400 });
  }

  const payload = {
    test_id: body.test_id,
    variant: body.variant,
  };

  let result;
  try {
    result = await supabase.from("ab_votes").insert(payload).select().single();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reach Supabase." },
      { status: 503 },
    );
  }

  const { data, error } = result;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  return NextResponse.json({ record: data }, { status: 201 });
}
