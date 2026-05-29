import { notFound } from "next/navigation"
import { CatalogPage } from "@/components/catalog/CatalogPage"
import { createClient } from "@/lib/supabase/server"
import { getLocale } from "@/lib/i18n/server"
import type { CatalogProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("label")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single()

  return { title: data?.label ?? categorySlug }
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params
  const locale = await getLocale()
  const supabase = await createClient()

  // Kategoriyi DB'den bul
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single()

  if (!category) notFound()

  // O kategorideki ürünleri çek
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", categorySlug)
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

  // Dile göre kategori başlığı
  const translations = (category.translations ?? {}) as Record<string, { label?: string }>
  const title = translations[locale]?.label || category.label

  return <CatalogPage title={title} products={products} />
}
