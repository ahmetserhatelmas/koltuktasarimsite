"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { LOCALES, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from "@/lib/i18n/types"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function pick(l: Locale) {
    setLocale(l)
    setOpen(false)
    // Sunucu bileşenlerinin yeni dille yeniden render edilmesi için
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-sm border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
        aria-label="Dil seç"
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-lg">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => pick(l)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs transition hover:bg-zinc-50 ${
                l === locale ? "bg-zinc-50 font-semibold text-zinc-900" : "text-zinc-700"
              }`}
            >
              <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
              {LOCALE_LABELS[l]}
              {l === locale && (
                <svg viewBox="0 0 24 24" className="ml-auto h-3.5 w-3.5 text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
