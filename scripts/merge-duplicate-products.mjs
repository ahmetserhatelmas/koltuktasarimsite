/**
 * Aynı ürünün varyantlarını (1, 2, 3 gibi numaralı olanları) birleştirir.
 * İlk ürünü ana ürün olarak tutar, diğerlerinin görsellerini galeri olarak ekler.
 *
 * Kullanım: node scripts/merge-duplicate-products.mjs
 * --dry-run parametresiyle önce ne yapacağını gösterir, değişiklik yapmaz.
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

/** Numarayı ve parantezi sondan atar: "Dolphinkapalıkol (3)" → "Dolphinkapalıkol" */
function baseName(name) {
  return name
    .replace(/\s*\(\d+\)\s*$/, "")   // " (N)" sonu
    .replace(/\s*\d+\s*$/, "")        // sondaki rakam
    .trim()
}

async function main() {
  console.log(DRY_RUN ? "🔍  DRY RUN — değişiklik yapılmayacak\n" : "🚀  Birleştirme başlıyor...\n")

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, image_url, gallery_images, sort_order")
    .order("category")
    .order("sort_order")

  if (error) { console.error("❌ Veri çekilemedi:", error.message); process.exit(1) }

  // Kategori + base isim bazında grupla
  const groups = new Map()
  for (const p of products) {
    const key = `${p.category}::${baseName(p.name).toLowerCase()}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }

  let mergeCount = 0

  for (const [key, group] of groups) {
    if (group.length <= 1) continue

    const [main, ...dupes] = group
    const newGallery = [
      ...(main.gallery_images ?? []),
      ...dupes.map((d) => d.image_url).filter(Boolean),
    ]

    const dupeNames = dupes.map((d) => `  • ${d.name} (${d.id})`).join("\n")
    console.log(`\n📦  "${main.name}"  →  ${dupes.length} varyant birleştirilecek:`)
    console.log(dupeNames)
    console.log(`   Galeri görseli sayısı: ${main.gallery_images?.length ?? 0} → ${newGallery.length}`)

    if (!DRY_RUN) {
      // Ana ürüne galeri ekle
      const { error: upErr } = await supabase
        .from("products")
        .update({ gallery_images: newGallery })
        .eq("id", main.id)
      if (upErr) { console.error("  ❌ Güncelleme hatası:", upErr.message); continue }

      // Kopyaları sil
      const dupeIds = dupes.map((d) => d.id)
      const { error: delErr } = await supabase
        .from("products")
        .delete()
        .in("id", dupeIds)
      if (delErr) { console.error("  ❌ Silme hatası:", delErr.message); continue }

      console.log(`  ✅ Birleştirildi — ${dupeIds.length} ürün silindi`)
    }

    mergeCount++
  }

  console.log(`\n${DRY_RUN ? "🔍" : "✨"}  Toplam ${mergeCount} grup ${DRY_RUN ? "bulundu" : "birleştirildi"}.`)
  if (DRY_RUN) console.log("   Gerçekten çalıştırmak için: node scripts/merge-duplicate-products.mjs")
}

main().catch((e) => { console.error(e); process.exit(1) })
