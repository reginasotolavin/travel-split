import { Compass } from 'lucide-react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Compass className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        Travel Split
      </span>
    </span>
  )
}
