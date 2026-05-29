"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { NavItem } from "@/lib/supabase/types"

type QuickOption = { label: string; href: string; group: string }

const EMPTY = { label: "", href: "", sort_order: 0, is_active: true }

/** İç linkler / ile, dış linkler http(s):// ile başlamalı */
function normalizeNavHref(href: string): string {
  const trimmed = href.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith("/")) return trimmed
  if (trimmed.startsWith("#")) return `/${trimmed}`
  return `/${trimmed}`
}

function validateNavHref(href: string): string | null {
  const normalized = normalizeNavHref(href)
  if (!normalized) return "Link zorunlu."
  if (/^https?:\/\//i.test(normalized)) return null
  if (!normalized.startsWith("/")) {
    return "Link / ile başlamalı (örn. /konferans-sandalyeleri) veya https:// ile dış site."
  }
  return null
}

const LINK_HINT =
  "Site içi: /konferans-sandalyeleri, /sayfa/hakkimizda, /#projeler, /iletisim — Dış site: https://..."

export default function AdminNavPage() {
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ ...EMPTY })
  const [quickOptions, setQuickOptions] = useState<QuickOption[]>([])

  // Kategoriler + sayfalar çek
  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from("categories").select("label, slug, route").eq("is_active", true).order("sort_order"),
      supabase.from("content_pages").select("title, slug, link_url").eq("is_active", true).order("section").order("sort_order"),
    ]).then(([{ data: cats }, { data: pages }]) => {
      const opts: QuickOption[] = []
      for (const c of (cats ?? [])) {
        opts.push({ label: c.label, href: c.route || `/${c.slug}`, group: "Kategori" })
      }
      for (const p of (pages ?? [])) {
        opts.push({ label: p.title, href: p.link_url || `/sayfa/${p.slug}`, group: "Sayfa" })
      }
      setQuickOptions(opts)
    })
  }, [])

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("nav_items")
      .select("*")
      .order("sort_order")
    setItems((data ?? []) as NavItem[])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  async function handleSave(item: NavItem) {
    const hrefErr = validateNavHref(item.href)
    if (hrefErr) { setError(hrefErr); return }

    setSaving(item.id)
    setError("")
    const href = normalizeNavHref(item.href)
    const supabase = createClient()
    const { error: err } = await supabase
      .from("nav_items")
      .update({
        label: item.label.trim(),
        href,
        sort_order: item.sort_order,
        is_active: item.is_active,
      })
      .eq("id", item.id)
    if (err) setError(err.message)
    else await load()
    setSaving(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu menü öğesini silmek istediğinizden emin misiniz?")) return
    setSaving(id)
    const supabase = createClient()
    const { error: err } = await supabase.from("nav_items").delete().eq("id", id)
    if (err) setError(err.message)
    else await load()
    setSaving(null)
  }

  async function handleAdd() {
    if (!newItem.label.trim()) { setError("İsim zorunlu."); return }
    const hrefErr = validateNavHref(newItem.href)
    if (hrefErr) { setError(hrefErr); return }
    setSaving("new")
    setError("")
    const href = normalizeNavHref(newItem.href)
    const supabase = createClient()
    const { error: err } = await supabase.from("nav_items").insert({
      label: newItem.label.trim(),
      href,
      sort_order: newItem.sort_order || items.length + 1,
      is_active: newItem.is_active,
    })
    if (err) { setError(err.message); setSaving(null); return }
    setNewItem({ ...EMPTY })
    setAdding(false)
    await load()
    setSaving(null)
  }

  function updateLocal(id: string, field: keyof NavItem, value: unknown) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Navigasyon Menüsü</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Header'daki menü linklerini yönetin — isim, link ve sıra değiştirilebilir
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setAdding(true); setNewItem({ ...EMPTY, sort_order: items.length + 1 }) }}
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
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Yeni Menü Öğesi</h2>

          {/* Hızlı Seç */}
          {quickOptions.length > 0 && (
            <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Kategori veya Sayfadan Hızlı Seç
              </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  const opt = quickOptions.find((o) => o.href === e.target.value)
                  if (opt) setNewItem((p) => ({ ...p, label: opt.label, href: opt.href }))
                }}
                className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-900"
              >
                <option value="" disabled>— Seçin —</option>
                <optgroup label="Kategoriler">
                  {quickOptions.filter((o) => o.group === "Kategori").map((o) => (
                    <option key={o.href} value={o.href}>{o.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Sayfalar">
                  {quickOptions.filter((o) => o.group === "Sayfa").map((o) => (
                    <option key={o.href} value={o.href}>{o.label}</option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-1 text-xs text-zinc-400">Seçince isim ve link alanları otomatik dolar, istersen düzenleyebilirsin.</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Menü İsmi
              </label>
              <input
                type="text"
                value={newItem.label}
                onChange={(e) => setNewItem((p) => ({ ...p, label: e.target.value }))}
                placeholder="Konferans Sandalyeleri"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Link
              </label>
              <input
                type="text"
                value={newItem.href}
                onChange={(e) => setNewItem((p) => ({ ...p, href: e.target.value }))}
                placeholder="/konferans-sandalyeleri"
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
              <p className="mt-1 text-xs text-zinc-400">{LINK_HINT}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Sıra
              </label>
              <input
                type="number"
                value={newItem.sort_order}
                onChange={(e) => setNewItem((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
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
            Menüde görünür
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
          Menü öğesi yok. &quot;+ Yeni Ekle&quot; ile başlayın.
        </div>
      ) : (
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Sıra</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Menü İsmi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Link</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Durum</th>
                <th className="w-40 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100">
                  <td className="px-4 py-2 w-20">
                    <input
                      type="number"
                      value={item.sort_order}
                      onChange={(e) => updateLocal(item.id, "sort_order", parseInt(e.target.value) || 0)}
                      className="h-8 w-16 border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-900"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateLocal(item.id, "label", e.target.value)}
                      className="h-8 w-full border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-900"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateLocal(item.id, "href", e.target.value)}
                      className="h-8 w-full border border-zinc-200 px-2 text-sm text-zinc-500 outline-none focus:border-zinc-900"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-600">
                      <input
                        type="checkbox"
                        checked={item.is_active}
                        onChange={(e) => updateLocal(item.id, "is_active", e.target.checked)}
                        className="h-4 w-4"
                      />
                      Görünür
                    </label>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={saving === item.id}
                        className="h-8 border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        Sil
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(item)}
                        disabled={saving === item.id}
                        className="h-8 bg-zinc-900 px-4 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60"
                      >
                        {saving === item.id ? "..." : "Kaydet"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-zinc-100 px-4 py-3 text-xs text-zinc-400">
            💡 Link mutlaka gerçek bir sayfa olmalı. Yeni içerik için önce <strong>Sayfalar</strong> bölümünden sayfa oluşturun, link olarak <code className="bg-zinc-100 px-1">/sayfa/slug</code> yazın. {LINK_HINT}
          </p>
        </div>
      )}
    </div>
  )
}
