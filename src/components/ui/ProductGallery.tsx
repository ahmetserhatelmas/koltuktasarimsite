"use client"

import Image from "next/image"
import { useState } from "react"

interface Props {
  mainImage: string
  galleryImages: string[]
  productName: string
}

export function ProductGallery({ mainImage, galleryImages, productName }: Props) {
  // Tüm görseller sırayla: önce main, sonra galeri (main ile birebir aynı olanları atla, tek kez göster)
  const seen = new Set<string>()
  const allImages: string[] = []
  for (const img of [mainImage, ...galleryImages]) {
    if (img && !seen.has(img)) {
      seen.add(img)
      allImages.push(img)
    }
  }

  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i - 1 + allImages.length) % allImages.length)
  const next = () => setCurrent((i) => (i + 1) % allImages.length)

  if (allImages.length === 0) return null

  const currentSrc = allImages[current]

  return (
    <div className="select-none">
      {/* Ana görsel */}
      <div className="relative aspect-square w-full overflow-hidden border border-zinc-200 bg-white">
        <Image
          src={currentSrc}
          alt={`${productName} — ${current + 1}. görsel`}
          fill
          priority={current === 0}
          className="object-contain object-center p-4 transition-opacity duration-200"
          sizes="(max-width:768px) 100vw, 50vw"
          unoptimized={currentSrc.startsWith("http")}
        />

        {/* Sayaç */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {current + 1} / {allImages.length}
          </div>
        )}

        {/* Prev / Next okları */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-zinc-200 bg-white/90 text-zinc-800 shadow-sm transition hover:bg-white hover:shadow-md"
              aria-label="Önceki görsel"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-zinc-200 bg-white/90 text-zinc-800 shadow-sm transition hover:bg-white hover:shadow-md"
              aria-label="Sonraki görsel"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail şeridi */}
      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-zinc-50 transition ${
                i === current
                  ? "border-zinc-900"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
              aria-label={`${i + 1}. görseli seç`}
            >
              <Image
                src={img}
                alt={`${productName} küçük resim ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
                unoptimized={img.startsWith("http")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
