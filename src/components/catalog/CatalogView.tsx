"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { ProductCard } from "@/components/ui/ProductCard";
import type { CatalogProduct } from "@/lib/products";

const sortOptions = [
  { value: "default", label: "Sıralama seçiniz" },
  { value: "price-asc", label: "Fiyat (Artan)" },
  { value: "price-desc", label: "Fiyat (Azalan)" },
  { value: "name", label: "İsim (A-Z)" },
] as const;

export function CatalogView({
  title,
  products,
}: {
  title: string;
  products: CatalogProduct[];
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("default");

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
      <p className="mt-1 text-sm text-zinc-600">{filtered.length} ürün</p>

      <div className="mt-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className="inline-flex h-11 items-center gap-2 border border-zinc-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-zinc-900 transition hover:border-zinc-900"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          Filtreleme
        </button>
        <label className="w-full sm:w-auto">
          <span className="sr-only">Sıralama</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
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
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Kategoriler</p>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <a href={c.href} className="text-sm text-zinc-700 hover:text-zinc-950">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Fiyat aralığı</p>
            <div className="mt-3 flex max-w-md gap-2">
              <input
                value={min}
                onChange={(e) => setMin(e.target.value)}
                inputMode="numeric"
                placeholder="En az"
                className="h-10 flex-1 border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
              <input
                value={max}
                onChange={(e) => setMax(e.target.value)}
                inputMode="numeric"
                placeholder="En çok"
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
