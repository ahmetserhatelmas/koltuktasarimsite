"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const slides = [
  {
    id: "1",
    src: "/hero/slide-1.png",
    alt: "Koltuk Dünyası slayt 1",
    accent: "Konferans & salon",
    headline: "koltukları",
    headlineBold: "KEŞFEDİN",
    sub: "Konferans sandalyeleri ve salon koltuk serileri",
  },
  {
    id: "2",
    src: "/hero/slide-2.png",
    alt: "Koltuk Dünyası slayt 2",
    accent: "Tabure & stadyum",
    headline: "çözümleri",
    headlineBold: "İNCELEYİN",
    sub: "Bar tabureleri ve stadyum koltuk sistemleri",
  },
  {
    id: "3",
    src: "/hero/slide-3.png",
    alt: "Koltuk Dünyası slayt 3",
    accent: "Projeler",
    headline: "kurulumlarınız için",
    headlineBold: "TEKLİF ALIN",
    sub: "Referans projeler ve özel üretim",
  },
] as const;

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 22 });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    queueMicrotask(() => onSelect());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 6000);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section className="relative bg-zinc-900">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div key={s.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[16/9] min-h-[300px] w-full sm:min-h-[420px] lg:aspect-[21/9]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />
                <div className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col justify-center px-6 text-right sm:px-12 lg:px-16">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">{s.accent}</p>
                  <p className="mt-2 font-serif text-3xl italic text-white sm:text-4xl lg:text-5xl">{s.headline}</p>
                  <p className="mt-1 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl lg:text-4xl">
                    {s.headlineBold}
                  </p>
                  <p className="mt-4 text-sm text-white/85">{s.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 md:flex"
        aria-label="Önceki slayt"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 md:flex"
        aria-label="Sonraki slayt"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slayt ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === selected ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
