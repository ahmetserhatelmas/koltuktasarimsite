import { createClient } from "@/lib/supabase/server"
import { getLocale } from "@/lib/i18n/server"
import { getDict } from "@/lib/i18n/dict"
import { ProductCard } from "@/components/ui/ProductCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import type { CatalogProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""

  const locale = await getLocale()
  const t = getDict(locale)

  let products: CatalogProduct[] = []

  if (query.length >= 2) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("products")
      .select("id, name, image_url, price, old_price, quote_only, translations")
      .ilike("name", `%${query}%`)
      .eq("is_active", true)
      .order("sort_order")
      .limit(48)

    products = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image_url ?? "",
      price: p.price ?? 0,
      oldPrice: p.old_price ?? 0,
      quoteOnly: p.quote_only,
      translations: (p.translations as Record<string, { name?: string }>) ?? {},
    }))
  }

  const searchLabel =
    locale === "en" ? "Search" :
    locale === "ru" ? "Поиск" :
    locale === "ar" ? "البحث" :
    "Arama"

  const resultsLabel =
    locale === "en" ? `${products.length} result${products.length !== 1 ? "s" : ""} for "${query}"` :
    locale === "ru" ? `${products.length} результатов для "${query}"` :
    locale === "ar" ? `${products.length} نتيجة لـ "${query}"` :
    `"${query}" için ${products.length} sonuç`

  const noResultLabel =
    locale === "en" ? `No results found for "${query}". Try a different keyword.` :
    locale === "ru" ? `По запросу "${query}" ничего не найдено.` :
    locale === "ar" ? `لم يتم العثور على نتائج لـ "${query}".` :
    `"${query}" için sonuç bulunamadı. Farklı bir kelime deneyin.`

  const emptyQueryLabel =
    locale === "en" ? "Enter at least 2 characters to search." :
    locale === "ru" ? "Введите не менее 2 символов для поиска." :
    locale === "ar" ? "أدخل حرفين على الأقل للبحث." :
    "Arama yapmak için en az 2 karakter girin."

  return (
    <main className="flex-1 bg-[var(--surface)]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: t.breadcrumb.home, href: "/" },
              { label: searchLabel },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-[var(--accent)] sm:text-3xl">
          {searchLabel}
        </h1>

        {query.length < 2 ? (
          <p className="mt-4 text-sm text-zinc-500">{emptyQueryLabel}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-zinc-500">{resultsLabel}</p>

            {products.length === 0 ? (
              <div className="mt-12 text-center">
                <svg viewBox="0 0 24 24" className="mx-auto mb-4 h-12 w-12 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-zinc-500">{noResultLabel}</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
