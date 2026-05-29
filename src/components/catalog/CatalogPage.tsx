import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { CatalogProduct } from "@/lib/products";
import { getLocale } from "@/lib/i18n/server";
import { getDict } from "@/lib/i18n/dict";

export async function CatalogPage({
  title,
  products,
  breadcrumbParent,
}: {
  title: string;
  products: CatalogProduct[];
  breadcrumbParent?: { label: string; href: string };
}) {
  const locale = await getLocale();
  const t = getDict(locale);

  return (
    <main className="flex-1 bg-[var(--surface)]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: t.breadcrumb.home, href: "/" },
              ...(breadcrumbParent
                ? [{ label: breadcrumbParent.label, href: breadcrumbParent.href }]
                : []),
              { label: title },
            ]}
          />
        </div>
      </div>
      <CatalogView title={title} products={products} />
    </main>
  );
}
