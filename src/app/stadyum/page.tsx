import { CatalogPage } from "@/components/catalog/CatalogPage";
import { stadyumListing } from "@/lib/products";

export const metadata = {
  title: "Stadyum Koltukları",
};

export default function StadyumPage() {
  return (
    <CatalogPage
      title="Stadyum Koltukları"
      products={stadyumListing}
      breadcrumbParent={{ label: "Kategoriler", href: "/" }}
    />
  );
}
