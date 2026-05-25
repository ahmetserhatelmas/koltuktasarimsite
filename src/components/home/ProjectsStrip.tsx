"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const projectImages = Array.from({ length: 11 }, (_, i) => `/projeler/proje-${i + 1}.jpeg`);

export function ProjectsStrip() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() =>
    setLightbox((i) => (i === null ? null : (i - 1 + projectImages.length) % projectImages.length)),
  []);

  const next = useCallback(() =>
    setLightbox((i) => (i === null ? null : (i + 1) % projectImages.length)),
  []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <section id="projeler" className="scroll-mt-28 border-t border-zinc-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            title="Projeler"
            subtitle="Referans kurulumlarımızdan seçmeler."
          />
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
            {projectImages.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative aspect-[4/3] overflow-hidden bg-zinc-100 focus:outline-none"
                aria-label={`Proje görseli ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Proje referans ${i + 1}`}
                  fill
                  className="object-cover object-center transition duration-300 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
                  <svg className="h-8 w-8 scale-0 text-white drop-shadow transition duration-300 group-hover:scale-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          <Link
            href="/iletisim"
            className="mt-8 inline-flex h-11 items-center bg-zinc-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
          >
            Proje teklifi alın
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
          onClick={close}
        >
          {/* Büyük görsel */}
          <div
            className="relative flex h-full w-full max-h-screen max-w-6xl items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full">
              <Image
                src={projectImages[lightbox]}
                alt={`Proje ${lightbox + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Sayaç */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">
            {lightbox + 1} / {projectImages.length}
          </p>

          {/* Önceki */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Önceki"
          >
            ‹
          </button>

          {/* Sonraki */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Sonraki"
          >
            ›
          </button>

          {/* Kapat */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
