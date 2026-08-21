const steps = [
  {
    step: '1',
    title: 'Plan your trip',
    description: 'Start a trip and gather your ideas, dates, and destinations.',
  },
  {
    step: '2',
    title: 'Organize together',
    description: 'Invite your friends and keep plans, bookings, and costs in sync.',
  },
  {
    step: '3',
    title: 'Travel stress-free',
    description: 'Head out knowing every detail lives in one shared place.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How it works
        </h2>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Three simple steps to go from scattered group chats to a smooth trip.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {steps.map((item) => (
          <li
            key={item.step}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary font-display text-lg font-semibold text-primary">
              {item.step}
            </span>
            <h3 className="font-display text-lg font-semibold text-card-foreground">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
