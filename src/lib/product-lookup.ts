import type { CatalogProduct } from "@/lib/products";
import {
  dealProducts,
  featuredRound,
  gamingListing,
  newArrivals,
  officeListing,
} from "@/lib/products";

const allLists: CatalogProduct[][] = [
  featuredRound,
  dealProducts,
  newArrivals,
  officeListing,
  gamingListing,
];

function buildProductMap(): Map<string, CatalogProduct> {
  const map = new Map<string, CatalogProduct>();
  for (const list of allLists) {
    for (const p of list) {
      map.set(p.id, p);
    }
  }
  return map;
}

const productMap = buildProductMap();

export function getProductById(id: string): CatalogProduct | undefined {
  return productMap.get(id);
}

export function getAllProductIds(): string[] {
  return Array.from(productMap.keys());
}

export function productDetailHref(id: string): string {
  return `/urun/${encodeURIComponent(id)}`;
}
