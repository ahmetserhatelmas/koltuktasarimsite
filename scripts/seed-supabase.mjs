/**
 * Supabase Veri Seeder
 * Kullanım: node scripts/seed-supabase.mjs
 *
 * Önce .env.local dosyasındaki SUPABASE_SERVICE_ROLE_KEY değerini doldurun.
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import ws from "ws"

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local dosyasını manuel parse et
const envPath = join(__dirname, "../.env.local")
const envContent = readFileSync(envPath, "utf-8")
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const [k, ...v] = l.split("=")
      return [k.trim(), v.join("=").trim()]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SUPABASE_URL === "your_supabase_project_url") {
  console.error("❌  .env.local dosyasındaki NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY değerlerini doldurun!")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  realtime: { transport: ws },
})

const manifest = JSON.parse(
  readFileSync(join(__dirname, "../src/lib/products-manifest.json"), "utf-8")
)

// ------------------------------------------------
// Kategori açıklamaları (descriptions.ts'den alındı)
// ------------------------------------------------
const BAR_SPECS = [
  { label: "Oturma Yüksekliği", value: "56–80 cm arası ayarlanabilir" },
  { label: "Oturma Genişliği", value: "39 cm" },
  { label: "Oturma Derinliği", value: "32 cm" },
  { label: "Ayak Tabanı", value: "Krom taban sacı Ø40 cm" },
  { label: "Amortisör", value: "260'lık amortisör" },
  { label: "Kaplama", value: "2 cm 32dns sünger üzerine deri kaplama" },
  { label: "Dönüş", value: "360° dönebilir" },
  { label: "Taşıma Kapasitesi", value: "Maks. 110 kg" },
  { label: "Kutu Ölçüleri", value: "60×40×40 cm" },
  { label: "Garanti", value: "1 yıl" },
]
const BAR_BULLETS = [
  "Yükseklik ayarı yapılabilir",
  "Kolay kurulum — montaj gerektirmez",
  "Islak zeminde kullanım önerilmez",
]
const KONFERANS_SPECS = [
  { label: "Sünger", value: "60 dns poliüretan dökme sünger" },
  { label: "Ayak", value: "40×60×1,50 mm elektrostatik toz boyalı" },
  { label: "Kumaş", value: "Alev almaz, leke tutmaz, antibakteriyal" },
  { label: "Plastik Aksamlar", value: "PP enjeksiyon, geçmeli vidalı" },
  { label: "Yazı Tablası", value: "PP hareketli — opsiyonel" },
  { label: "Garanti", value: "3 yıl koltuk, 15 yıl poliüretan sünger" },
  { label: "Hammadde", value: "BASF (Alman mali)" },
]
const KONFERANS_BULLETS = [
  "İstenilen renk ve adette özel üretim yapılır",
  "Konferans salonlarınızda mimari destek, akustik panel uygulaması, platform yükseltme, ses ve ışıklandırma profesyonel destek hizmetleri",
  "Ücretsiz keşif",
]
const STADYUM_BULLETS = [
  "Tek koltukta 3 ayrı renk kullanılabilecek şekilde tasarlanmıştır",
  "Minimum 38 cm yüksekliğindeki basamaklara 45 cm oturma yüksekliğinde monte edilerek ideal görüş açısı sağlanır",
  "Kapalı halde 23,20 cm alan kaplar; yaklaşık 56,80 cm geçiş alanı bırakır — tahliye süresini %65 kısaltır",
  "36,60 cm sırt yüksekliği ile yaslanma konforu ve crash barrier işlevi",
  "Gazlı sistem üretim tekniği — 200.000 darbeye dayanıklı (standart 40.000)",
  "UL-94 V2 alev geciktirme standardı — alev aldıktan en geç 25 saniyede söner",
  "Ömür boyu korozyon garantili metal aksamlar",
  "Renk solmasına karşı Grade 5 (Mükemmel) seviyesi — 3 yıl garanti",
  "Uluslararası federasyonların (UEFA vb.) gereksinimlerini karşılar",
]

function getDescriptionForId(id) {
  if (id.startsWith("bar-")) {
    return {
      intro: "Bar taburemiz, yüksek çalışma tezgahları, bar tezgahları ve kafe ortamları için tasarlanmış ergonomik bir oturma çözümüdür.",
      specs: BAR_SPECS,
      bullets: BAR_BULLETS,
      footer: null,
    }
  }
  if (id.startsWith("ks-") || id.startsWith("kk-")) {
    return {
      intro: "Konferans, sinema, tiyatro ve seminer salonları için özel üretim koltuk serimiz. Alman hammaddesi ve TSE ISO 9001:2000 kalite sertifikası ile üretilmektedir.",
      specs: KONFERANS_SPECS,
      bullets: KONFERANS_BULLETS,
      footer: null,
    }
  }
  if (id.startsWith("st-")) {
    return {
      intro: "TOGAN Stadyum Koltuğu; üniversitelerin desteğiyle antropometrik ölçümlere uygun olarak tasarlanmış, emsallerine göre en ergonomik ürün olarak üretilmektedir.",
      specs: [],
      bullets: STADYUM_BULLETS,
      footer: "Tamamen orijinal hammadde ile üretilmektedir.",
    }
  }
  return { intro: null, specs: [], bullets: [], footer: null }
}

function getCategoryForId(id) {
  if (id.startsWith("bar-")) return "bar"
  if (id.startsWith("ks-")) return "konferans-sandalyeleri"
  if (id.startsWith("kk-")) return "konferans-koltuklari"
  if (id.startsWith("st-")) return "stadyum"
  return "bar"
}

// ------------------------------------------------
// Products
// ------------------------------------------------
async function seedProducts() {
  console.log("📦  Ürünler ekleniyor...")

  const allManifestItems = [
    ...manifest.bar,
    ...manifest.konferansSandalyeleri,
    ...manifest.konferansKoltuklari,
    ...manifest.stadyum,
  ]

  const products = allManifestItems.map((item, i) => {
    const desc = getDescriptionForId(item.id)
    return {
      id: item.id,
      name: item.name,
      category: getCategoryForId(item.id),
      image_url: item.image,
      price: 0,
      old_price: 0,
      quote_only: true,
      description_intro: desc.intro,
      description_specs: desc.specs,
      description_bullets: desc.bullets,
      description_footer: desc.footer,
      is_active: true,
      sort_order: i,
    }
  })

  const { error } = await supabase
    .from("products")
    .upsert(products, { onConflict: "id" })

  if (error) {
    console.error("❌  Ürünler eklenirken hata:", error.message)
  } else {
    console.log(`✅  ${products.length} ürün eklendi`)
  }
}

// ------------------------------------------------
// Sliders
// ------------------------------------------------
async function seedSliders() {
  console.log("🖼️   Slider'lar ekleniyor...")

  const sliders = [
    {
      accent: "Konferans & salon",
      headline_italic: "koltukları",
      headline_bold: "KEŞFEDİN",
      sub_text: "Konferans sandalyeleri ve salon koltuk serileri",
      image_url: "/hero/slide-1.png",
      sort_order: 0,
      is_active: true,
    },
    {
      accent: "Tabure & stadyum",
      headline_italic: "çözümleri",
      headline_bold: "İNCELEYİN",
      sub_text: "Bar tabureleri ve stadyum koltuk sistemleri",
      image_url: "/hero/slide-2.png",
      sort_order: 1,
      is_active: true,
    },
    {
      accent: "Projeler",
      headline_italic: "kurulumlarınız için",
      headline_bold: "TEKLİF ALIN",
      sub_text: "Referans projeler ve özel üretim",
      image_url: "/hero/slide-3.png",
      sort_order: 2,
      is_active: true,
    },
  ]

  // Önce mevcut verileri sil
  await supabase.from("sliders").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const { error } = await supabase.from("sliders").insert(sliders)
  if (error) {
    console.error("❌  Slider'lar eklenirken hata:", error.message)
  } else {
    console.log(`✅  ${sliders.length} slider eklendi`)
  }
}

// ------------------------------------------------
// Categories
// ------------------------------------------------
async function seedCategories() {
  console.log("📂  Kategoriler ekleniyor...")

  const categories = [
    {
      id: "konferans-sandalyeleri",
      label: "Konferans Sandalyeleri",
      slug: "konferans-sandalyeleri",
      image_url: "/products/konferans-sandalyeleri/ks-form-kollu-sandalye-f500.webp",
      route: "/konferans-sandalyeleri",
      tagline: "Form, Hilton ve salon sandalye modelleri",
      is_featured: true,
      sort_order: 0,
    },
    {
      id: "konferans-koltuklari",
      label: "Konferans Koltukları",
      slug: "konferans-koltuklari",
      image_url: "/products/konferans-koltuklari/kk-dolphinkapal-kol-1-dolphin.jpeg",
      route: "/konferans-koltuklari",
      tagline: "Dolphin, Martin ve Rom serileri",
      is_featured: true,
      sort_order: 1,
    },
    {
      id: "bar",
      label: "Bar Taburesi",
      slug: "bar",
      image_url: "/products/bar/bar-karekromtablal.jpg",
      route: "/bar-taburesi",
      tagline: "Kafe, bar ve yüksek masa çözümleri",
      is_featured: true,
      sort_order: 2,
    },
    {
      id: "stadyum",
      label: "Stadyum Koltukları",
      slug: "stadyum",
      image_url: "/products/stadyum/st-103ebfbc2f4f76753a884aa6eb1ee9aa-togan-serisi.png",
      route: "/stadyum",
      tagline: "Omega, Togan ve yedek kulübesi serileri",
      is_featured: true,
      sort_order: 3,
    },
    {
      id: "projeler",
      label: "Projeler",
      slug: "projeler",
      image_url: "/projeler/proje-1.jpeg",
      route: "/#projeler",
      tagline: "Tamamlanan kurulum ve referanslar",
      is_featured: false,
      sort_order: 4,
    },
  ]

  const { error } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "id" })

  if (error) {
    console.error("❌  Kategoriler eklenirken hata:", error.message)
  } else {
    console.log(`✅  ${categories.length} kategori eklendi`)
  }
}

// ------------------------------------------------
// Featured Products
// ------------------------------------------------
async function seedFeaturedProducts() {
  console.log("⭐  Öne çıkan ürünler ekleniyor...")

  const featuredIds = [
    "bar-karekromtablal",
    "bar-karekromtablal-renkli-deri",
    "ks-form-kollu-sandalye-f500",
    "ks-h-lton-sandalye",
    "kk-dolphinahsapkapal-kol-dolphin",
    "kk-dolphinkapal-kol-1-dolphin",
    "kk-dolphinkapal-kol-2-dolphin",
    "kk-dolphinkapal-kol-3-dolphin",
    "st-103ebfbc2f4f76753a884aa6eb1ee9aa-togan-serisi",
    "st-15ac8c7393d22f53a0b154d71abd765c-togan-serisi",
  ]

  // Önce temizle
  await supabase.from("featured_products").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const rows = featuredIds.map((pid, i) => ({
    product_id: pid,
    sort_order: i,
  }))

  const { error } = await supabase.from("featured_products").insert(rows)
  if (error) {
    console.error("❌  Öne çıkan ürünler eklenirken hata:", error.message)
  } else {
    console.log(`✅  ${rows.length} öne çıkan ürün eklendi`)
  }
}

// ------------------------------------------------
// Ana fonksiyon
// ------------------------------------------------
async function main() {
  console.log("🚀  Koltuk Dünyası — Supabase Seed başlıyor...\n")
  await seedProducts()
  await seedSliders()
  await seedCategories()
  await seedFeaturedProducts()
  console.log("\n✨  Seed tamamlandı!")
}

main().catch((err) => {
  console.error("❌  Beklenmeyen hata:", err)
  process.exit(1)
})
