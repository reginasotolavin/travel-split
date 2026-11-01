import { SiteHeader } from '@/components/site-header'
import { Highlights } from '@/components/highlights'
import { SiteFooter } from '@/components/site-footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-16 pb-16 md:gap-24 md:pb-24">
        <div className="bg-gradient-to-b from-teal-50/80 via-background to-background [&>section]:max-w-7xl [&>section]:gap-14 [&>section]:py-20 [&>section]:md:gap-16 [&>section]:md:py-28 [&>section>div:last-child]:min-h-[400px] [&>section>div:last-child]:md:min-h-[640px] [&>section>div:last-child>div]:h-full [&>section>div:last-child>div]:rounded-[2rem] [&>section>div:last-child>div]:shadow-xl [&>section>div:last-child>div]:shadow-teal-950/10 [&>section>div:last-child>div>img]:!h-[400px] [&>section>div:last-child>div>img]:md:!h-[640px] [&_button]:!h-12 [&_button]:!rounded-xl [&_button]:!bg-teal-800 [&_button]:!px-7 [&_button]:!text-base [&_button]:!text-white [&_button]:shadow-md [&_button]:transition-all [&_button]:hover:!bg-teal-900 [&_button]:hover:shadow-lg">
          <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
            <div className="flex flex-col items-start gap-6 text-left">
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                For groups of friends who travel
              </span>
              <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Stop organizing group trips in the chat.
              </h1>
              <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Travel Split keeps your group&apos;s plans, expenses, reservations, and
                important travel information organized together — so everyone stays on
                the same page from takeoff to touchdown.
              </p>

              <div className="flex flex-col items-start gap-2">
                <Button size="lg" className="w-full sm:w-auto">
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
        </div>
        <div className="border-y border-teal-100 bg-teal-50/30 [&>section]:py-20 [&>section]:md:py-28 [&>section>ul>li]:!rounded-3xl [&>section>ul>li]:!border-teal-100 [&>section>ul>li]:!bg-teal-50 [&>section>ul>li]:!p-7 [&>section>ul>li]:shadow-sm [&>section>ul>li]:transition-all [&>section>ul>li]:hover:!border-teal-300 [&>section>ul>li]:hover:shadow-md [&>section>ul>li>span]:!rounded-2xl [&>section>ul>li>span]:!bg-teal-100 [&>section>ul>li>span]:!text-teal-800">
          <Highlights />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
