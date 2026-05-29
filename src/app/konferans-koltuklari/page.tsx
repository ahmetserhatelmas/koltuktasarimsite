import { CatalogPage } from "@/components/catalog/CatalogPage"
import { createClient } from "@/lib/supabase/server"
import { getLocale } from "@/lib/i18n/server"
import { getDict } from "@/lib/i18n/dict"
import type { CatalogProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Konferans Koltukları",
}

export default async function KonferansKoltuklariPage() {
  const locale = await getLocale()
  const t = getDict(locale)
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", "konferans-koltuklari")
    .eq("is_active", true)
    .order("sort_order")

  const products: CatalogProduct[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.image_url ?? "",
    price: p.price ?? 0,
    oldPrice: p.old_price ?? 0,
    quoteOnly: p.quote_only,
    translations: p.translations ?? {},
  }))

  return <CatalogPage title={t.category["konferans-koltuklari"]} products={products} />
}
