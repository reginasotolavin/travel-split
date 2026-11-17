'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/logo'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Demo', href: '/demo' },
  { label: 'Core', href: '/core' },
  { label: 'Research', href: '/research' },
  { label: 'Product', href: '/product' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Marketing', href: '/marketing' },
  { label: 'Chat', href: '/chat' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Docs', href: '/docs' },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="mx-auto w-full max-w-6xl px-6 py-5">
      <div className="flex items-center justify-between gap-4">
        <Logo />

        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm sm:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>

        <nav className="hidden items-center gap-5 text-sm font-medium sm:flex sm:flex-wrap">
          <span className="hidden text-muted-foreground xl:inline">Your whole trip, one place.</span>
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? 'text-teal-700 underline decoration-2 underline-offset-4'
                    : 'text-primary underline-offset-4 hover:underline'
                }
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {menuOpen && (
        <nav className="mt-4 flex flex-col gap-2 rounded-2xl border border-border bg-background p-3 shadow-sm sm:hidden">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={
                  isActive
                    ? 'rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700'
                    : 'rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted'
                }
              >
                {label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
