"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { TrustIcon, TrustItem } from "@/components/home/TrustBar"

const ICON_OPTIONS: { value: TrustIcon; label: string }[] = [
  { value: "truck",  label: "🚚 Teslimat" },
  { value: "return", label: "↩️ İade" },
  { value: "phone",  label: "📞 İletişim" },
  { value: "chair",  label: "🪑 Koltuk" },
  { value: "star",   label: "⭐ Yıldız" },
  { value: "shield", label: "🛡️ Güvenlik" },
  { value: "clock",  label: "🕐 Saat" },
  { value: "globe",  label: "🌐 Dünya" },
]

const EMPTY: Omit<TrustItem, "id" | "created_at"> = {
  icon: "star",
  title: "",
  description: "",
  sort_order: 0,
  is_active: true,
}

export default function AdminTrustBarPage() {
  const [items, setItems] = useState<TrustItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Yeni öğe formu
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ ...EMPTY })

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("trust_items")
      .select("*")
      .order("sort_order")
    setItems((data ?? []) as TrustItem[])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  async function handleSave(item: TrustItem) {
    setSaving(item.id)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase
      .from("trust_items")
      .update({
        icon: item.icon,
        title: item.title,
        description: item.description,
        sort_order: item.sort_order,
        is_active: item.is_active,
      })
      .eq("id", item.id)
    if (err) setError(err.message)
    else await load()
    setSaving(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu öğeyi silmek istediğinizden emin misiniz?")) return
    setSaving(id)
    const supabase = createClient()
    const { error: err } = await supabase.from("trust_items").delete().eq("id", id)
    if (err) setError(err.message)
    else await load()
    setSaving(null)
  }

  async function handleAdd() {
    if (!newItem.title.trim()) { setError("Başlık zorunlu."); return }
    setSaving("new")
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.from("trust_items").insert({
      icon: newItem.icon,
      title: newItem.title.trim(),
      description: newItem.description.trim(),
      sort_order: newItem.sort_order || items.length + 1,
      is_active: newItem.is_active,
    })
    if (err) { setError(err.message); setSaving(null); return }
    setNewItem({ ...EMPTY })
    setAdding(false)
    await load()
    setSaving(null)
  }

  function updateLocal(id: string, field: keyof TrustItem, value: unknown) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Güven Bantı</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Ana sayfadaki bilgi kartlarını yönetin
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setAdding(true); setNewItem({ ...EMPTY }) }}
          className="h-10 bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
        >
          + Yeni Ekle
        </button>
      </div>

      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">❌ {error}</div>
      )}

      {/* Yeni öğe formu */}
      {adding && (
        <div className="mb-6 border border-zinc-300 bg-white p-5">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Yeni Öğe</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">İkon</label>
              <select
                value={newItem.icon}
                onChange={(e) => setNewItem((p) => ({ ...p, icon: e.target.value as TrustIcon }))}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Sıra</label>
              <input
                type="number"
                value={newItem.sort_order}
                onChange={(e) => setNewItem((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Başlık</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))}
                placeholder="Hızlı Gönderim"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Açıklama</label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
                placeholder="Siparişleriniz hızlıca teslim edilir."
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={newItem.is_active}
              onChange={(e) => setNewItem((p) => ({ ...p, is_active: e.target.checked }))}
              className="h-4 w-4"
            />
            Sitede görünür
          </label>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving === "new"}
              className="h-10 bg-zinc-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving === "new" ? "Ekleniyor..." : "Ekle"}
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

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-zinc-400">
          Henüz öğe yok. &quot;+ Yeni Ekle&quot; ile başlayın.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-zinc-200 bg-white p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">İkon</label>
                  <select
                    value={item.icon}
                    onChange={(e) => updateLocal(item.id, "icon", e.target.value as TrustIcon)}
                    className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                  >
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Sıra</label>
                  <input
                    type="number"
                    value={item.sort_order}
                    onChange={(e) => updateLocal(item.id, "sort_order", parseInt(e.target.value) || 0)}
                    className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Başlık</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateLocal(item.id, "title", e.target.value)}
                    className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Açıklama</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLocal(item.id, "description", e.target.value)}
                    className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={(e) => updateLocal(item.id, "is_active", e.target.checked)}
                    className="h-4 w-4"
                  />
                  Sitede görünür
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={saving === item.id}
                    className="h-9 border border-red-200 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    Sil
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(item)}
                    disabled={saving === item.id}
                    className="h-9 bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
                  >
                    {saving === item.id ? "Kaydediliyor..." : "Kaydet"}
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
