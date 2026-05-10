import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { officeListing } from "@/lib/products";
import { SITE_NAME } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Ofis Sandalyeleri | ${SITE_NAME}`,
  description: "Ofis ve çalışma sandalyeleri — demo katalog.",
};

export default function OfficeChairsPage() {
  return (
    <main className="flex-1 bg-white">
      <CatalogView title="Ofis Sandalyeleri" products={officeListing} />
    </main>
  );
}
