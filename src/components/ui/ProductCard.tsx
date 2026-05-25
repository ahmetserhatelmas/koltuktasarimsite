import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatTry } from "@/lib/format";
import { productDetailHref } from "@/lib/product-lookup";
import { isQuoteOnly, type CatalogProduct } from "@/lib/products";

export function ProductCard({
  product,
  className = "",
}: {
  product: CatalogProduct;
  className?: string;
}) {
  const quote = isQuoteOnly(product);
  const pct = quote ? 0 : discountPercent(product.oldPrice, product.price);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-sm border border-zinc-200 bg-white ${className}`}
    >
      <Link href={productDetailHref(product.id)} className="relative block aspect-[4/5] bg-white">
        {pct > 0 ? (
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            <span className="rounded-sm bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              %{pct} indirim
            </span>
            <span className="rounded-sm bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Ücretsiz kargo
            </span>
          </div>
        ) : null}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain object-center p-3 transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width:640px) 50vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col border-t border-zinc-100 px-3 pb-3 pt-3">
        <Link href={productDetailHref(product.id)} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">{product.name}</h3>
          <p className="mt-1 text-xs text-zinc-400">Kod: {product.id.toUpperCase()}</p>
          <p className="mt-2 text-sm text-zinc-500">
            {quote ? (
              <span className="font-bold text-zinc-900">Proje fiyatı — teklif alın</span>
            ) : (
              <>
                <span className="line-through">{formatTry(product.oldPrice)}</span>{" "}
                <span className="font-bold text-zinc-900">{formatTry(product.price)}</span>
              </>
            )}
          </p>
        </Link>
        <Link
          href={productDetailHref(product.id)}
          className="mt-3 flex h-10 w-full items-center justify-center bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
        >
          {quote ? "Teklif al" : "İncele"}
        </Link>
      </div>
    </article>
  );
}
