import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
      <div className="flex flex-col items-start gap-6 text-left">
        <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          For groups of friends who travel
        </span>
        <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Your whole trip, one place.
        </h1>
        <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Travel Split keeps your group&apos;s plans, expenses, reservations, and
          important travel information organized together — so everyone stays on
          the same page from takeoff to touchdown.
        </p>

        <div className="flex flex-col items-start gap-2">
          <Button
            size="lg"
            aria-label="Start planning your trip with Travel Split"
            className="w-full text-base font-semibold hover:bg-primary/90 sm:w-auto"
          >
            Start planning
          </Button>
          <p className="text-sm text-muted-foreground">
            Plan together. Travel easier.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
          <Image
            src="/friends-traveling.png"
            alt="A group of friends enjoying a scenic overlook together while traveling"
            width={800}
            height={800}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
