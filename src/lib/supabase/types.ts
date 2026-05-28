export type ProductSpec = { label: string; value: string }
export type ProductColor = { name: string; hex: string }

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
  sort_order: number
  created_at: string
  updated_at: string
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
}

export type Category = {
  id: string
  label: string
  slug: string
  image_url: string | null
  route: string
  tagline: string | null
  is_featured: boolean
  sort_order: number
}

export type FeaturedProduct = {
  id: string
  product_id: string
  sort_order: number
}

export type FeaturedProductWithProduct = FeaturedProduct & {
  products: Product
}

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
