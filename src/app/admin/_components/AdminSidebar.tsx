"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const NAV = [
  { href: "/admin", label: "Özet", icon: "⊞" },
  { href: "/admin/products", label: "Ürünler", icon: "◫" },
  { href: "/admin/sliders", label: "Slider", icon: "▦" },
  { href: "/admin/categories", label: "Kategoriler", icon: "⊟" },
  { href: "/admin/featured", label: "Öne Çıkanlar", icon: "★" },
  { href: "/admin/settings", label: "Ayarlar", icon: "⚙" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Koltuk Dünyası
        </p>
        <p className="mt-0.5 text-sm font-bold text-zinc-900">Admin Paneli</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-9 items-center gap-3 rounded px-3 text-sm transition ${
                active
                  ? "bg-zinc-900 font-semibold text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-200 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex h-9 items-center gap-3 rounded px-3 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <span className="text-xs">↗</span>
          Siteyi Gör
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-0.5 flex h-9 w-full items-center gap-3 rounded px-3 text-left text-sm text-zinc-500 transition hover:bg-red-50 hover:text-red-700"
        >
          <span className="text-xs">⏻</span>
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
