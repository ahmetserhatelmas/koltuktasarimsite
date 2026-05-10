"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { formatTry } from "@/lib/format";
import { productDetailHref } from "@/lib/product-lookup";
import type { CatalogProduct } from "@/lib/products";

function IconChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductCarousel({
  id,
  title,
  subtitle,
  products,
}: {
  id?: string;
  title: string;
  subtitle: string;
  products: CatalogProduct[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    queueMicrotask(() => onSelect());
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id={id} className="scroll-mt-28 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-zinc-900 sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">{subtitle}</p>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-30 md:flex"
            aria-label="Önceki"
          >
            <IconChevron className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canNext}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-30 md:flex"
            aria-label="Sonraki"
          >
            <IconChevron className="h-5 w-5 rotate-180" />
          </button>

          <div className="overflow-hidden md:px-12" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="min-w-0 flex-[0_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(33.333%-0.75rem)] lg:flex-[0_0_calc(25%-0.95rem)]"
                >
                  <Link
                    href={productDetailHref(p.id)}
                    className="group flex h-full flex-col rounded-3xl border border-zinc-100 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4"
                  >
                    <div className="relative aspect-[3/4] min-h-[220px] overflow-hidden rounded-2xl border border-zinc-100/80 bg-white sm:min-h-[260px] sm:rounded-3xl">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain object-center p-1 transition duration-500 group-hover:scale-[1.03] sm:p-1.5 sm:scale-[1.06]"
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      />
                    </div>
                    <div className="mt-3 flex justify-center gap-1.5">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-2 w-2 rounded-full bg-zinc-300/90" />
                      ))}
                    </div>
                    <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-center text-xs font-medium leading-snug text-zinc-800 sm:text-sm">
                      {p.name}
                    </h3>
                    <div className="mt-auto pt-3 text-center">
                      <p className="text-xs text-zinc-400 line-through">{formatTry(p.oldPrice)}</p>
                      <p className="text-base font-semibold text-zinc-900">{formatTry(p.price)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
