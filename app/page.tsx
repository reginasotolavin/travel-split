import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Highlights } from '@/components/highlights'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-16 pb-16 md:gap-24 md:pb-24">
        <div className="bg-gradient-to-b from-teal-50/80 via-background to-background [&>section]:max-w-7xl [&>section]:gap-14 [&>section]:py-20 [&>section]:md:gap-16 [&>section]:md:py-28 [&>section>div:last-child]:min-h-[400px] [&>section>div:last-child]:md:min-h-[640px] [&>section>div:last-child>div]:h-full [&>section>div:last-child>div]:rounded-[2rem] [&>section>div:last-child>div]:shadow-xl [&>section>div:last-child>div]:shadow-teal-950/10 [&>section>div:last-child>div>img]:!h-[400px] [&>section>div:last-child>div>img]:md:!h-[640px] [&_button]:!h-12 [&_button]:!rounded-xl [&_button]:!bg-teal-800 [&_button]:!px-7 [&_button]:!text-base [&_button]:!text-white [&_button]:shadow-md [&_button]:transition-all [&_button]:hover:!bg-teal-900 [&_button]:hover:shadow-lg">
          <Hero />
        </div>
        <div className="border-y border-teal-100 bg-teal-50/30 [&>section]:py-20 [&>section]:md:py-28 [&>section>ul>li]:!rounded-3xl [&>section>ul>li]:!border-teal-100 [&>section>ul>li]:!bg-teal-50 [&>section>ul>li]:!p-7 [&>section>ul>li]:shadow-sm [&>section>ul>li]:transition-all [&>section>ul>li]:hover:!border-teal-300 [&>section>ul>li]:hover:shadow-md [&>section>ul>li>span]:!rounded-2xl [&>section>ul>li>span]:!bg-teal-100 [&>section>ul>li>span]:!text-teal-800">
          <Highlights />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
