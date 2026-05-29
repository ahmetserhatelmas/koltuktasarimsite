export const SITE_NAME = "Koltuk Dünyası";

/** Müşteri bilgileri netleşince doldurulacak */
export const CONTACT = {
  phone: "+90 543 841 25 50",
  whatsapp: "905438412550",
  email: "",
  address: "",
} as const;

export { whatsappQuoteUrl } from "@/lib/contact"

export const NAV_MAIN = [
  { href: "/konferans-sandalyeleri", label: "Konferans Sandalyeleri" },
  { href: "/konferans-koltuklari", label: "Konferans Koltukları" },
  { href: "/bar-taburesi", label: "Bar Tabure" },
  { href: "/stadyum", label: "Stadyum" },
  { href: "/#projeler", label: "Projeler" },
] as const;

export const MOBILE_MENU = [{ href: "/", label: "Ana Sayfa" }, ...NAV_MAIN] as const;
