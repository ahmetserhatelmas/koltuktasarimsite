import { BlogGrid } from "@/components/home/BlogGrid";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { FlagStrip } from "@/components/home/FlagStrip";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { dealProducts, featuredRound, newArrivals } from "@/lib/products";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <CategoryCircles items={featuredRound} />
      <TrustBar />
      <ProductCarousel
        id="firsat"
        title="Fırsat Ürünleri"
        subtitle="İndirimli ürün fiyatlarını kaçırmayın."
        products={dealProducts}
      />
      <ProductCarousel
        id="yeni-gelenler"
        title="Yeni Gelenler"
        subtitle="En yeni ürünlerimizi inceleyin."
        products={newArrivals}
      />
      <FlagStrip />
      <BlogGrid />
      <BrandStory />
    </main>
  );
}
