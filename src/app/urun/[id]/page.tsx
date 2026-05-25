import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDescriptionForProduct } from "@/lib/descriptions";
import { discountPercent, formatTry } from "@/lib/format";
import { getAllProductIds, getProductById } from "@/lib/product-lookup";
import { isQuoteOnly } from "@/lib/products";
import { SITE_NAME } from "@/lib/site-data";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Ürün bulunamadı" };
  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: `${product.name} — ${isQuoteOnly(product) ? "Teklif alın" : formatTry(product.price)}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const quote = isQuoteOnly(product);
  const discount = quote ? 0 : discountPercent(product.oldPrice, product.price);
  const desc = getDescriptionForProduct(id);

  return (
    <main className="flex-1 bg-[var(--surface)] pb-16 pt-4 sm:pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Anasayfa", href: "/" },
              { label: "Ürünler", href: "/konferans-koltuklari" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Görsel + başlık */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <div className="relative aspect-square w-full overflow-hidden border border-zinc-200 bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain object-center p-4"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-snug text-zinc-900 sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-sm text-zinc-500">Ürün kodu: {product.id.toUpperCase()}</p>

            {desc?.intro && (
              <p className="mt-5 text-sm leading-relaxed text-zinc-600">{desc.intro}</p>
            )}

            <div className="mt-8 border-t border-zinc-200 pt-8">
              {quote ? (
                <p className="text-xl font-bold text-zinc-900">Fiyat bilgisi için teklif alın</p>
              ) : (
                <div className="flex flex-wrap items-end gap-4">
                  {discount > 0 && (
                    <span className="bg-zinc-900 px-3 py-2 text-xs font-bold uppercase text-white">
                      %{discount} indirim
                    </span>
                  )}
                  <div>
                    <p className="text-sm text-zinc-400 line-through">{formatTry(product.oldPrice)}</p>
                    <p className="text-3xl font-bold text-zinc-900 sm:text-4xl">{formatTry(product.price)}</p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={quote ? "/iletisim" : "/#firsat"}
              className="mt-8 inline-flex h-12 w-full max-w-sm items-center justify-center bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 sm:w-auto sm:px-10"
            >
              {quote ? "Teklif alın" : "Sepete ekle"}
            </Link>

            <Link
              href="/"
              className="mt-4 text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
            >
              ← Geri dön
            </Link>
          </div>
        </div>

        {/* Açıklama bölümü */}
        {desc && (desc.specs || desc.bullets || desc.footer) && (
          <div className="mt-12 border-t border-zinc-200 pt-10">
            <h2 className="text-lg font-bold uppercase tracking-wide text-zinc-900">Ürün Özellikleri</h2>

            {/* Teknik tablo */}
            {desc.specs && desc.specs.length > 0 && (
              <div className="mt-6 overflow-hidden border border-zinc-200">
                <table className="w-full text-sm">
                  <tbody>
                    {desc.specs.map((s, i) => (
                      <tr key={s.label} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
                        <td className="w-40 border-r border-zinc-200 px-4 py-3 font-semibold text-zinc-700 sm:w-52">
                          {s.label}
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Madde listesi */}
            {desc.bullets && desc.bullets.length > 0 && (
              <ul className="mt-6 space-y-2">
                {desc.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {desc.footer && (
              <p className="mt-6 text-sm font-medium text-zinc-700">{desc.footer}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
