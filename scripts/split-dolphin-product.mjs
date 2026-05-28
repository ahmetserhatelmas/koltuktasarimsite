/**
 * Birleştirilmiş "Dolphinkapalıkol" ürününü 3 ayrı ürüne böler:
 *  - Grup A → (1), (2), (3), (7)  → Ana ürün
 *  - Grup B → (4), (5), (6)        → Yeni ürün
 *  - Grup C → (8), (9)             → Yeni ürün
 *
 * Kullanım:
 *   node scripts/split-dolphin-product.mjs          → gerçek değişiklik
 *   node scripts/split-dolphin-product.mjs --dry-run → sadece önizleme
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import ws from "ws"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8")
const env = Object.fromEntries(
  envContent.split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => { const [k, ...v] = l.split("="); return [k.trim(), v.join("=").trim()] })
)

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
)

const DRY_RUN = process.argv.includes("--dry-run")

async function main() {
  console.log(DRY_RUN ? "🔍  DRY-RUN modu — değişiklik yapılmayacak\n" : "🚀  Bölme işlemi başlıyor...\n")

  // "dolphinkapal" içeren tüm ürünleri bul
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .ilike("id", "%dolphinkapal-kol%")
    .order("id")

  if (error) { console.error(error); process.exit(1) }

  if (!products || products.length === 0) {
    console.log("❌  Dolphinkapalıkol ürünü bulunamadı.")
    process.exit(1)
  }

  console.log(`📦  Bulunan ürünler (${products.length} adet):`)
  for (const p of products) {
    const galleryCount = (p.gallery_images ?? []).length
    console.log(`   • [${p.id}] "${p.name}"  — gallery: ${galleryCount} görsel`)
  }

  // Birleştirilmiş ana ürünü bul (en fazla gallery_images olanı)
  const main = products.reduce((a, b) =>
    (b.gallery_images?.length ?? 0) > (a.gallery_images?.length ?? 0) ? b : a
  )

  const gallery = main.gallery_images ?? []
  console.log(`\n✅  Ana ürün: [${main.id}] "${main.name}"`)
  console.log(`   image_url   : ${main.image_url ?? "(yok)"}`)
  console.log(`   gallery (${gallery.length} adet):`)
  gallery.forEach((url, i) => console.log(`     [${i}] ${url}`))

  if (gallery.length < 7) {
    console.log("\n⚠️  Beklenen 8 galeri görseli yok. İşlem iptal edildi.")
    console.log("   Mevcut galeri:", gallery.length, "adet")
    console.log("   Admin panelinden görselleri manuel olarak 3 ayrı ürüne dağıtabilirsiniz.")
    process.exit(0)
  }

  // ─── Bölme planı ─────────────────────────────────────────────────────────
  // Merge sırası: 1(ana)→image_url, sonra 2,3,4,5,6,7,8,9 sırayla gallery'e eklendi
  // Yani: gallery[0]=2, [1]=3, [2]=4, [3]=5, [4]=6, [5]=7, [6]=8, [7]=9

  const groupA_mainImage  = main.image_url                           // variant (1)
  const groupA_gallery    = [gallery[0], gallery[1], gallery[5]]    // variant (2), (3), (7)

  const groupB_mainImage  = gallery[2]                               // variant (4)
  const groupB_gallery    = [gallery[3], gallery[4]]                 // variant (5), (6)

  const groupC_mainImage  = gallery[6]                               // variant (8)
  const groupC_gallery    = [gallery[7]]                             // variant (9)

  console.log("\n─── Bölme Planı ─────────────────────────────────────────────────────────")
  console.log("\n[GRUP A] Ana ürün güncellenir — (1), (2), (3), (7)")
  console.log("  image_url:", groupA_mainImage)
  console.log("  gallery  :", groupA_gallery)

  console.log("\n[GRUP B] Yeni ürün oluşturulur — (4), (5), (6)")
  console.log("  image_url:", groupB_mainImage)
  console.log("  gallery  :", groupB_gallery)

  console.log("\n[GRUP C] Yeni ürün oluşturulur — (8), (9)")
  console.log("  image_url:", groupC_mainImage)
  console.log("  gallery  :", groupC_gallery)

  if (DRY_RUN) {
    console.log("\n🔍  Dry-run tamamlandı. Gerçek işlem için --dry-run olmadan çalıştırın.")
    return
  }

  // ─── Grup A: Ana ürünü güncelle ──────────────────────────────────────────
  {
    const cleanName = main.name.replace(/\s*\(\d+\)\s*$/, "").trim()
    const { error: err } = await supabase
      .from("products")
      .update({
        name: cleanName,
        image_url: groupA_mainImage,
        gallery_images: groupA_gallery.filter(Boolean),
      })
      .eq("id", main.id)
    if (err) { console.error("Grup A güncelleme hatası:", err); process.exit(1) }
    console.log(`\n✅  Grup A güncellendi → "${cleanName}"`)
  }

  // ─── Grup B: Yeni ürün oluştur ────────────────────────────────────────────
  {
    const baseName = main.name.replace(/\s*\(\d+\)\s*$/, "").trim()
    const newId    = main.id.replace(/-\d+-dolphin$/, "") + "-b-dolphin"
    const { error: err } = await supabase
      .from("products")
      .insert({
        id: newId,
        name: baseName + " — Model 2",
        category: main.category,
        image_url: groupB_mainImage ?? null,
        gallery_images: groupB_gallery.filter(Boolean),
        price: main.price,
        old_price: main.old_price,
        quote_only: main.quote_only,
        description_intro: main.description_intro,
        description_specs: main.description_specs,
        description_bullets: main.description_bullets,
        description_footer: main.description_footer,
        colors: main.colors ?? [],
        is_active: main.is_active,
        sort_order: main.sort_order + 1,
      })
    if (err) { console.error("Grup B oluşturma hatası:", err); process.exit(1) }
    console.log(`✅  Grup B oluşturuldu → [${newId}]`)
  }

  // ─── Grup C: Yeni ürün oluştur ────────────────────────────────────────────
  {
    const baseName = main.name.replace(/\s*\(\d+\)\s*$/, "").trim()
    const newId    = main.id.replace(/-\d+-dolphin$/, "") + "-c-dolphin"
    const { error: err } = await supabase
      .from("products")
      .insert({
        id: newId,
        name: baseName + " — Model 3",
        category: main.category,
        image_url: groupC_mainImage ?? null,
        gallery_images: groupC_gallery.filter(Boolean),
        price: main.price,
        old_price: main.old_price,
        quote_only: main.quote_only,
        description_intro: main.description_intro,
        description_specs: main.description_specs,
        description_bullets: main.description_bullets,
        description_footer: main.description_footer,
        colors: main.colors ?? [],
        is_active: main.is_active,
        sort_order: main.sort_order + 2,
      })
    if (err) { console.error("Grup C oluşturma hatası:", err); process.exit(1) }
    console.log(`✅  Grup C oluşturuldu → [${newId}]`)
  }

  console.log("\n✨  İşlem tamamlandı!")
  console.log("   Admin panelinden ürün adlarını ve görsellerini kontrol edip güncelleyebilirsiniz.")
}

main().catch((e) => { console.error(e); process.exit(1) })
