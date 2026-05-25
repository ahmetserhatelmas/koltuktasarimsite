import { CatalogPage } from "@/components/catalog/CatalogPage";
import { konferansSandalyeleriListing } from "@/lib/products";

export const metadata = {
  title: "Konferans Sandalyeleri",
};

export default function KonferansSandalyeleriPage() {
  return (
    <CatalogPage title="Konferans Sandalyeleri" products={konferansSandalyeleriListing} />
  );
}
