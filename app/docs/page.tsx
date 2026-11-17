'use client'

import { useState } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { BUILD_LOG, PROMPT_LIBRARY } from '@/lib/docs-content'

export default function DocsPage() {
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied((current) => ({ ...current, [key]: true }))
      window.setTimeout(() => {
        setCopied((current) => ({ ...current, [key]: false }))
      }, 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied((current) => ({ ...current, [key]: true }))
      window.setTimeout(() => {
        setCopied((current) => ({ ...current, [key]: false }))
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:py-16">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
            Week 6 · Build docs
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How Travel Split was built.
          </h1>
        </div>

        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-semibold text-foreground">Build log</h2>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Module</th>
                    <th className="px-4 py-3 font-medium">Page</th>
                    <th className="px-4 py-3 font-medium">What shipped</th>
                    <th className="px-4 py-3 font-medium">Key fix found by testing</th>
                  </tr>
                </thead>
                <tbody>
                  {BUILD_LOG.map((row) => (
                    <tr key={row.module} className="border-t border-border align-top">
                      <td className="px-4 py-3 font-medium text-foreground">{row.module}</td>
                      <td className="px-4 py-3 text-foreground">{row.page}</td>
                      <td className="px-4 py-3 text-foreground">{row.whatShipped}</td>
                      <td className="px-4 py-3 text-foreground">{row.keyFix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-semibold text-foreground">Prompt library</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {PROMPT_LIBRARY.map((item, index) => {
              const key = `${item.module}-${index}`

              return (
                <article key={key} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                        {item.module}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">{item.goal}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.prompt, key)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {copied[key] ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="rounded-2xl bg-muted p-4 text-sm leading-6 text-foreground">
                    {item.prompt}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
