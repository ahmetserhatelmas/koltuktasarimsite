import { createClient } from "@/lib/supabase/server"
import { NAV_MAIN } from "@/lib/site-data"
import type { NavItem } from "@/lib/supabase/types"

export type NavLink = { label: string; href: string }

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("nav_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    if (data && data.length > 0) return data as NavItem[]
  } catch {
    // fallback below
  }

  return NAV_MAIN.map((item, i) => ({
    id: item.href,
    label: item.label,
    href: item.href,
    sort_order: i + 1,
    is_active: true,
    created_at: "",
  }))
}

export async function getNavLinks(): Promise<NavLink[]> {
  const items = await getNavItems()
  return items.map((item) => ({ label: item.label, href: item.href }))
}
