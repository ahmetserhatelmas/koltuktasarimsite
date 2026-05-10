import Image from "next/image";
import Link from "next/link";
import { productDetailHref } from "@/lib/product-lookup";
import type { CatalogProduct } from "@/lib/products";

export function CategoryCircles({ items }: { items: CatalogProduct[] }) {
  return (
    <section className="border-b border-zinc-100 bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:gap-7 sm:pb-0 md:justify-center">
          {items.map((p) => (
            <Link
              key={p.id}
              href={productDetailHref(p.id)}
              className="group flex w-[118px] shrink-0 flex-col items-center text-center sm:w-[132px]"
            >
              {/* Dikey oval çerçeve: yuvarlak hatlar + sandalyenin uzun görünmesi */}
              <div className="relative aspect-[3/4] w-full max-w-[118px] overflow-hidden rounded-[9999px] border border-zinc-100 bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md sm:max-w-[132px]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain object-center scale-[1.12] p-1 sm:scale-[1.1] sm:p-1.5"
                  sizes="132px"
                />
              </div>
              <h3 className="mt-3 line-clamp-3 max-w-[11rem] text-[11px] font-medium leading-snug text-zinc-700 sm:text-xs">
                {p.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
