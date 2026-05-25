/** KoltukDunyam klasör yapısına göre vitrin kategorileri */
export type CategorySlug = "konferans-sandalyeleri" | "konferans-koltuklari" | "bar" | "stadyum" | "projeler";

export const CATEGORIES = [
  {
    slug: "konferans-sandalyeleri" as const,
    label: "Konferans Sandalyeleri",
    href: "/konferans-sandalyeleri",
    image: "/products/konferans-sandalyeleri/ks-form-kollu-sandalye-f500.webp",
    tagline: "Form, Hilton ve salon sandalye modelleri",
  },
  {
    slug: "konferans-koltuklari" as const,
    label: "Konferans Koltukları",
    href: "/konferans-koltuklari",
    image: "/products/konferans-koltuklari/kk-dolphinkapal-kol-1-dolphin.jpeg",
    tagline: "Dolphin, Martin ve Rom serileri",
  },
  {
    slug: "bar" as const,
    label: "Bar Taburesi",
    href: "/bar-taburesi",
    image: "/products/bar/bar-karekromtablal.jpg",
    tagline: "Kafe, bar ve yüksek masa çözümleri",
  },
  {
    slug: "stadyum" as const,
    label: "Stadyum Koltukları",
    href: "/stadyum",
    image: "/products/stadyum/st-103ebfbc2f4f76753a884aa6eb1ee9aa-togan-serisi.png",
    tagline: "Omega, Togan ve yedek kulübesi serileri",
  },
  {
    slug: "projeler" as const,
    label: "Projeler",
    href: "/#projeler",
    image: "/projeler/proje-1.jpeg",
    tagline: "Tamamlanan kurulum ve referanslar",
  },
] as const;

export const FEATURED_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "projeler");
