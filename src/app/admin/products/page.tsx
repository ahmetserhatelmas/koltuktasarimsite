"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product, ProductCategory } from "@/lib/supabase/types"
import { CATEGORY_LABELS } from "@/lib/supabase/types"

type CategoryTab = { value: string; label: string }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProductCategory | "all">("all")
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryTab[]>([{ value: "all", label: "Tümü" }])

  async function loadCategories() {
    const supabase = createClient()
    const { data } = await supabase
      .from("categories")
      .select("slug, label")
      .eq("is_active", true)
      .order("sort_order")
    if (data && data.length > 0) {
      setCategories([
        { value: "all", label: "Tümü" },
        ...data.map((c) => ({ value: c.slug, label: c.label })),
      ])
    }
  }

  async function load() {
    setLoading(true)
    const supabase = createClient()
    let q = supabase
      .from("products")
      .select("*")
      .order("category")
      .order("sort_order")

    if (filter !== "all") q = q.eq("category", filter)
    if (search) q = q.ilike("name", `%${search}%`)

    const { data } = await q
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search])

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return
    setDeleting(id)
    const supabase = createClient()
    await supabase.from("products").delete().eq("id", id)
    await load()
    setDeleting(null)
  }

  async function toggleActive(product: Product) {
    const supabase = createClient()
    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id)
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      )
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ürünler</h1>
          <p className="mt-1 text-sm text-zinc-500">{products.length} ürün listeleniyor</p>
        </div>
        <Link
          href="/admin/products/new"
          className="h-10 bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 inline-flex items-center"
        >
          + Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex gap-1">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={`h-8 px-3 text-xs font-semibold transition ${
                filter === c.value
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün ara..."
          className="h-8 flex-1 min-w-[200px] border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-sm text-zinc-400">Ürün bulunamadı.</div>
      ) : (
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="w-16 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Görsel
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Ürün Adı
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Fiyat
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Foto
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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-zinc-100 transition hover:bg-zinc-50"
                >
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 border border-zinc-100 bg-zinc-50">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                          unoptimized={product.image_url.startsWith("http")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900 line-clamp-2">{product.name}</p>
                    <p className="text-xs text-zinc-400">{product.id}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    <p>{CATEGORY_LABELS[product.category]}</p>
                    {(() => {
                      const p = product as typeof product & { colors?: { name: string; hex: string }[] }
                      if (!p.colors?.length) return null
                      return (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.colors.map((c, i) => (
                            <span key={i} className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-600">
                              <span className="h-2.5 w-2.5 rounded-full border border-zinc-300 inline-block" style={{ backgroundColor: c.hex }} />
                              {c.name}
                            </span>
                          ))}
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {product.quote_only
                      ? "Teklif"
                      : product.price > 0
                      ? `₺${product.price.toLocaleString("tr-TR")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const p = product as typeof product & { gallery_images?: string[] }
                      const total = (p.image_url ? 1 : 0) + (p.gallery_images?.length ?? 0)
                      return (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${total === 0 ? "text-red-500" : "text-zinc-500"}`}>
                          🖼 {total}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(product)}
                      className={`inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold transition ${
                        product.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                    >
                      {product.is_active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="h-7 border border-zinc-200 px-3 text-xs text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 inline-flex items-center"
                      >
                        Düzenle
                      </Link>
                      <button
                        type="button"
                        disabled={deleting === product.id}
                        onClick={() => handleDelete(product.id)}
                        className="h-7 border border-zinc-200 px-3 text-xs text-red-500 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === product.id ? "..." : "Sil"}
                      </button>
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
