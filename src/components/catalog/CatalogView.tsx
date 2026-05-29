"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { ProductCard } from "@/components/ui/ProductCard";
import type { CatalogProduct } from "@/lib/products";
import { useI18n } from "@/lib/i18n/context";

export function CatalogView({
  title,
  products,
}: {
  title: string;
  products: CatalogProduct[];
}) {
  const { t } = useI18n();
  const [filterOpen, setFilterOpen] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  type SortValue = "default" | "price-asc" | "price-desc" | "name";
  const [sort, setSort] = useState<SortValue>("default");

  const sortOptions: { value: SortValue; label: string }[] = [
    { value: "default", label: t.catalog.sort },
    { value: "price-asc", label: t.catalog.sort_price_asc },
    { value: "price-desc", label: t.catalog.sort_price_desc },
    { value: "name", label: t.catalog.sort_name },
  ];

  const filtered = useMemo(() => {
    const minV = min === "" ? undefined : Number(min);
    const maxV = max === "" ? undefined : Number(max);
    let list = products.filter((p) => {
      if (p.quoteOnly) return true;
      if (minV !== undefined && !Number.isNaN(minV) && p.price < minV) return false;
      if (maxV !== undefined && !Number.isNaN(maxV) && p.price > maxV) return false;
      return true;
    });
    if (sort === "price-asc")
      list = [...list].sort((a, b) => (a.quoteOnly ? 1 : a.price) - (b.quoteOnly ? 1 : b.price));
    if (sort === "price-desc")
      list = [...list].sort((a, b) => (b.quoteOnly ? -1 : b.price) - (a.quoteOnly ? -1 : a.price));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return list;
  }, [products, min, max, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-[var(--accent)] sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-zinc-600">{t.catalog.products_count.replace("{n}", String(filtered.length))}</p>

      <div className="mt-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className="inline-flex h-11 items-center gap-2 border border-zinc-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-zinc-900 transition hover:border-zinc-900"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          {t.catalog.filter}
        </button>
        <label className="w-full sm:w-auto">
          <span className="sr-only">{t.catalog.sort}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="h-11 w-full border border-zinc-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-zinc-900 outline-none transition focus:border-zinc-900 sm:min-w-[220px]"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filterOpen ? (
        <div className="mb-8 grid gap-6 border border-zinc-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t.catalog.categories}</p>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <a href={c.href} className="text-sm text-zinc-700 hover:text-zinc-950">
                    {(t.category as Record<string, string>)[c.slug] || c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t.catalog.price_range}</p>
            <div className="mt-3 flex max-w-md gap-2">
              <input
                value={min}
                onChange={(e) => setMin(e.target.value)}
                inputMode="numeric"
                placeholder={t.catalog.min}
                className="h-10 flex-1 border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
              <input
                value={max}
                onChange={(e) => setMax(e.target.value)}
                inputMode="numeric"
                placeholder={t.catalog.max}
                className="h-10 flex-1 border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
