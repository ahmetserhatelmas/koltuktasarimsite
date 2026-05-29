import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { formatContentHtml } from "@/lib/content-format"
import { createClient } from "@/lib/supabase/server"
import { CONTENT_SECTION_LABELS, DEFAULT_CONTENT_PAGES, type ContentPage } from "@/lib/supabase/types"
import { SITE_NAME } from "@/lib/site-data"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

async function getPage(slug: string): Promise<ContentPage | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("content_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
    if (data) return data as ContentPage
  } catch {
    // fallback below
  }
  return DEFAULT_CONTENT_PAGES.find((p) => p.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: "Sayfa bulunamadı" }
  return { title: `${page.title} | ${SITE_NAME}` }
}

export default async function ContentPageView({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) notFound()

  const html = formatContentHtml(page.content ?? "")

  return (
    <main className="flex-1 bg-[var(--surface)] pb-16 pt-4 sm:pb-20">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Anasayfa", href: "/" },
              { label: CONTENT_SECTION_LABELS[page.section] ?? "Sayfa" },
              { label: page.title },
            ]}
          />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {page.image_url && (
          <div className="relative mb-8 aspect-[21/9] overflow-hidden border border-zinc-200 bg-white">
            <Image
              src={page.image_url}
              alt={page.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized={page.image_url.startsWith("http")}
              priority
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-zinc-900">{page.title}</h1>

        {html ? (
          <div
            className="prose prose-zinc mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mt-8 text-sm text-zinc-500">
            Bu sayfanın içeriği henüz eklenmemiş.
          </p>
        )}
      </article>
    </main>
  )
}
