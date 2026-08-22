import Link from 'next/link'
import { Logo } from '@/components/logo'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Roadmap', href: '/#how-it-works' },
  { label: 'Docs', href: '/docs' },
]

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/" aria-label="Travel Split home">
        <Logo />
      </Link>
      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-5 sm:gap-7">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
