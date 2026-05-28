import { CatalogPage } from "@/components/catalog/CatalogPage"
import { createClient } from "@/lib/supabase/server"
import type { CatalogProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Konferans Sandalyeleri",
}

export default async function KonferansSandalyeleriPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", "konferans-sandalyeleri")
    .eq("is_active", true)
    .order("sort_order")

  const products: CatalogProduct[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.image_url ?? "",
    price: p.price ?? 0,
    oldPrice: p.old_price ?? 0,
    quoteOnly: p.quote_only,
  }))

  return <CatalogPage title="Konferans Sandalyeleri" products={products} />
}
