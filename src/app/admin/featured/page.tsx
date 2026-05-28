"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { FeaturedProductWithProduct, Product } from "@/lib/supabase/types"
import { CATEGORY_LABELS } from "@/lib/supabase/types"

export default function AdminFeaturedPage() {
  const [featured, setFeatured] = useState<FeaturedProductWithProduct[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")
  const [adding, setAdding] = useState(false)

  async function load() {
    const supabase = createClient()
    const [{ data: feat }, { data: prods }] = await Promise.all([
      supabase
        .from("featured_products")
        .select("*, products(*)")
        .order("sort_order"),
      supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("sort_order"),
    ])
    setFeatured((feat as FeaturedProductWithProduct[]) ?? [])
    setAllProducts(prods ?? [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  async function handleRemove(id: string) {
    if (!confirm("Bu ürünü öne çıkanlardan kaldırmak istediğinize emin misiniz?")) return
    const supabase = createClient()
    await supabase.from("featured_products").delete().eq("id", id)
    setFeatured((prev) => prev.filter((f) => f.id !== id))
  }

  async function handleAdd(productId: string) {
    setAdding(true)
    const supabase = createClient()
    const { error } = await supabase.from("featured_products").insert({
      product_id: productId,
      sort_order: featured.length,
    })
    if (!error) {
      await load()
      setShowPicker(false)
      setPickerSearch("")
    }
    setAdding(false)
  }

  async function updateSortOrder(id: string, newOrder: number) {
    const supabase = createClient()
    await supabase
      .from("featured_products")
      .update({ sort_order: newOrder })
      .eq("id", id)
    setFeatured((prev) =>
      prev.map((f) => (f.id === id ? { ...f, sort_order: newOrder } : f))
        .sort((a, b) => a.sort_order - b.sort_order)
    )
  }

  const featuredIds = new Set(featured.map((f) => f.product_id))
  const availableProducts = allProducts.filter(
    (p) =>
      !featuredIds.has(p.id) &&
      (pickerSearch === "" ||
        p.name.toLowerCase().includes(pickerSearch.toLowerCase()))
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Öne Çıkan Ürünler</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Ana sayfada gösterilecek ürünler ({featured.length} ürün)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="h-10 bg-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 inline-flex items-center"
        >
          + Ürün Ekle
        </button>
      </div>

      {/* Product Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-5">
              <h2 className="font-bold text-zinc-900">Ürün Seç</h2>
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="text-2xl text-zinc-400 hover:text-zinc-900"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <input
                type="search"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Ürün ara..."
                className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                autoFocus
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {availableProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-400">
                  Eklenecek ürün bulunamadı.
                </p>
              ) : (
                availableProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    disabled={adding}
                    onClick={() => handleAdd(product.id)}
                    className="flex w-full items-center gap-3 border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-zinc-50 disabled:opacity-60"
                  >
                    <div className="relative h-10 w-10 shrink-0 border border-zinc-100 bg-zinc-50">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                          sizes="40px"
                          unoptimized={product.image_url.startsWith("http")}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {CATEGORY_LABELS[product.category]}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-400">Ekle →</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : featured.length === 0 ? (
        <div className="py-12 text-center text-sm text-zinc-400">
          Henüz öne çıkan ürün yok.
        </div>
      ) : (
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="w-16 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Görsel
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Ürün
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Kategori
                </th>
                <th className="w-32 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Sıra
                </th>
                <th className="w-20 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {featured.map((item) => {
                const p = item.products
                return (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 border border-zinc-100 bg-zinc-50">
                        {p?.image_url && (
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                            unoptimized={p.image_url.startsWith("http")}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900 line-clamp-2">
                        {p?.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {p ? CATEGORY_LABELS[p.category] : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.sort_order}
                        onChange={(e) =>
                          updateSortOrder(item.id, parseInt(e.target.value) || 0)
                        }
                        className="h-8 w-20 border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-900"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="h-7 border border-zinc-200 px-3 text-xs text-red-500 hover:border-red-300 hover:bg-red-50"
                      >
                        Kaldır
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
