"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ContentPage, ContentPageSection } from "@/lib/supabase/types"
import { CONTENT_SECTION_LABELS } from "@/lib/supabase/types"

const EMPTY_PAGE: Omit<ContentPage, "updated_at"> = {
  slug: "",
  title: "",
  section: "kurumsal",
  content: "",
  image_url: null,
  link_url: null,
  sort_order: 0,
  is_active: true,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "kurumsal" | "yasal">("all")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Yeni sayfa formu
  const [adding, setAdding] = useState(false)
  const [newPage, setNewPage] = useState({ ...EMPTY_PAGE })
  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(false)

  async function load() {
    setLoading(true)
    const supabase = createClient()
    let q = supabase.from("content_pages").select("*").order("section").order("sort_order")
    if (filter !== "all") q = q.eq("section", filter)
    const { data } = await q
    setPages((data ?? []) as ContentPage[])
    setLoading(false)
  }

  useEffect(() => { void load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(slug: string) {
    if (!confirm(`"${slug}" sayfasını silmek istediğinizden emin misiniz?`)) return
    setDeleting(slug)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.from("content_pages").delete().eq("slug", slug)
    if (err) setError(err.message)
    else await load()
    setDeleting(null)
  }

  async function handleAdd() {
    if (!newPage.title.trim()) { setError("Başlık zorunlu."); return }
    if (!newPage.slug.trim()) { setError("Slug zorunlu."); return }
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.from("content_pages").insert({
      slug: newPage.slug.trim(),
      title: newPage.title.trim(),
      section: newPage.section,
      content: "",
      image_url: null,
      link_url: newPage.link_url?.trim() || null,
      sort_order: newPage.sort_order || 0,
      is_active: newPage.is_active,
      updated_at: new Date().toISOString(),
    })
    if (err) { setError(err.message); setSaving(false); return }
    setAdding(false)
    setNewPage({ ...EMPTY_PAGE })
    setSlugManual(false)
    await load()
    setSaving(false)
  }

  function handleTitleChange(val: string) {
    setNewPage((p) => ({
      ...p,
      title: val,
      slug: slugManual ? p.slug : slugify(val),
    }))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sayfalar</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Footer&apos;daki Kurumsal ve Yasal Bilgilendirme linkleri
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setAdding(true); setNewPage({ ...EMPTY_PAGE }); setSlugManual(false) }}
          className="h-10 bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
        >
          + Yeni Sayfa
        </button>
      </div>

      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">❌ {error}</div>
      )}

      {/* Yeni sayfa formu */}
      {adding && (
        <div className="mb-6 border border-zinc-300 bg-white p-5">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Yeni Sayfa</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Başlık</label>
              <input
                type="text"
                value={newPage.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Hakkımızda"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Slug <span className="font-normal normal-case text-zinc-400">(URL adresi)</span>
              </label>
              <input
                type="text"
                value={newPage.slug}
                onChange={(e) => { setSlugManual(true); setNewPage((p) => ({ ...p, slug: e.target.value })) }}
                placeholder="hakkimizda"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Bölüm</label>
              <select
                value={newPage.section}
                onChange={(e) => setNewPage((p) => ({ ...p, section: e.target.value as ContentPageSection }))}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              >
                <option value="kurumsal">Kurumsal</option>
                <option value="yasal">Yasal Bilgilendirme</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Özel Link <span className="font-normal normal-case text-zinc-400">(boş = /sayfa/{newPage.slug || "slug"})</span>
              </label>
              <input
                type="text"
                value={newPage.link_url ?? ""}
                onChange={(e) => setNewPage((p) => ({ ...p, link_url: e.target.value }))}
                placeholder="/iletisim"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={newPage.is_active}
              onChange={(e) => setNewPage((p) => ({ ...p, is_active: e.target.checked }))}
              className="h-4 w-4"
            />
            Sitede görünür
          </label>
          <p className="mt-2 text-xs text-zinc-400">
            Sayfa oluştuktan sonra &quot;Düzenle&quot; ile içerik ekleyebilirsiniz.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving}
              className="h-10 bg-zinc-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? "Oluşturuluyor..." : "Oluştur"}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="h-10 border border-zinc-200 px-5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-900"
            >
              İptal
            </button>
          </div>
        </div>
      )}

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
      ) : pages.length === 0 ? (
        <div className="py-12 text-center text-sm text-zinc-400">
          Henüz sayfa yok. &quot;+ Yeni Sayfa&quot; ile başlayın.
        </div>
      ) : (
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Başlık</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Bölüm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Durum</th>
                <th className="w-40 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">İşlem</th>
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
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold ${
                      page.is_active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {page.is_active ? "Aktif" : "Gizli"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(page.slug)}
                        disabled={deleting === page.slug}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {deleting === page.slug ? "Siliniyor..." : "Sil"}
                      </button>
                      <Link
                        href={`/admin/pages/${page.slug}/edit`}
                        className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                      >
                        Düzenle
                      </Link>
                    </div>
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
