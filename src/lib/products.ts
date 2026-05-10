export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  oldPrice: number;
  price: number;
};

/** Tek ürün görselleri — grid / ekran görüntüsü yok. */
export const CHAIR_IMAGES = {
  mavi: "/products/koltuk-mavi.png",
  pembe: "/products/koltuk-pembe.png",
  lacivert: "/products/koltuk-lacivert.png",
  leonMudur: "/products/chair-leon-mudur-pembe.png",
  gaming: "/products/gaming-siyah-kirmizi.png",
  /** Tekil ürün fotoğrafları — `sandalye3.jpg` / `sandalye5.jpg` (ekran görüntüsü değil) */
  featuredMesh: "/products/sandalye5.jpg",
  featuredPremium: "/products/sandalye3.jpg",
  bellorePlus: "/products/sandalye3.jpg",
  belloreMeshExec: "/products/sandalye5.jpg",
} as const;

export const featuredRound: CatalogProduct[] = [
  {
    id: "r1",
    name: "Lurex Çalışma Sandalyesi Mavi",
    image: CHAIR_IMAGES.mavi,
    oldPrice: 5650,
    price: 3999,
  },
  {
    id: "r2",
    name: "Lurex Çalışma Sandalyesi Pembe",
    image: CHAIR_IMAGES.pembe,
    oldPrice: 5650,
    price: 3999,
  },
  {
    id: "r3",
    name: "Bellore Plus Lacivert",
    image: CHAIR_IMAGES.lacivert,
    oldPrice: 6282,
    price: 3999,
  },
  {
    id: "r4",
    name: "Léon Müdür Plus Pembe",
    image: CHAIR_IMAGES.leonMudur,
    oldPrice: 10902,
    price: 7788,
  },
  {
    id: "r5",
    name: "Ergonomik Mesh Sandalye",
    image: CHAIR_IMAGES.featuredMesh,
    oldPrice: 5890,
    price: 4299,
  },
  {
    id: "r6",
    name: "Premium Ofis Koltuğu",
    image: CHAIR_IMAGES.featuredPremium,
    oldPrice: 7200,
    price: 4599,
  },
];

export const dealProducts: CatalogProduct[] = [
  {
    id: "d1",
    name: "Bellore Ofis Çalışma Sandalyesi Plus Mavi",
    image: CHAIR_IMAGES.bellorePlus,
    oldPrice: 6650,
    price: 3999,
  },
  {
    id: "d2",
    name: "Bellore Mesh Yönetici Sandalyesi",
    image: CHAIR_IMAGES.belloreMeshExec,
    oldPrice: 6282,
    price: 3999,
  },
  {
    id: "d3",
    name: "Lurex Ergonomik Çalışma Koltuğu",
    image: CHAIR_IMAGES.lacivert,
    oldPrice: 5490,
    price: 3799,
  },
  {
    id: "d4",
    name: "Comfort Line Ofis Sandalyesi",
    image: CHAIR_IMAGES.mavi,
    oldPrice: 5990,
    price: 3899,
  },
  {
    id: "d5",
    name: "Aero Mesh Başlıklı Model",
    image: CHAIR_IMAGES.leonMudur,
    oldPrice: 6890,
    price: 4199,
  },
];

export const newArrivals: CatalogProduct[] = [
  {
    id: "n1",
    name: "Neo Ergonomik Çalışma Sandalyesi",
    image: CHAIR_IMAGES.bellorePlus,
    oldPrice: 6100,
    price: 3999,
  },
  {
    id: "n2",
    name: "Studio Mesh Konfor Serisi",
    image: CHAIR_IMAGES.belloreMeshExec,
    oldPrice: 5950,
    price: 3899,
  },
  {
    id: "n3",
    name: "Soft Touch Kumaş Model",
    image: CHAIR_IMAGES.pembe,
    oldPrice: 5750,
    price: 3699,
  },
  {
    id: "n4",
    name: "Executive Air Headrest",
    image: CHAIR_IMAGES.lacivert,
    oldPrice: 7200,
    price: 4499,
  },
];

export const officeListing: CatalogProduct[] = [
  ...dealProducts,
  {
    id: "o1",
    name: "Makam Koltuğu Sandalyesi",
    image: CHAIR_IMAGES.bellorePlus,
    oldPrice: 12490,
    price: 9899,
  },
  {
    id: "o2",
    name: "Yönetici Deri Detaylı Model",
    image: CHAIR_IMAGES.belloreMeshExec,
    oldPrice: 8900,
    price: 6999,
  },
  {
    id: "o3",
    name: "Operasyonel Mesh Seri",
    image: CHAIR_IMAGES.pembe,
    oldPrice: 4800,
    price: 3299,
  },
  {
    id: "o4",
    name: "Çalışma Odası Pro",
    image: CHAIR_IMAGES.mavi,
    oldPrice: 5100,
    price: 3499,
  },
];

export const gamingListing: CatalogProduct[] = [
  {
    id: "g1",
    name: "Gaming Sandalyesi Siyah",
    image: CHAIR_IMAGES.gaming,
    oldPrice: 9375,
    price: 8249,
  },
  {
    id: "g2",
    name: "Gaming Sandalyesi Kırmızı",
    image: CHAIR_IMAGES.gaming,
    oldPrice: 9375,
    price: 8249,
  },
  {
    id: "g3",
    name: "Gaming Sandalyesi Mavi",
    image: CHAIR_IMAGES.gaming,
    oldPrice: 9200,
    price: 7999,
  },
  {
    id: "g4",
    name: "Gaming Sandalyesi Sarı",
    image: CHAIR_IMAGES.gaming,
    oldPrice: 9100,
    price: 7899,
  },
  {
    id: "g5",
    name: "Gaming Sandalyesi Yeşil",
    image: CHAIR_IMAGES.gaming,
    oldPrice: 9050,
    price: 7799,
  },
];
