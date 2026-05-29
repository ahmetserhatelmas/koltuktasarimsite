"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/supabase/types"
import { ImageUpload } from "../_components/ImageUpload"

type CategoryForm = {
  id: string
  label: string
  slug: string
  route: string
  tagline: string
  image_url: string
  is_featured: boolean
  is_active: boolean
  sort_order: number
  translations?: Record<string, { label?: string; tagline?: string }>
}

const EMPTY_CATEGORY: CategoryForm = {
  id: "",
  label: "",
  slug: "",
  route: "",
  tagline: "",
  image_url: "",
  is_featured: true,
  is_active: true,
  sort_order: 0,
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | "new" | null>(null)
  const [formData, setFormData] = useState<CategoryForm>(EMPTY_CATEGORY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [translating, setTranslating] = useState(false)
  const [transStatus, setTransStatus] = useState("")

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order")
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setFormData({
      id: cat.id,
      label: cat.label,
      slug: cat.slug,
      route: cat.route,
      tagline: cat.tagline ?? "",
      image_url: cat.image_url ?? "",
      is_featured: cat.is_featured,
      is_active: cat.is_active ?? true,
      sort_order: cat.sort_order,
      translations: (cat.translations as CategoryForm["translations"]) ?? {},
    })
    setError("")
    setSuccess("")
    setTransStatus("")
  }

  function startNew() {
    setEditingId("new")
    setFormData({
      ...EMPTY_CATEGORY,
      sort_order: categories.length,
    })
    setError("")
    setSuccess("")
  }

  function setF<K extends keyof CategoryForm>(k: K, v: CategoryForm[K]) {
    setFormData((p) => {
      const next = { ...p, [k]: v }
      if (editingId === "new" && k === "label" && typeof v === "string") {
        const slug = slugify(v)
        next.slug = slug
        next.id = slug
        next.route = slug ? `/${slug}` : ""
      }
      return next
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.label.trim()) {
      setError("Etiket zorunludur.")
      return
    }
    if (!formData.id.trim() || !formData.slug.trim() || !formData.route.trim()) {
      setError("Kimlik, slug ve route zorunludur.")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const supabase = createClient()
    const payload = {
      label: formData.label.trim(),
      slug: formData.slug.trim(),
      route: formData.route.trim(),
      tagline: formData.tagline.trim() || null,
      image_url: formData.image_url.trim() || null,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      sort_order: formData.sort_order ?? 0,
      translations: formData.translations ?? {},
    }

    if (editingId === "new") {
      const { error: err } = await supabase.from("categories").insert({
        id: formData.id.trim(),
        ...payload,
      })
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
    } else {
      const { error: err } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editingId!)
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
    }

    setSuccess("Kaydedildi!")
    await load()
    setSaving(false)
    setTimeout(() => {
      setEditingId(null)
      setSuccess("")
    }, 1200)
  }

  async function handleAutoTranslate() {
    setTranslating(true)
    setTransStatus("Çeviriliyor...")
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.label,
          description_intro: formData.tagline,
          description_footer: "",
          description_bullets: [],
          description_specs: [],
        }),
      })
      if (!res.ok) throw new Error("API hatası")
      const data = await res.json()
      const translations: CategoryForm["translations"] = {}
      for (const lang of ["en", "ru", "ar"] as const) {
        const tr = data.translations?.[lang]
        if (!tr) continue
        translations[lang] = {
          label: tr.name || undefined,
          tagline: tr.description_intro || undefined,
        }
      }
      setFormData((p) => ({ ...p, translations }))
      setTransStatus("✓ Çeviri tamamlandı (EN, RU, AR)")
    } catch {
      setTransStatus("✗ Çeviri başarısız")
    } finally {
      setTranslating(false)
    }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`"${label}" kategorisini silmek istediğinize emin misiniz?`)) return
    const supabase = createClient()
    const { error: err } = await supabase.from("categories").delete().eq("id", id)
    if (err) {
      alert(err.message)
      return
    }
    if (editingId === id) setEditingId(null)
    await load()
  }

  async function toggleField(
    cat: Category,
    field: "is_active" | "is_featured"
  ) {
    const supabase = createClient()
    const next = !cat[field]
    const { error: err } = await supabase
      .from("categories")
      .update({ [field]: next })
      .eq("id", cat.id)
    if (err) {
      alert(err.message)
      return
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, [field]: next } : c))
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Kategoriler</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kategori görselleri, öne çıkan durumu ve site görünürlüğü
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex h-10 shrink-0 items-center bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
        >
          + Yeni Kategori
        </button>
      </div>

      {editingId !== null && (
        <form
          onSubmit={handleSave}
          className="mb-6 border border-zinc-900 bg-white p-6"
        >
          <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
            {editingId === "new" ? "Yeni Kategori" : "Kategori Düzenle"}
          </h2>

          {error && (
            <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setF("image_url", url)}
                label="Kategori Görseli"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Etiket *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setF("label", e.target.value)}
                required
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            {editingId === "new" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Kimlik (ID) *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setF("id", e.target.value)}
                  required
                  className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                  placeholder="konferans-sandalyeleri"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setF("slug", e.target.value)}
                required
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Route *
              </label>
              <input
                type="text"
                value={formData.route}
                onChange={(e) => setF("route", e.target.value)}
                required
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="/konferans-sandalyeleri"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Sıra No
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setF("sort_order", parseInt(e.target.value) || 0)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setF("tagline", e.target.value)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="Form, Hilton ve salon sandalye modelleri"
              />
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setF("is_featured", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                Öne çıkan kategorilerde göster
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setF("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                Aktif (sitede göster)
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="h-10 bg-zinc-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={translating || !formData.label}
              className="h-10 border border-blue-300 bg-blue-50 px-5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              {translating ? "Çeviriliyor..." : "🌐 Otomatik Çevir (EN/RU/AR)"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="h-10 border border-zinc-200 px-5 text-xs font-semibold text-zinc-600 hover:border-zinc-900"
            >
              İptal
            </button>
            {transStatus && (
              <span className={`text-xs font-medium ${transStatus.startsWith("✓") ? "text-green-600" : transStatus.startsWith("✗") ? "text-red-600" : "text-zinc-500"}`}>
                {transStatus}
              </span>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center text-sm text-zinc-400">Henüz kategori yok.</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`border bg-white ${
                cat.is_active ? "border-zinc-200" : "border-zinc-100 opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 border border-zinc-100 bg-zinc-50">
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.label}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={cat.image_url.startsWith("http")}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{cat.label}</p>
                  <p className="text-sm text-zinc-500">{cat.tagline}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold uppercase text-zinc-400">
                      {cat.route}
                    </span>
                    {cat.is_featured && (
                      <span className="text-[10px] font-semibold uppercase text-amber-600">
                        ★ Öne Çıkan
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleField(cat, "is_active")}
                    className={`h-8 border px-3 text-[10px] font-semibold uppercase ${
                      cat.is_active
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-zinc-200 text-zinc-400"
                    }`}
                  >
                    {cat.is_active ? "Aktif" : "Pasif"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleField(cat, "is_featured")}
                    className={`h-8 border px-3 text-[10px] font-semibold uppercase ${
                      cat.is_featured
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-zinc-200 text-zinc-400"
                    }`}
                  >
                    {cat.is_featured ? "Öne Çıkan" : "Vitrinden Gizle"}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="h-8 border border-zinc-200 px-4 text-xs text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.label)}
                    className="h-8 border border-zinc-200 px-4 text-xs text-red-500 hover:border-red-300 hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
