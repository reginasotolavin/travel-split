import { Logo } from '@/components/logo'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Logo />
      <nav className="flex items-center gap-5 text-sm font-medium">
        <span className="hidden text-muted-foreground sm:inline">
          Your whole trip, one place.
        </span>
        <Link className="text-primary underline-offset-4 hover:underline" href="/core">
          Core
        </Link>
      </nav>
    </header>
  )
}
