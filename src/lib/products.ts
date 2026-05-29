import manifest from "@/lib/products-manifest.json";

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  oldPrice: number;
  price: number;
  quoteOnly?: boolean;
  translations?: Partial<Record<string, { name?: string }>>;
};

type ManifestItem = {
  id: string;
  name: string;
  image: string;
  quoteOnly?: boolean;
};

function toProduct(item: ManifestItem): CatalogProduct {
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    oldPrice: 0,
    price: 0,
    quoteOnly: true,
  };
}

export const barListing: CatalogProduct[] = manifest.bar.map(toProduct);

export const konferansSandalyeleriListing: CatalogProduct[] =
  manifest.konferansSandalyeleri.map(toProduct);

export const konferansKoltuklariListing: CatalogProduct[] =
  manifest.konferansKoltuklari.map(toProduct);

/** Tüm konferans ürünleri (iki klasör birleşik) */
export const konferansListing: CatalogProduct[] = [
  ...konferansSandalyeleriListing,
  ...konferansKoltuklariListing,
];

export const stadyumListing: CatalogProduct[] = manifest.stadyum.map(toProduct);

/** Ana sayfa vitrin — her kategoriden örnek (teknik çizim görselli ürün hariç) */
export const homeFeatured: CatalogProduct[] = [
  ...barListing.filter((p) => p.id !== "bar-110000419068584").slice(0, 2),
  ...konferansSandalyeleriListing,
  ...konferansKoltuklariListing.slice(0, 4),
  ...stadyumListing.slice(0, 2),
];

export function isQuoteOnly(product: CatalogProduct): boolean {
  return product.quoteOnly === true;
}
