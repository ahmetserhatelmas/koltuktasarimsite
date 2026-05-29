export type ProductSpec = { label: string; value: string }
export type ProductColor = { name: string; hex: string }

export type NavItem = {
  id: string
  label: string
  href: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export type ProductCategory =
  | "bar"
  | "konferans-sandalyeleri"
  | "konferans-koltuklari"
  | "stadyum"

export type Product = {
  id: string
  name: string
  category: ProductCategory
  image_url: string | null
  price: number
  old_price: number
  quote_only: boolean
  description_intro: string | null
  description_specs: ProductSpec[]
  description_bullets: string[]
  description_footer: string | null
  colors: ProductColor[]
  is_active: boolean
  show_certificate: boolean
  certificate_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type SliderTranslation = {
  accent?: string
  headline_italic?: string
  headline_bold?: string
  sub_text?: string
}

export type Slider = {
  id: string
  accent: string | null
  headline_italic: string | null
  headline_bold: string | null
  sub_text: string | null
  image_url: string
  link: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  translations?: Partial<Record<string, SliderTranslation>>
}

export type CategoryTranslation = {
  label?: string
  tagline?: string
}

export type Category = {
  id: string
  label: string
  slug: string
  image_url: string | null
  route: string
  tagline: string | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
  translations?: Partial<Record<string, CategoryTranslation>>
}

export type FeaturedProduct = {
  id: string
  product_id: string
  sort_order: number
}

export type FeaturedProductWithProduct = FeaturedProduct & {
  products: Product
}

export type ContentPageSection = "kurumsal" | "yasal"

export type ContentPage = {
  slug: string
  title: string
  section: ContentPageSection
  content: string | null
  image_url: string | null
  link_url: string | null
  sort_order: number
  is_active: boolean
  updated_at: string
}

export const CONTENT_SECTION_LABELS: Record<ContentPageSection, string> = {
  kurumsal: "Kurumsal",
  yasal: "Yasal Bilgilendirme",
}

export function contentPageHref(page: Pick<ContentPage, "slug" | "link_url">): string {
  if (page.link_url?.trim()) return page.link_url.trim()
  return `/sayfa/${page.slug}`
}

/** Supabase migration çalışmamışsa footer'da gösterilecek varsayılan sayfalar */
export const DEFAULT_CONTENT_PAGES: ContentPage[] = [
  { slug: "hakkimizda", title: "Hakkımızda", section: "kurumsal", content: "", image_url: null, link_url: null, sort_order: 1, is_active: true, updated_at: "" },
  { slug: "project-export", title: "Project & Export", section: "kurumsal", content: "", image_url: null, link_url: null, sort_order: 2, is_active: true, updated_at: "" },
  { slug: "referanslar", title: "Referanslar", section: "kurumsal", content: "", image_url: null, link_url: null, sort_order: 3, is_active: true, updated_at: "" },
  { slug: "sikca-sorulanlar", title: "Sıkça Sorulanlar", section: "kurumsal", content: "", image_url: null, link_url: null, sort_order: 4, is_active: true, updated_at: "" },
  { slug: "blog", title: "Blog", section: "kurumsal", content: "", image_url: null, link_url: null, sort_order: 5, is_active: true, updated_at: "" },
  { slug: "bize-ulasin", title: "Bize Ulaşın", section: "kurumsal", content: "", image_url: null, link_url: "/iletisim", sort_order: 6, is_active: true, updated_at: "" },
  { slug: "kvkk", title: "K.V.K.K. Bilgilendirmesi", section: "yasal", content: "", image_url: null, link_url: null, sort_order: 1, is_active: true, updated_at: "" },
  { slug: "gizlilik", title: "Gizlilik Sözleşmesi", section: "yasal", content: "", image_url: null, link_url: null, sort_order: 2, is_active: true, updated_at: "" },
  { slug: "cerez", title: "Çerez Kullanımı", section: "yasal", content: "", image_url: null, link_url: null, sort_order: 3, is_active: true, updated_at: "" },
  { slug: "cevre", title: "Çevre Politikası", section: "yasal", content: "", image_url: null, link_url: null, sort_order: 4, is_active: true, updated_at: "" },
]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  bar: "Bar Taburesi",
  "konferans-sandalyeleri": "Konferans Sandalyeleri",
  "konferans-koltuklari": "Konferans Koltukları",
  stadyum: "Stadyum Koltukları",
}

export const CATEGORY_ROUTES: Record<ProductCategory, string> = {
  bar: "/bar-taburesi",
  "konferans-sandalyeleri": "/konferans-sandalyeleri",
  "konferans-koltuklari": "/konferans-koltuklari",
  stadyum: "/stadyum",
}
