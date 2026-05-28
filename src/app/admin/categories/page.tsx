"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/supabase/types"
import { ImageUpload } from "../_components/ImageUpload"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    setFormData({ ...cat })
    setError("")
    setSuccess("")
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    const supabase = createClient()
    const { error: err } = await supabase
      .from("categories")
      .update({
        label: formData.label,
        image_url: formData.image_url || null,
        tagline: formData.tagline || null,
        is_featured: formData.is_featured,
        sort_order: formData.sort_order ?? 0,
      })
      .eq("id", editingId!)

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    setSuccess("Kaydedildi!")
    await load()
    setSaving(false)
    setTimeout(() => {
      setEditingId(null)
      setSuccess("")
    }, 1200)
  }

  function setF<K extends keyof Category>(k: K, v: Category[K]) {
    setFormData((p) => ({ ...p, [k]: v }))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Kategoriler</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kategori görselleri ve etiketleri düzenle
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-zinc-200 bg-white">
              {editingId === cat.id ? (
                <form onSubmit={handleSave} className="p-6">
                  <h2 className="mb-5 text-sm font-bold text-zinc-900">{cat.id}</h2>

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
                        value={formData.image_url ?? ""}
                        onChange={(url) => setF("image_url", url)}
                        label="Kategori Görseli"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Etiket
                      </label>
                      <input
                        type="text"
                        value={formData.label ?? ""}
                        onChange={(e) => setF("label", e.target.value)}
                        required
                        className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Sıra No
                      </label>
                      <input
                        type="number"
                        value={formData.sort_order ?? 0}
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
                        value={formData.tagline ?? ""}
                        onChange={(e) => setF("tagline", e.target.value)}
                        className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                        placeholder="Form, Hilton ve salon sandalye modelleri"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
                        <input
                          type="checkbox"
                          checked={formData.is_featured ?? false}
                          onChange={(e) => setF("is_featured", e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-300"
                        />
                        Öne Çıkan Kategorilerde Göster
                      </label>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-10 bg-zinc-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="h-10 border border-zinc-200 px-5 text-xs font-semibold text-zinc-600 hover:border-zinc-900"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-4 p-4">
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
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900">{cat.label}</p>
                    <p className="text-sm text-zinc-500">{cat.tagline}</p>
                    <div className="mt-1 flex gap-2">
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
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="h-8 border border-zinc-200 px-4 text-xs text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 shrink-0"
                  >
                    Düzenle
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
