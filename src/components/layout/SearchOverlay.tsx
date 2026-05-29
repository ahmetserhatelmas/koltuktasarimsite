"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { productDetailHref } from "@/lib/product-lookup"
import { formatTry } from "@/lib/format"
import { useI18n } from "@/lib/i18n/context"

type Result = {
  id: string
  name: string
  image_url: string | null
  price: number | null
  old_price: number | null
  quote_only: boolean
  category: string
  translations?: Record<string, { name?: string }>
}

const CATEGORY_ROUTES: Record<string, string> = {
  "konferans-sandalyeleri": "/konferans-sandalyeleri",
  "konferans-koltuklari": "/konferans-koltuklari",
  bar: "/bar-taburesi",
  stadyum: "/stadyum",
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setQuery("")
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  // ESC ile kapat
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("products")
      .select("id, name, image_url, price, old_price, quote_only, category, translations")
      .ilike("name", `%${q.trim()}%`)
      .eq("is_active", true)
      .limit(6)
    setResults((data ?? []) as Result[])
    setLoading(false)
  }, [])

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => { void search(query) }, 300)
    return () => clearTimeout(t)
  }, [query, search])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    onClose()
    router.push(`/arama?q=${encodeURIComponent(query.trim())}`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Kapat"
      />

      {/* Panel */}
      <div className="relative z-10 w-full bg-white shadow-2xl">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "en" ? "Search products..." : locale === "ru" ? "Поиск товаров..." : locale === "ar" ? "البحث عن المنتجات..." : "Ürün ara..."}
            className="flex-1 bg-transparent py-2 text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]) }} className="text-zinc-400 hover:text-zinc-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900"
          >
            {locale === "en" ? "Close" : locale === "ru" ? "Закрыть" : locale === "ar" ? "إغلاق" : "Kapat"}
          </button>
        </form>

        {/* Sonuçlar */}
        {query.trim().length >= 2 && (
          <div className="mx-auto max-w-3xl border-t border-zinc-100 px-4 pb-4 sm:px-6">
            {loading ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                {locale === "en" ? "Searching..." : locale === "ru" ? "Поиск..." : locale === "ar" ? "جاري البحث..." : "Aranıyor..."}
              </p>
            ) : results.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                {locale === "en" ? `No results for "${query}"` : locale === "ru" ? `Нет результатов для "${query}"` : locale === "ar" ? `لا نتائج لـ "${query}"` : `"${query}" için sonuç bulunamadı`}
              </p>
            ) : (
              <>
                <ul className="divide-y divide-zinc-100">
                  {results.map((r) => {
                    const trans = locale !== "tr" ? r.translations?.[locale] : undefined
                    const name = trans?.name || r.name
                    return (
                      <li key={r.id}>
                        <Link
                          href={productDetailHref(r.id)}
                          onClick={onClose}
                          className="flex items-center gap-4 py-3 transition hover:bg-zinc-50"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-zinc-100">
                            {r.image_url ? (
                              <Image src={r.image_url} alt={name} fill className="object-contain p-1" sizes="56px" />
                            ) : (
                              <div className="h-full w-full bg-zinc-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-900">{name}</p>
                            <p className="text-xs text-zinc-400 capitalize">
                              {(t.category as Record<string, string>)[r.category] || r.category}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            {r.quote_only ? (
                              <span className="text-xs font-bold text-zinc-900">{t.product.price_quote}</span>
                            ) : (
                              <span className="text-sm font-bold text-zinc-900">{formatTry(r.price ?? 0)}</span>
                            )}
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <Link
                  href={`/arama?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="mt-2 block text-center text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                >
                  {locale === "en" ? "See all results →" : locale === "ru" ? "Все результаты →" : locale === "ar" ? "عرض كل النتائج ←" : "Tüm sonuçları gör →"}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
