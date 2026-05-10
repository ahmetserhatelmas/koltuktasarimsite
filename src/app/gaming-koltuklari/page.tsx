import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { gamingListing } from "@/lib/products";
import { SITE_NAME } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Gaming Koltukları | ${SITE_NAME}`,
  description: "Gaming koltukları — demo katalog.",
};

export default function GamingChairsPage() {
  return (
    <main className="flex-1 bg-white">
      <CatalogView title="Gaming Koltukları" products={gamingListing} />
    </main>
  );
}
