import { Logo } from '@/components/logo'

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Logo />
      <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
        Your whole trip, one place.
      </span>
    </header>
  )
}
