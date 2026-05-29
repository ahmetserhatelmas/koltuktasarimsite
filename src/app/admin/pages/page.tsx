"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ContentPage } from "@/lib/supabase/types"
import { CONTENT_SECTION_LABELS, DEFAULT_CONTENT_PAGES } from "@/lib/supabase/types"

export default function AdminPagesPage() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "kurumsal" | "yasal">("all")

  async function load() {
    setLoading(true)
    const supabase = createClient()
    let q = supabase.from("content_pages").select("*").order("section").order("sort_order")
    if (filter !== "all") q = q.eq("section", filter)
    const { data } = await q
    setPages(data && data.length > 0 ? data : DEFAULT_CONTENT_PAGES)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Sayfalar</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Footer&apos;daki Kurumsal ve Yasal Bilgilendirme linkleri
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "kurumsal", "yasal"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`h-8 px-3 text-xs font-semibold uppercase tracking-wider transition ${
              filter === f
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900"
            }`}
          >
            {f === "all" ? "Tümü" : CONTENT_SECTION_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : (
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Başlık
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Bölüm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Durum
                </th>
                <th className="w-28 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.slug} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{page.title}</p>
                    <p className="text-xs text-zinc-400">/sayfa/{page.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {CONTENT_SECTION_LABELS[page.section]}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold ${
                        page.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {page.is_active ? "Aktif" : "Gizli"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pages/${page.slug}/edit`}
                      className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
