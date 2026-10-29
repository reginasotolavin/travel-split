import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ records: [], configured: false });
  }

  let result;
  try {
    result = await supabase
      .from("marketing_assets")
      .select("*")
      .order("created_at", { ascending: false });
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

  return NextResponse.json({ records: data ?? [], configured: true });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add the server environment variables to save assets." },
      { status: 503 },
    );
  }

  const body = await request.json();
  if (!body.asset_id || !body.asset_type || !body.title || !body.content) {
    return NextResponse.json(
      { error: "asset_id, asset_type, title, and content are required." },
      { status: 400 },
    );
  }

  const payload = {
    asset_id: body.asset_id,
    asset_type: body.asset_type,
    title: body.title,
    content: body.content,
  };

  let result;
  try {
    result = await supabase.from("marketing_assets").insert(payload).select().single();
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
