"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Product, ProductCategory, ProductColor, ProductSpec } from "@/lib/supabase/types"
import { AllImagesEditor } from "./AllImagesEditor"
import { SpecsEditor } from "./SpecsEditor"
import { BulletsEditor } from "./BulletsEditor"
import { ColorsEditor } from "./ColorsEditor"

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "bar", label: "Bar Taburesi" },
  { value: "konferans-sandalyeleri", label: "Konferans Sandalyeleri" },
  { value: "konferans-koltuklari", label: "Konferans Koltukları" },
  { value: "stadyum", label: "Stadyum Koltukları" },
]

type FormData = {
  id: string
  name: string
  category: ProductCategory
  image_url: string
  gallery_images: string[]
  colors: ProductColor[]
  price: string
  old_price: string
  quote_only: boolean
  description_intro: string
  description_specs: ProductSpec[]
  description_bullets: string[]
  description_footer: string
  is_active: boolean
  sort_order: string
}

interface Props {
  initial?: Product
  mode: "new" | "edit"
}

export function ProductForm({ initial, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState<FormData>({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    category: initial?.category ?? "konferans-koltuklari",
    image_url: initial?.image_url ?? "",
    gallery_images: (initial as (typeof initial & { gallery_images?: string[] }))?.gallery_images ?? [],
    colors: (initial as (typeof initial & { colors?: ProductColor[] }))?.colors ?? [],
    price: initial?.price?.toString() ?? "0",
    old_price: initial?.old_price?.toString() ?? "0",
    quote_only: initial?.quote_only ?? true,
    description_intro: initial?.description_intro ?? "",
    description_specs: initial?.description_specs ?? [],
    description_bullets: initial?.description_bullets ?? [],
    description_footer: initial?.description_footer ?? "",
    is_active: initial?.is_active ?? true,
    sort_order: initial?.sort_order?.toString() ?? "0",
  })

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)

    const supabase = createClient()

    const payload = {
      name: form.name.trim(),
      category: form.category,
      image_url: form.image_url || null,
      gallery_images: form.gallery_images,
      colors: form.colors,
      price: parseFloat(form.price) || 0,
      old_price: parseFloat(form.old_price) || 0,
      quote_only: form.quote_only,
      description_intro: form.description_intro || null,
      description_specs: form.description_specs,
      description_bullets: form.description_bullets,
      description_footer: form.description_footer || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    }

    if (mode === "new") {
      const id = form.id.trim() || slugify(form.name)
      const { error: err } = await supabase
        .from("products")
        .insert({ id, ...payload })
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
      setSuccess("Ürün eklendi!")
      setTimeout(() => router.push("/admin/products"), 1000)
    } else {
      const { error: err } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initial!.id)
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
      setSuccess("Ürün güncellendi!")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Temel Bilgiler */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Temel Bilgiler
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {mode === "new" && (
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Ürün ID{" "}
                <span className="text-zinc-400 normal-case tracking-normal font-normal">
                  (boş bırakırsanız otomatik oluşturulur)
                </span>
              </label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => set("id", e.target.value)}
                placeholder="ornek-urun-id"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900 font-mono"
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Ürün Adı *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              placeholder="Ürün adını girin"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Kategori *
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as ProductCategory)}
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Sıralama
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* Görseller */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Ürün Görselleri
        </h2>
        <AllImagesEditor
          mainImage={form.image_url}
          galleryImages={form.gallery_images}
          onChangeMain={(url) => set("image_url", url)}
          onChangeGallery={(imgs) => set("gallery_images", imgs)}
        />
      </div>

      {/* Renkler */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Renk Seçenekleri
        </h2>
        <ColorsEditor
          value={form.colors}
          onChange={(colors) => set("colors", colors)}
        />
      </div>

      {/* Fiyat */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Fiyat
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 sm:col-span-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
              <input
                type="checkbox"
                checked={form.quote_only}
                onChange={(e) => set("quote_only", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Teklif Alın (fiyat gösterme)
            </label>
          </div>

          {!form.quote_only && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  min="0"
                  step="0.01"
                  className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Eski Fiyat (₺)
                </label>
                <input
                  type="number"
                  value={form.old_price}
                  onChange={(e) => set("old_price", e.target.value)}
                  min="0"
                  step="0.01"
                  className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Açıklama */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Ürün Açıklaması
        </h2>
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Giriş Metni
            </label>
            <textarea
              value={form.description_intro}
              onChange={(e) => set("description_intro", e.target.value)}
              rows={3}
              className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="Ürün hakkında kısa açıklama..."
            />
          </div>

          <SpecsEditor
            value={form.description_specs}
            onChange={(specs) => set("description_specs", specs)}
          />

          <BulletsEditor
            value={form.description_bullets}
            onChange={(bullets) => set("description_bullets", bullets)}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Alt Not
            </label>
            <input
              type="text"
              value={form.description_footer}
              onChange={(e) => set("description_footer", e.target.value)}
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              placeholder="Açıklama alt notu..."
            />
          </div>
        </div>
      </div>

      {/* Durum */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Durum
        </h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          Aktif (sitede görünür)
        </label>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 bg-zinc-900 px-8 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : mode === "new" ? "Ürün Ekle" : "Güncelle"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-11 border border-zinc-200 px-6 text-xs font-semibold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
        >
          İptal
        </button>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
            ✓ {success}
          </div>
        )}
      </div>
    </form>
  )
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
