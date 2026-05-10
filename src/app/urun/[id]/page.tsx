import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatTry } from "@/lib/format";
import { getAllProductIds, getProductById } from "@/lib/product-lookup";
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
    description: `${product.name} — ${formatTry(product.price)}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const discount =
    product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <main className="flex-1 bg-white pb-16 pt-6 sm:pb-20 sm:pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-800">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-zinc-300">/</span>
          <span className="text-zinc-800">Ürün</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-zinc-100 bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain object-center p-2 sm:p-4 sm:scale-105"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="font-serif text-2xl leading-snug text-zinc-900 sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-sm text-zinc-500">Ürün kodu: {product.id}</p>

            <div className="mt-8 flex flex-wrap items-end gap-4 border-t border-zinc-100 pt-8">
              {discount > 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-center">
                  <p className="text-xs font-medium text-zinc-600">İndirim</p>
                  <p className="text-lg font-semibold text-zinc-900">%{discount}</p>
                </div>
              ) : null}
              <div>
                <p className="text-sm text-zinc-400 line-through">{formatTry(product.oldPrice)}</p>
                <p className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  {formatTry(product.price)}
                </p>
              </div>
            </div>

            <p className="mt-10 text-sm text-zinc-500">
              Demo sayfa — sepet ve sipariş akışı sonra eklenebilir.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex w-fit items-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              ← Alışverişe dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
