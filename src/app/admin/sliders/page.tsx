"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Slider } from "@/lib/supabase/types"
import { ImageUpload } from "../_components/ImageUpload"

type SliderFormData = Omit<Slider, "id" | "created_at"> & {
  translations?: Record<string, { accent?: string; headline_italic?: string; headline_bold?: string; sub_text?: string }>
}

const EMPTY_SLIDER: SliderFormData = {
  accent: "",
  headline_italic: "",
  headline_bold: "",
  sub_text: "",
  image_url: "",
  link: null,
  sort_order: 0,
  is_active: true,
  translations: {},
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | "new" | null>(null)
  const [formData, setFormData] = useState<SliderFormData>(EMPTY_SLIDER)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [translating, setTranslating] = useState(false)
  const [transStatus, setTransStatus] = useState("")

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from("sliders")
      .select("*")
      .order("sort_order")
    setSliders(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  function startEdit(slider: Slider) {
    setEditingId(slider.id)
    setFormData({
      accent: slider.accent ?? "",
      headline_italic: slider.headline_italic ?? "",
      headline_bold: slider.headline_bold ?? "",
      sub_text: slider.sub_text ?? "",
      image_url: slider.image_url,
      link: slider.link,
      sort_order: slider.sort_order,
      is_active: slider.is_active,
      translations: (slider.translations as SliderFormData["translations"]) ?? {},
    })
    setError("")
    setTransStatus("")
  }

  function startNew() {
    setEditingId("new")
    setFormData({ ...EMPTY_SLIDER, sort_order: sliders.length })
    setError("")
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.image_url) {
      setError("Görsel zorunludur.")
      return
    }
    setSaving(true)
    setError("")

    const supabase = createClient()
    const payload = {
      accent: formData.accent || null,
      headline_italic: formData.headline_italic || null,
      headline_bold: formData.headline_bold || null,
      sub_text: formData.sub_text || null,
      image_url: formData.image_url,
      link: formData.link || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
      translations: formData.translations ?? {},
    }

    if (editingId === "new") {
      const { error: err } = await supabase.from("sliders").insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase
        .from("sliders")
        .update(payload)
        .eq("id", editingId!)
      if (err) { setError(err.message); setSaving(false); return }
    }

    await load()
    setEditingId(null)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu slider'ı silmek istediğinize emin misiniz?")) return
    const supabase = createClient()
    await supabase.from("sliders").delete().eq("id", id)
    await load()
  }

  async function toggleActive(slider: Slider) {
    const supabase = createClient()
    await supabase
      .from("sliders")
      .update({ is_active: !slider.is_active })
      .eq("id", slider.id)
    setSliders((prev) =>
      prev.map((s) => s.id === slider.id ? { ...s, is_active: !s.is_active } : s)
    )
  }

  function setF<K extends keyof SliderFormData>(k: K, v: SliderFormData[K]) {
    setFormData((p) => ({ ...p, [k]: v }))
  }

  async function handleAutoTranslate() {
    setTranslating(true)
    setTransStatus("Çeviriliyor...")
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.headline_bold,
          description_intro: formData.sub_text,
          description_footer: [formData.accent, formData.headline_italic].filter(Boolean).join(" | "),
          description_bullets: [],
          description_specs: [],
        }),
      })
      if (!res.ok) throw new Error("API hatası")
      const data = await res.json()
      const translations: SliderFormData["translations"] = {}
      for (const lang of ["en", "ru", "ar"] as const) {
        const tr = data.translations?.[lang]
        if (!tr) continue
        const parts = (tr.description_footer as string | undefined)?.split(" | ") ?? []
        translations[lang] = {
          accent: parts[0] || undefined,
          headline_italic: parts[1] || undefined,
          headline_bold: tr.name || undefined,
          sub_text: tr.description_intro || undefined,
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Slider Yönetimi</h1>
          <p className="mt-1 text-sm text-zinc-500">Ana sayfa hero slider fotoğrafları</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="h-10 bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 inline-flex items-center"
        >
          + Yeni Slider
        </button>
      </div>

      {/* Edit Form */}
      {editingId !== null && (
        <form
          onSubmit={handleSave}
          className="mb-6 border border-zinc-900 bg-white p-6"
        >
          <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
            {editingId === "new" ? "Yeni Slider" : "Slider Düzenle"}
          </h2>

          {error && (
            <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setF("image_url", url)}
                label="Slider Görseli *"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Üst Yazı (Accent)
              </label>
              <input
                type="text"
                value={formData.accent ?? ""}
                onChange={(e) => setF("accent", e.target.value)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="Konferans & salon"
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

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Başlık (İtalik)
              </label>
              <input
                type="text"
                value={formData.headline_italic ?? ""}
                onChange={(e) => setF("headline_italic", e.target.value)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="koltukları"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Başlık (Kalın/Büyük)
              </label>
              <input
                type="text"
                value={formData.headline_bold ?? ""}
                onChange={(e) => setF("headline_bold", e.target.value)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="KEŞFEDİN"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Alt Yazı
              </label>
              <input
                type="text"
                value={formData.sub_text ?? ""}
                onChange={(e) => setF("sub_text", e.target.value)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="Konferans sandalyeleri ve salon koltuk serileri"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Link (opsiyonel)
              </label>
              <input
                type="text"
                value={formData.link ?? ""}
                onChange={(e) => setF("link", e.target.value || null)}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                placeholder="/konferans-koltuklari"
              />
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
              disabled={translating || !formData.headline_bold}
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

      {/* Sliders List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : sliders.length === 0 ? (
        <div className="py-12 text-center text-sm text-zinc-400">Henüz slider yok.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sliders.map((slider) => (
            <div
              key={slider.id}
              className={`border bg-white ${slider.is_active ? "border-zinc-200" : "border-zinc-100 opacity-60"}`}
            >
              <div className="relative aspect-video bg-zinc-100">
                <Image
                  src={slider.image_url}
                  alt={slider.headline_bold ?? "Slider"}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized={slider.image_url.startsWith("http")}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 right-0 p-3 text-right text-white">
                  {slider.accent && (
                    <p className="text-[10px] uppercase tracking-widest">{slider.accent}</p>
                  )}
                  {slider.headline_italic && (
                    <p className="font-serif italic text-sm">{slider.headline_italic}</p>
                  )}
                  {slider.headline_bold && (
                    <p className="text-sm font-bold uppercase">{slider.headline_bold}</p>
                  )}
                </div>
                <div className="absolute left-2 top-2 bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                  #{slider.sort_order + 1}
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <button
                  type="button"
                  onClick={() => toggleActive(slider)}
                  className={`text-[10px] font-semibold uppercase ${slider.is_active ? "text-green-600" : "text-zinc-400"}`}
                >
                  {slider.is_active ? "Aktif" : "Pasif"}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(slider)}
                    className="h-7 border border-zinc-200 px-3 text-xs text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(slider.id)}
                    className="h-7 border border-zinc-200 px-3 text-xs text-red-500 hover:border-red-300 hover:bg-red-50"
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
