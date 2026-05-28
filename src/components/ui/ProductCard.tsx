import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatTry } from "@/lib/format";
import { productDetailHref } from "@/lib/product-lookup";
import { isQuoteOnly, type CatalogProduct } from "@/lib/products";
import { whatsappQuoteUrl } from "@/lib/site-data";

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
        {quote ? (
          <a
            href={whatsappQuoteUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.107 1.523 5.83L.057 24l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.722.976.995-3.63-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            Teklif Al
          </a>
        ) : (
          <Link
            href={productDetailHref(product.id)}
            className="mt-3 flex h-10 w-full items-center justify-center bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
          >
            İncele
          </Link>
        )}
      </div>
    </article>
  );
}
