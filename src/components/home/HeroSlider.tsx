"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site-data";

/** Yalnızca ofis ortamı / yaşam tarzı görselleri — ürün kesiti yok */
const slides = [
  {
    id: "h1",
    src: "/hero/slide-01.jpg",
    alt: "Aydınlık modern ofis çalışma alanı ve toplantı köşesi",
    line1: "Ofise hoş geldiniz",
    line2: "Modern çalışma alanlarında konfor ve ergonomi",
  },
  {
    id: "h2",
    src: "/hero/slide-02.jpg",
    alt: "Geniş pencereli, bitkilerle zenginleştirilmiş ofis ortamı",
    line1: "İlham veren mekânlar",
    line2: "Doğal ışık ve ferah düzenler",
  },
  {
    id: "h3",
    src: "/hero/slide-03.jpg",
    alt: "Minimal çağdaş ofis iç mekânı",
    line1: "Verimli çalışma",
    line2: "Ekip çalışmasına uygun profesyonel ortamlar",
  },
  {
    id: "h4",
    src: "/hero/slide-04.jpg",
    alt: "Yeşillik ve ahşap detaylarla modern ofis",
    line1: "Kurumsal kimliğinize uygun",
    line2: "Şık detaylar ve sürdürülebilir ofis kültürü",
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
    const id = window.setInterval(() => emblaApi.scrollNext(), 5200);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div key={s.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[21/9] min-h-[280px] w-full bg-zinc-900 sm:min-h-[360px] lg:aspect-[24/9]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 pt-10 sm:px-10 lg:px-16 lg:pb-20">
                  <p className="font-serif text-3xl text-white drop-shadow-md sm:text-4xl lg:text-5xl">{s.line1}</p>
                  <p className="mt-2 max-w-xl text-sm font-medium uppercase tracking-[0.2em] text-white/95 sm:text-base">
                    {s.line2}
                  </p>
                  <p className="mt-4 hidden font-serif text-lg text-white/85 sm:block">{SITE_NAME}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:bottom-6">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slayt ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`pointer-events-auto h-2 rounded-full transition-all duration-300 ${
              i === selected ? "w-8 bg-white shadow-sm" : "w-2 bg-white/45 ring-1 ring-white/70 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
