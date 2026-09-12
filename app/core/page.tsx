import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CoreWorkspace } from '@/components/core-workspace'

export const metadata = {
  title: 'Core — Travel Split',
  description: 'Shape the first version of your group trip with Travel Split Core.',
}

export default function CorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <CoreWorkspace />
      </main>
      <SiteFooter />
    </div>
  )
}