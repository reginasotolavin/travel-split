import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Documentation — Travel Split',
  description: 'Travel Split documentation is coming soon.',
}

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Travel Split Documentation
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Documentation coming soon.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
