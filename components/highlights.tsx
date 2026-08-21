import { Map, Wallet, CalendarCheck, Info } from 'lucide-react'

const items = [
  {
    icon: Map,
    title: 'Plans',
    description: 'Map out your days and keep every idea in one shared place.',
  },
  {
    icon: Wallet,
    title: 'Expenses',
    description: 'Track what the group spends so costs stay clear and fair.',
  },
  {
    icon: CalendarCheck,
    title: 'Reservations',
    description: 'Store flights, stays, and bookings where everyone can find them.',
  },
  {
    icon: Info,
    title: 'Travel info',
    description: 'Keep documents and important details handy for the whole crew.',
  },
]

export function Highlights() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Everything for the trip, together
        </h2>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Traveling with friends is more fun when nobody has to chase down the
          details. Travel Split brings it all into a single, shared home.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display text-lg font-semibold text-card-foreground">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
