export const SITE_NAME = "Koltuk Dünyası";

/** Müşteri bilgileri netleşince doldurulacak */
export const CONTACT = {
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
} as const;

export const NAV_MAIN = [
  { href: "/ofis-sandalyeleri", label: "Ofis Sandalyeleri" },
  { href: "/#akustik", label: "Akustik Paneller" },
  { href: "/gaming-koltuklari", label: "Gaming Koltukları" },
  { href: "/#bar", label: "Sandalye & Bar Tabure" },
  { href: "/#konferans", label: "Konferans Koltukları" },
  { href: "/#export", label: "Project & Export" },
  { href: "/#yeni-gelenler", label: "En Yeniler" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const MOBILE_MENU = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/ofis-sandalyeleri", label: "Ofis Sandalyeleri" },
  { href: "/#akustik", label: "Akustik Paneller" },
  { href: "/gaming-koltuklari", label: "Gaming Koltukları" },
  { href: "/#bar", label: "Sandalye & Bar Tabure" },
  { href: "/#konferans", label: "Konferans Koltukları" },
  { href: "/#firsat", label: "Fırsat Ürünleri" },
  { href: "/#yeni-gelenler", label: "Yeni Gelenler" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const ANNOUNCEMENT_ITEMS = [
  "Seçili ürünlerde indirim fırsatı",
  "9 aya varan taksit imkânı",
  "Toptan satış için bizi arayın",
  "Tüm alışverişlerinize ücretsiz teslimat",
] as const;
