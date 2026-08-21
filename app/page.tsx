import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Highlights } from '@/components/highlights'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Highlights />
      </main>
      <SiteFooter />
    </div>
  )
}
