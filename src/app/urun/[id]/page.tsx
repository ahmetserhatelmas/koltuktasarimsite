import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ProductGallery } from "@/components/ui/ProductGallery"
import { discountPercent, formatTry } from "@/lib/format"
import { createClient } from "@/lib/supabase/server"
import { SITE_NAME, whatsappQuoteUrl } from "@/lib/site-data"
import { CATEGORY_ROUTES } from "@/lib/supabase/types"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, price, quote_only")
    .eq("id", id)
    .single()

  if (!product) return { title: "Ürün bulunamadı" }

  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: `${product.name} — ${product.quote_only ? "Teklif alın" : formatTry(product.price)}`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!product) notFound()

  const quote = product.quote_only
  const discount = quote ? 0 : discountPercent(product.old_price, product.price)
  const categoryRoute = CATEGORY_ROUTES[product.category as keyof typeof CATEGORY_ROUTES] ?? "/"

  return (
    <main className="flex-1 bg-[var(--surface)] pb-16 pt-4 sm:pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Anasayfa", href: "/" },
              { label: "Ürünler", href: categoryRoute },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Görsel + başlık */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <ProductGallery
            mainImage={product.image_url ?? ""}
            galleryImages={product.gallery_images ?? []}
            productName={product.name}
          />

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-snug text-zinc-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Ürün kodu: {product.id.toUpperCase()}
            </p>

            {product.description_intro && (
              <p className="mt-5 text-sm leading-relaxed text-zinc-600">
                {product.description_intro}
              </p>
            )}

            {/* Renkler */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Renk
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c: { name: string; hex: string }, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1.5 pl-1.5 pr-3.5 shadow-sm">
                      <span
                        className="h-6 w-6 rounded-full border border-zinc-300 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-sm font-medium text-zinc-700">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-zinc-200 pt-8">
              {quote ? (
                <p className="text-xl font-bold text-zinc-900">
                  Fiyat bilgisi için teklif alın
                </p>
              ) : (
                <div className="flex flex-wrap items-end gap-4">
                  {discount > 0 && (
                    <span className="bg-zinc-900 px-3 py-2 text-xs font-bold uppercase text-white">
                      %{discount} indirim
                    </span>
                  )}
                  <div>
                    {product.old_price > 0 && (
                      <p className="text-sm text-zinc-400 line-through">
                        {formatTry(product.old_price)}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-zinc-900 sm:text-4xl">
                      {formatTry(product.price)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {quote ? (
              <a
                href={whatsappQuoteUrl(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 w-full max-w-sm items-center justify-center gap-2.5 bg-[#25D366] text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#1ebe5d] sm:w-auto sm:px-10"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.107 1.523 5.83L.057 24l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.722.976.995-3.63-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
                WhatsApp&apos;tan Teklif Al
              </a>
            ) : (
              <Link
                href="/#firsat"
                className="mt-8 inline-flex h-12 w-full max-w-sm items-center justify-center bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 sm:w-auto sm:px-10"
              >
                Sepete ekle
              </Link>
            )}

            <Link
              href={categoryRoute}
              className="mt-4 text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
            >
              ← Geri dön
            </Link>
          </div>
        </div>

        {/* Ürün Özellikleri */}
        {(product.description_specs?.length > 0 ||
          product.description_bullets?.length > 0 ||
          product.description_footer) && (
          <div className="mt-12 border-t border-zinc-200 pt-10">
            <h2 className="text-lg font-bold uppercase tracking-wide text-zinc-900">
              Ürün Özellikleri
            </h2>

            {product.description_specs?.length > 0 && (
              <div className="mt-6 overflow-hidden border border-zinc-200">
                <table className="w-full text-sm">
                  <tbody>
                    {product.description_specs.map(
                      (s: { label: string; value: string }, i: number) => (
                        <tr
                          key={s.label}
                          className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}
                        >
                          <td className="w-40 border-r border-zinc-200 px-4 py-3 font-semibold text-zinc-700 sm:w-52">
                            {s.label}
                          </td>
                          <td className="px-4 py-3 text-zinc-600">{s.value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {product.description_bullets?.length > 0 && (
              <ul className="mt-6 space-y-2">
                {product.description_bullets.map((b: string) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-zinc-600"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {product.description_footer && (
              <p className="mt-6 text-sm font-medium text-zinc-700">
                {product.description_footer}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
