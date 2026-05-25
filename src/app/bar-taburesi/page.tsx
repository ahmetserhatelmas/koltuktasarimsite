import { CatalogPage } from "@/components/catalog/CatalogPage";
import { barListing } from "@/lib/products";

export const metadata = {
  title: "Bar Taburesi",
};

export default function BarTaburePage() {
  return <CatalogPage title="Bar Taburesi" products={barListing} />;
}
