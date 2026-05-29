"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useContact } from "@/lib/contact-context";
import { whatsappQuoteUrl } from "@/lib/contact";
import { useI18n } from "@/lib/i18n/context";

const projectImages = Array.from({ length: 11 }, (_, i) => `/projeler/proje-${i + 1}.jpeg`);

export function ProjectsStrip() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { t } = useI18n();
  const { whatsapp } = useContact();

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
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="inline-flex h-11 items-center bg-zinc-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              {t.home.project_quote}
            </Link>
            <a
              href={whatsappQuoteUrl(undefined, whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 bg-[#25D366] px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#1ebe5d]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.107 1.523 5.83L.057 24l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.722.976.995-3.63-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              {t.product.whatsapp}
            </a>
          </div>
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
