import { BrandStory } from "@/components/home/BrandStory";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { ProjectsStrip } from "@/components/home/ProjectsStrip";
import { TrustBar } from "@/components/home/TrustBar";
import { homeFeatured } from "@/lib/products";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <CategoryShowcase />
      <TrustBar />
      <ProductCarousel
        id="one-cikan"
        title="Öne çıkan ürünler"
        subtitle="KoltukDunyam klasörünüzdeki modellerden seçilmiş vitrin."
        products={homeFeatured}
      />
      <ProjectsStrip />
      <BrandStory />
    </main>
  );
}
