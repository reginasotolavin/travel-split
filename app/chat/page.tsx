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

  function addAssistantMessage(content: string) {
    setMessages((current) => [...current, { role: "assistant", content }]);
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
      {
        role: "assistant",
        content: "",
        tips: templateTips(destination, groupSize, budget),
        simulated: true,
      },
    ]);
    setStep("done");
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
                    }`}
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
            </div>

            {step === "confirmation" && (
              <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  className="h-10 rounded-xl bg-teal-800 px-4 text-white hover:bg-teal-900"
                  onClick={showTips}
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

            {step !== "confirmation" && step !== "done" && (
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
                  placeholder="Type your answer..."
                  value={input}
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-teal-800 px-5 text-white hover:bg-teal-900"
                >
                  Send
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
