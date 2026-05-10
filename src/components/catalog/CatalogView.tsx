"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatTry } from "@/lib/format";
import { productDetailHref } from "@/lib/product-lookup";
import type { CatalogProduct } from "@/lib/products";

const categories = [
  ["Ofis Sandalyeleri", "/ofis-sandalyeleri"],
  ["Gaming Koltukları", "/gaming-koltuklari"],
  ["Konferans Koltukları", "/#konferans"],
  ["Sandalye & Bar Tabure", "/#bar"],
  ["Akustik Paneller", "/#akustik"],
] as const;

const sortOptions = [
  { value: "default", label: "Önerilen sıralama" },
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
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("default");

  const filtered = useMemo(() => {
    const minV = min === "" ? undefined : Number(min);
    const maxV = max === "" ? undefined : Number(max);
    let list = products.filter((p) => {
      if (minV !== undefined && !Number.isNaN(minV) && p.price < minV) return false;
      if (maxV !== undefined && !Number.isNaN(maxV) && p.price > maxV) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return list;
  }, [products, min, max, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:flex lg:gap-10 lg:px-8 lg:py-12">
      <aside className="mb-8 shrink-0 lg:mb-0 lg:w-64">
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <p className="text-sm font-semibold text-zinc-900">{title}</p>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Kategoriler</p>
            <ul className="mt-3 space-y-2">
              {categories.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-zinc-700 transition hover:text-zinc-950">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 border-t border-zinc-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Fiyat aralığı</p>
            <div className="mt-3 flex gap-2">
              <label className="flex-1 text-xs text-zinc-600">
                En az
                <input
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 h-10 w-full rounded-lg border border-zinc-200 px-2 text-sm text-zinc-900 outline-none focus:border-zinc-300"
                  placeholder="0"
                />
              </label>
              <label className="flex-1 text-xs text-zinc-600">
                En çok
                <input
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 h-10 w-full rounded-lg border border-zinc-200 px-2 text-sm text-zinc-900 outline-none focus:border-zinc-300"
                  placeholder="∞"
                />
              </label>
            </div>
            <button
              type="button"
              className="mt-4 h-10 w-full rounded-lg bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-800"
              onClick={() => {
                /* state-driven; no-op triggers re-render for clarity in demo */
              }}
            >
              Ara
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl text-zinc-900 sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{filtered.length} ürün var</p>
          </div>
          <label className="text-sm text-zinc-600">
            <span className="sr-only">Sıralama</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="mt-1 h-11 w-full rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition focus:border-zinc-300 sm:mt-0 sm:w-auto"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={productDetailHref(p.id)}
              className="group flex flex-col rounded-3xl border border-zinc-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[3/4] min-h-[200px] overflow-hidden rounded-2xl border border-zinc-100/80 bg-white sm:min-h-[240px] sm:rounded-3xl">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain object-center p-1 transition duration-500 group-hover:scale-[1.03] sm:p-1.5 sm:scale-[1.06]"
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                />
              </div>
              <div className="mt-2 flex justify-center gap-1.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2 w-2 rounded-full bg-zinc-300/90" />
                ))}
              </div>
              <h2 className="mt-3 line-clamp-2 min-h-[2.5rem] text-center text-xs font-medium text-zinc-800 sm:text-sm">
                {p.name}
              </h2>
              <div className="mt-auto pt-3 text-center">
                <p className="text-xs text-zinc-400 line-through">{formatTry(p.oldPrice)}</p>
                <p className="text-sm font-semibold text-zinc-900 sm:text-base">{formatTry(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
