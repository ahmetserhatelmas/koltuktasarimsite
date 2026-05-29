import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageForm } from "../../../_components/PageForm"
import { CONTENT_SECTION_LABELS, DEFAULT_CONTENT_PAGES, type ContentPage } from "@/lib/supabase/types"

type Props = { params: Promise<{ slug: string }> }

export default async function EditPagePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("content_pages")
    .select("*")
    .eq("slug", slug)
    .single()

  // DB'de yoksa DEFAULT_CONTENT_PAGES'den fallback al
  const typedPage: ContentPage = (page as ContentPage) ??
    DEFAULT_CONTENT_PAGES.find((p) => p.slug === slug) ??
    notFound()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/pages" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Sayfalar
        </Link>
        <span className="text-zinc-300">/</span>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{typedPage.title}</h1>
          <p className="text-sm text-zinc-500">{CONTENT_SECTION_LABELS[typedPage.section]}</p>
        </div>
      </div>
      <PageForm page={typedPage} />
    </div>
  )
}
