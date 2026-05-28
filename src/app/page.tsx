import { BrandStory } from "@/components/home/BrandStory"
import { CategoryShowcase } from "@/components/home/CategoryShowcase"
import { HeroSlider } from "@/components/home/HeroSlider"
import { ProductCarousel } from "@/components/home/ProductCarousel"
import { ProjectsStrip } from "@/components/home/ProjectsStrip"
import { TrustBar } from "@/components/home/TrustBar"
import { createClient } from "@/lib/supabase/server"
import type { Category, Slider } from "@/lib/supabase/types"
import type { CatalogProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: slidersRaw },
    { data: categoriesRaw },
    { data: featuredRaw },
  ] = await Promise.all([
    supabase
      .from("sliders")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("categories")
      .select("*")
      .eq("is_featured", true)
      .order("sort_order"),
    supabase
      .from("featured_products")
      .select("*, products(*)")
      .order("sort_order"),
  ])

  const sliders: Slider[] = slidersRaw ?? []
  const categories: Category[] = categoriesRaw ?? []

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
      }))

  return (
    <main className="flex-1">
      <HeroSlider slides={sliders} />
      <CategoryShowcase categories={categories} />
      <TrustBar />
      <ProductCarousel
        id="one-cikan"
        title="Öne çıkan ürünler"
        subtitle="Koltuk Dünyası klasöründeki modellerden seçilmiş vitrin."
        products={featuredProducts}
      />
      <ProjectsStrip />
      <BrandStory />
    </main>
  )
}
