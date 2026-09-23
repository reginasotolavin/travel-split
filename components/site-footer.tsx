import { Logo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Travel Split. Your whole trip, one place.
        </p>
      </div>
    </footer>
  )
}
