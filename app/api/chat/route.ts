import { NextResponse } from "next/server";
import {
  checkGuardrail,
  GUARDRAIL_REPLIES,
  type ChatBudget,
} from "@/lib/chat-rules";

type TripSummary = {
  destination: string;
  groupSize: number;
  budget: ChatBudget;
};

const SYSTEM_INSTRUCTIONS = `You are the Travel Split trip assistant. Only help with planning group trips and with questions about Travel Split. For the first answer, give exactly 5 short tips tailored to the destination, group size, and budget in MXN. Keep every answer under 120 words. Never ask for personal data. Refuse visa, health, and legal advice and point to official sources. Travel Split today has Trip Starter, saving trip starters, pricing plans, and this assistant; expense splitting, reservations, and a day-by-day itinerary are planned, not built.`;

function isTripSummary(value: unknown): value is TripSummary {
  if (!value || typeof value !== "object") return false;
  const summary = value as Record<string, unknown>;

  return (
    typeof summary.destination === "string" &&
    summary.destination.trim().length > 0 &&
    summary.destination.length <= 200 &&
    Number.isInteger(summary.groupSize) &&
    (summary.groupSize as number) >= 2 &&
    (summary.groupSize as number) <= 50 &&
    ((typeof summary.budget === "number" &&
      Number.isFinite(summary.budget) &&
      summary.budget >= 0) ||
      summary.budget === "not sure")
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A trip summary is required." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  if (!isTripSummary(payload.tripSummary)) {
    return NextResponse.json({ error: "A valid trip summary is required." }, { status: 400 });
  }

  const followUp = payload.followUp;
  if (
    followUp !== undefined &&
    (typeof followUp !== "string" || !followUp.trim() || followUp.length > 1000)
  ) {
    return NextResponse.json({ error: "The follow-up question is invalid." }, { status: 400 });
  }

  if (typeof followUp === "string") {
    const guardrail = checkGuardrail(followUp);
    if (guardrail) {
      return NextResponse.json({ answer: GUARDRAIL_REPLIES[guardrail] });
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The chat assistant is not configured." }, { status: 503 });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const summary = payload.tripSummary;
  const userPrompt = [
    `Trip summary: destination ${summary.destination}; group size ${summary.groupSize}; budget ${
      summary.budget === "not sure" ? "not sure" : `${summary.budget} MXN per person`
    }.`,
    typeof followUp === "string"
      ? `Follow-up question: ${followUp.trim()}`
      : "This is the first answer. Give exactly 5 short trip-planning tips.",
  ].join("\n");

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.6 },
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json({ error: "The chat assistant timed out." }, { status: 504 });
    }
    console.error(
      `Gemini API request could not be completed: ${
        error instanceof Error ? error.message : "Unknown network error."
      }`,
    );
    return NextResponse.json({ error: "Unable to reach the chat assistant." }, { status: 502 });
  }

  if (!response.ok) {
    let errorMessage = response.statusText || "Unknown Gemini API error.";
    try {
      const errorBody: unknown = await response.json();
      if (
        errorBody &&
        typeof errorBody === "object" &&
        "error" in errorBody &&
        errorBody.error &&
        typeof errorBody.error === "object" &&
        "message" in errorBody.error &&
        typeof errorBody.error.message === "string"
      ) {
        errorMessage = errorBody.error.message;
      }
    } catch {
      errorMessage = response.statusText || "Gemini returned a non-JSON error.";
    }

    console.error(
      `Gemini API returned HTTP ${response.status}: ${errorMessage
        .replaceAll(apiKey, "[redacted]")
        .slice(0, 1000)}`,
    );
    return NextResponse.json({ error: "The chat assistant request failed." }, { status: 502 });
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    return NextResponse.json({ error: "The chat assistant returned an invalid response." }, { status: 502 });
  }

  const answer = (
    result as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    }
  ).candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!answer) {
    return NextResponse.json({ error: "The chat assistant returned an empty response." }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
