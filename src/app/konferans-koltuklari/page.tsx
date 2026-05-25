import { CatalogPage } from "@/components/catalog/CatalogPage";
import { konferansKoltuklariListing } from "@/lib/products";

export const metadata = {
  title: "Konferans Koltukları",
};

export default function KonferansKoltuklariPage() {
  return (
    <CatalogPage title="Konferans Koltukları" products={konferansKoltuklariListing} />
  );
}
