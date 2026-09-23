import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ResearchWorkspace } from '@/components/research-workspace'

export const metadata = {
  title: 'Research — Travel Split',
  description: 'Validate the Travel Split opportunity across global and Mexican travel markets.',
}

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <ResearchWorkspace />
      </main>
      <SiteFooter />
    </div>
  )
}
