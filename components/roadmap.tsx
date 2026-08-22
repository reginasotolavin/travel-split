const stages = [
  {
    stage: 'Now',
    title: 'Homepage and project setup',
    description: 'The foundation is live — the homepage and core project structure.',
  },
  {
    stage: 'Next',
    title: 'Trip planning and shared expenses',
    description: 'Create trips, invite friends, and split costs together.',
  },
  {
    stage: 'Later',
    title: 'Reservations and travel information',
    description: 'Keep bookings and key travel details organized in one place.',
  },
]

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-12 md:py-16"
    >
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Project Roadmap
        </h2>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Where Travel Split is today and where it&apos;s headed next.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stages.map((item) => (
          <li
            key={item.stage}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left"
          >
            <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 font-display text-sm font-semibold text-accent-foreground">
              {item.stage}
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
