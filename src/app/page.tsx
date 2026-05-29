import { BrandStory } from "@/components/home/BrandStory"
import { CategoryShowcase } from "@/components/home/CategoryShowcase"
import { HeroSlider } from "@/components/home/HeroSlider"
import { ProductCarousel } from "@/components/home/ProductCarousel"
import { ProjectsStrip } from "@/components/home/ProjectsStrip"
import { TrustBar, type TrustItem } from "@/components/home/TrustBar"
import { getLocale } from "@/lib/i18n/server"
import { getDict } from "@/lib/i18n/dict"
import { createClient } from "@/lib/supabase/server"
import type { Category, Slider } from "@/lib/supabase/types"
import type { CatalogProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()
  const locale = await getLocale()
  const t = getDict(locale)

  const [
    { data: slidersRaw },
    { data: categoriesRaw },
    { data: featuredRaw },
    { data: trustRaw },
    { data: settingsRaw },
  ] = await Promise.all([
    supabase.from("sliders").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("categories").select("*").eq("is_featured", true).eq("is_active", true).order("sort_order"),
    supabase.from("featured_products").select("*, products(*)").order("sort_order"),
    supabase.from("trust_items").select("*").order("sort_order"),
    supabase.from("settings").select("key, value").in("key", [
      "brand_title", "brand_text",
      `brand_title_${locale}`, `brand_text_${locale}`,
    ]),
  ])

  const sliders: Slider[] = slidersRaw ?? []
  const categories: Category[] = categoriesRaw ?? []
  const trustItems: TrustItem[] = (trustRaw ?? []) as TrustItem[]

  const settingsMap = Object.fromEntries((settingsRaw ?? []).map((s) => [s.key, s.value]))
  const brandTitle = settingsMap[`brand_title_${locale}`] || settingsMap["brand_title"] || t.home.brand_title
  const brandText  = settingsMap[`brand_text_${locale}`]  || settingsMap["brand_text"]  || t.home.brand_text

  const featuredProducts: CatalogProduct[] =
    (featuredRaw ?? [])
      .filter((f) => f.products && f.products.is_active)
      .map((f) => ({
        id: f.products.id,
        name: f.products.name,
        image: f.products.image_url ?? "",
        price: f.products.price ?? 0,
        oldPrice: f.products.old_price ?? 0,
        quoteOnly: f.products.quote_only,
        translations: f.products.translations ?? {},
      }))

  return (
    <main className="flex-1">
      <HeroSlider slides={sliders} />
      <CategoryShowcase categories={categories} />
      <TrustBar items={trustItems} />
      <ProductCarousel
        id="one-cikan"
        title={t.home.featured}
        subtitle={t.home.featured_sub}
        products={featuredProducts}
      />
      <ProjectsStrip />
      <BrandStory title={brandTitle} text={brandText} />
    </main>
  )
}
