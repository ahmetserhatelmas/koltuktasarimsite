"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function BrandStory() {
  const { t } = useI18n()
  return (
    <section className="border-t border-zinc-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold uppercase tracking-wide text-[var(--accent)] sm:text-2xl">
          {t.home.brand_title}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {t.home.brand_text}
        </p>
        <Link
          href="/iletisim"
          className="mt-6 inline-flex h-10 items-center border border-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
        >
          {t.nav.contact}
        </Link>
      </div>
    </section>
  )
}
