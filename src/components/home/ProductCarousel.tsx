"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section id={id} className="scroll-mt-28 border-t border-zinc-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="relative mt-8">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="absolute -left-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-900 disabled:opacity-30 md:flex"
            aria-label="Önceki"
          >
            <IconChevron className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="absolute -right-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-900 disabled:opacity-30 md:flex"
            aria-label="Sonraki"
          >
            <IconChevron className="h-5 w-5 rotate-180" />
          </button>

          <div className="overflow-hidden md:px-10" ref={emblaRef}>
            <div className="flex gap-3 sm:gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="min-w-0 flex-[0_0_calc(50%-0.375rem)] sm:flex-[0_0_calc(33.333%-0.67rem)] lg:flex-[0_0_calc(25%-0.75rem)]"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
