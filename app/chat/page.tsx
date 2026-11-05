"use client";

import { useState, type FormEvent } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  checkGuardrail,
  GUARDRAIL_REPLIES,
  parseBudget,
  parseGroupSize,
  templateTips,
  type ChatBudget,
} from "@/lib/chat-rules";

type Message = {
  role: "assistant" | "user";
  content: string;
  tips?: string[];
  simulated?: boolean;
};

type IntakeStep =
  | "destination"
  | "groupSize"
  | "budget"
  | "confirmation"
  | "done";

const welcomeMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm the Travel Split trip assistant. I'll ask 3 quick questions, then give you tips for your group trip.",
  },
  { role: "assistant", content: "Where are you going?" },
];

function formatBudget(budget: ChatBudget): string {
  return budget === "not sure"
    ? "not sure"
    : new Intl.NumberFormat("en-US").format(budget);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(welcomeMessages);
  const [step, setStep] = useState<IntakeStep>("destination");
  const [input, setInput] = useState("");
  const [destination, setDestination] = useState("");
  const [groupSize, setGroupSize] = useState<number | null>(null);
  const [budget, setBudget] = useState<ChatBudget | null>(null);
  const [guardrailTriggered, setGuardrailTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState("");

  function addAssistantMessage(content: string) {
    setMessages((current) => [...current, { role: "assistant", content }]);
  }

  async function requestAssistant(followUp?: string) {
    if (groupSize === null || budget === null) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripSummary: { destination, groupSize, budget },
          ...(followUp ? { followUp } : {}),
        }),
        signal: AbortSignal.timeout(25_000),
      });
      if (!response.ok) {
        throw new Error(`Chat API returned status ${response.status}.`);
      }

      const result: unknown = await response.json();
      if (
        !result ||
        typeof result !== "object" ||
        !("answer" in result) ||
        typeof result.answer !== "string" ||
        !result.answer.trim()
      ) {
        throw new Error("Chat API returned an invalid answer.");
      }
      addAssistantMessage(result.answer.trim().replace(/\*/g, ""));
    } catch (error) {
      console.error("Chat request failed; showing the simulated response.", error);
      setMessages((current) => [
        ...current,
        followUp
          ? {
              role: "assistant",
              content:
                "I can't answer that right now. Try asking about your trip plan.",
              simulated: true,
            }
          : {
              role: "assistant",
              content: "",
              tips: templateTips(destination, groupSize, budget),
              simulated: true,
            },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    const guardrail = checkGuardrail(text);
    if (guardrail) {
      setGuardrailTriggered(true);
      setInput("");
      addAssistantMessage(GUARDRAIL_REPLIES[guardrail]);
      return;
    }

    setInput("");
    setMessages((current) => [...current, { role: "user", content: text }]);

    if (step === "done") {
      void requestAssistant(text);
      return;
    }

    if (step === "destination") {
      setDestination(text);
      setStep("groupSize");
      addAssistantMessage("How many people are in your group?");
      return;
    }

    if (step === "groupSize") {
      const parsedGroupSize = parseGroupSize(text);
      if (parsedGroupSize === null) {
        addAssistantMessage(
          "Please enter a whole number from 2 to 50. How many people are in your group?",
        );
        return;
      }

      setGroupSize(parsedGroupSize);
      setStep("budget");
      addAssistantMessage(
        "What's your budget per person, in MXN? (You can say 'not sure'.)",
      );
      return;
    }

    if (step === "budget") {
      const parsedBudget = parseBudget(text);
      if (parsedBudget === null) {
        addAssistantMessage(
          "Please enter a budget in MXN, or say 'not sure'. What's your budget per person, in MXN? (You can say 'not sure'.)",
        );
        return;
      }

      setBudget(parsedBudget);
      setStep("confirmation");
      const people = groupSize ?? 0;
      addAssistantMessage(
        `${destination}, ${people} people, about ${
          parsedBudget === "not sure"
            ? "not sure"
            : `$${formatBudget(parsedBudget)} MXN`
        } each. Is this right?`,
      );
    }
  }

  function restartIntake() {
    setDestination("");
    setGroupSize(null);
    setBudget(null);
    setStep("destination");
    setMessages((current) => [
      ...current,
      { role: "user", content: "Edit" },
      { role: "assistant", content: "Let's start over. Where are you going?" },
    ]);
  }

  function showTips() {
    if (groupSize === null || budget === null) return;
    setMessages((current) => [
      ...current,
      { role: "user", content: "Yes, show my tips" },
    ]);
    setStep("done");
    void requestAssistant();
  }

  async function submitRating(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === null || groupSize === null || budget === null) return;

    setIsSubmittingRating(true);
    setRatingError("");
    try {
      const response = await fetch("/api/chat-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          groupSize,
          budget: budget === "not sure" ? budget : String(budget),
          messageCount: messages.filter((message) => message.role === "user").length,
          guardrailTriggered,
          usedFallback: messages.some((message) => message.simulated),
          rating,
          comment,
        }),
      });

      const result: unknown = await response.json();
      if (!response.ok) {
        const errorMessage =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to save your feedback.";
        throw new Error(errorMessage);
      }

      setRatingSubmitted(true);
      setIsRating(false);
    } catch (error) {
      setRatingError(
        error instanceof Error
          ? error.message
          : "Unable to save your feedback. Please try again.",
      );
    } finally {
      setIsSubmittingRating(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-6 pb-16">
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 py-12 md:py-16">
          <div className="w-full text-center">
            <p className="mb-3 text-sm font-medium text-teal-800">
              Week 5 · Trip assistant
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Plan your group trip with the assistant.
            </h1>
          </div>

          <div className="w-full rounded-3xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6">
            <div
              aria-live="polite"
              aria-label="Trip assistant conversation"
              className="flex max-h-[28rem] min-h-72 flex-col gap-4 overflow-y-auto p-1"
            >
              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-teal-800 text-white"
                        : "bg-teal-50 text-foreground"
                    } ${message.role === "assistant" ? "whitespace-pre-wrap" : ""}`}
                  >
                    {message.simulated && (
                      <p className="mb-2 text-xs text-muted-foreground">
                        Simulated answer
                      </p>
                    )}
                    {message.tips ? (
                      <ol className="list-inside list-decimal space-y-2">
                        {message.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ol>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[88%] rounded-2xl bg-teal-50 px-4 py-3 text-sm text-foreground"
                    role="status"
                    aria-live="polite"
                  >
                    Thinking about your trip...
                  </div>
                </div>
              )}
            </div>

            {step === "confirmation" && (
              <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  className="h-10 rounded-xl bg-teal-800 px-4 text-white hover:bg-teal-900"
                  onClick={showTips}
                  disabled={isLoading}
                >
                  Yes, show my tips
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl px-4"
                  onClick={restartIntake}
                >
                  Edit
                </Button>
              </div>
            )}

            {step === "done" && !ratingSubmitted && (
              <div className="mt-4 border-t border-border pt-4">
                {!isRating ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl px-4"
                    onClick={() => setIsRating(true)}
                    disabled={isLoading}
                  >
                    Finish and rate
                  </Button>
                ) : (
                  <form className="space-y-4" onSubmit={submitRating}>
                    <fieldset>
                      <legend className="mb-2 text-sm font-medium">
                        How was your experience?
                      </legend>
                      <div className="flex gap-2" role="group" aria-label="Rating from 1 to 5 stars">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            aria-label={`${value} star${value === 1 ? "" : "s"}`}
                            aria-pressed={rating === value}
                            className={`rounded-md px-1 text-2xl transition-colors ${
                              rating !== null && value <= rating
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }`}
                            onClick={() => setRating(value)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <label className="block text-sm font-medium" htmlFor="chat-rating-comment">
                      Comment (optional)
                      <textarea
                        id="chat-rating-comment"
                        className="mt-2 min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-normal outline-none transition focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/20"
                        maxLength={1000}
                        onChange={(event) => setComment(event.target.value)}
                        value={comment}
                      />
                    </label>
                    {ratingError && (
                      <p className="text-sm text-destructive" role="alert">
                        {ratingError}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="h-10 rounded-xl bg-teal-800 px-4 text-white hover:bg-teal-900"
                        disabled={rating === null || isSubmittingRating}
                      >
                        {isSubmittingRating ? "Submitting..." : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl px-4"
                        onClick={() => setIsRating(false)}
                        disabled={isSubmittingRating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {ratingSubmitted && (
              <p className="mt-4 border-t border-border pt-4 text-sm text-teal-800" role="status">
                Thanks for your feedback
              </p>
            )}

            {step !== "confirmation" && (
              <form
                className="mt-4 flex gap-2 border-t border-border pt-4"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor="chat-input">
                  Your message
                </label>
                <input
                  id="chat-input"
                  autoComplete="off"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/20"
                  onChange={(event) => setInput(event.target.value)}
                  value={input}
                  disabled={isLoading}
                  placeholder={
                    step === "done"
                      ? "Ask a follow-up about your trip..."
                      : "Type your answer..."
                  }
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-teal-800 px-5 text-white hover:bg-teal-900"
                  disabled={isLoading}
                >
                  {isLoading ? "Thinking..." : "Send"}
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t share personal information (passports, card numbers,
            passwords).
          </p>
          {guardrailTriggered && (
            <span className="sr-only" aria-live="polite">
              A safety reminder was shown.
            </span>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
