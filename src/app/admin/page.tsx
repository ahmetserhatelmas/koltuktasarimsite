import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: sliderCount },
    { count: featuredCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("sliders").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("featured_products").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Aktif Ürün", value: productCount ?? 0, href: "/admin/products" },
    { label: "Aktif Slider", value: sliderCount ?? 0, href: "/admin/sliders" },
    { label: "Öne Çıkan Ürün", value: featuredCount ?? 0, href: "/admin/featured" },
  ]

  const sections = [
    {
      href: "/admin/products",
      title: "Ürün Yönetimi",
      desc: "Yeni ürün ekle, mevcut ürünleri düzenle veya sil. Görsel, fiyat, açıklama ve özellikler.",
      icon: "◫",
    },
    {
      href: "/admin/sliders",
      title: "Hero Slider",
      desc: "Ana sayfadaki büyük slider fotoğraflarını ve yazılarını yönet.",
      icon: "▦",
    },
    {
      href: "/admin/categories",
      title: "Kategoriler",
      desc: "Kategori görselleri, etiketler ve öne çıkan kategorileri düzenle.",
      icon: "⊟",
    },
    {
      href: "/admin/featured",
      title: "Öne Çıkan Ürünler",
      desc: "Ana sayfada gösterilecek ürünleri seç ve sırala.",
      icon: "★",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Kontrol Paneli</h1>
        <p className="mt-1 text-sm text-zinc-500">Koltuk Dünyası yönetim ekranı</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group border border-zinc-200 bg-white p-5 transition hover:border-zinc-900"
          >
            <p className="text-3xl font-bold text-zinc-900">{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition group-hover:text-zinc-900">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Sections */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex gap-4 border border-zinc-200 bg-white p-6 transition hover:border-zinc-900"
          >
            <span className="mt-0.5 text-2xl">{s.icon}</span>
            <div>
              <p className="font-semibold text-zinc-900 transition group-hover:text-zinc-600">
                {s.title}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
