import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Feedback is required." }, { status: 400 });
  }

  const feedback = body as Record<string, unknown>;
  const {
    destination,
    groupSize,
    budget,
    messageCount,
    guardrailTriggered,
    usedFallback,
    rating,
    comment,
  } = feedback;

  if (
    typeof destination !== "string" ||
    !destination.trim() ||
    destination.trim().length > 200 ||
    !Number.isInteger(groupSize) ||
    (groupSize as number) < 2 ||
    (groupSize as number) > 50 ||
    typeof budget !== "string" ||
    !budget.trim() ||
    budget.length > 50 ||
    !Number.isInteger(messageCount) ||
    (messageCount as number) < 0 ||
    typeof guardrailTriggered !== "boolean" ||
    typeof usedFallback !== "boolean" ||
    !Number.isInteger(rating) ||
    (rating as number) < 1 ||
    (rating as number) > 5 ||
    (comment !== undefined &&
      comment !== null &&
      (typeof comment !== "string" || comment.length > 1000))
  ) {
    return NextResponse.json(
      { error: "Feedback fields are invalid." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add the server environment variables to save feedback." },
      { status: 503 },
    );
  }

  const payload = {
    destination: destination.trim(),
    group_size: groupSize,
    budget: budget.trim(),
    message_count: messageCount,
    guardrail_triggered: guardrailTriggered,
    used_fallback: usedFallback,
    rating,
    comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
  };

  let result;
  try {
    result = await supabase.from("chat_tests").insert(payload).select("id").single();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save feedback." },
      { status: 503 },
    );
  }

  const { data, error } = result;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  return NextResponse.json(
    { message: "Thanks for your feedback", id: data.id },
    { status: 201 },
  );
}
