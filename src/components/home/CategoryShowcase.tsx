"use client"

import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"
import type { Category } from "@/lib/supabase/types"
import { SectionHeading } from "@/components/ui/SectionHeading"

function IconChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface Props {
  categories: Category[]
}

export function CategoryShowcase({ categories }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    queueMicrotask(() => onSelect())
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("reInit", onSelect)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  if (categories.length === 0) return null

  return (
    <section id="kategoriler" className="scroll-mt-28 bg-[var(--surface)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Öne çıkan kategoriler"
          subtitle="Koltuk Dünyası klasörlerinize göre ayrılmış vitrin"
        />

        <div className="relative mt-8">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md transition hover:bg-white disabled:opacity-30 md:flex"
            aria-label="Önceki"
          >
            <IconChevron className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md transition hover:bg-white disabled:opacity-30 md:flex"
            aria-label="Sonraki"
          >
            <IconChevron className="h-5 w-5 rotate-180" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.route}
                  className="group relative min-w-0 flex-[0_0_72%] overflow-hidden sm:flex-[0_0_48%] lg:flex-[0_0_24%]"
                >
                  <div className="relative aspect-[3/4] w-full bg-zinc-100">
                    {cat.image_url && (
                      <Image
                        src={cat.image_url}
                        alt={cat.label}
                        fill
                        className="object-cover object-center transition duration-700 group-hover:scale-105"
                        sizes="(max-width:1024px) 72vw, 25vw"
                        unoptimized={cat.image_url.startsWith("http")}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="text-lg font-bold text-white sm:text-xl">
                        {cat.label}
                      </p>
                      {cat.tagline && (
                        <p className="mt-1 text-xs text-white/85 sm:text-sm">
                          {cat.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
