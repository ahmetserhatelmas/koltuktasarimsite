/**
 * Sunucu taraflı çeviri yardımcısı — MyMemory API
 * Hem /api/translate hem de sayfa render sırasında kullanılır
 */

const MYMEMORY_EMAIL = "iletisim@koltukdunyam.com"

export async function translateText(text: string, to: string): Promise<string> {
  if (!text?.trim()) return text
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|${to}&de=${MYMEMORY_EMAIL}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000), next: { revalidate: 0 } })
    if (!res.ok) return text
    const data = await res.json()
    const translated: string = data?.responseData?.translatedText
    if (translated && !translated.startsWith("MYMEMORY WARNING")) return translated
    return text
  } catch {
    return text
  }
}

type ProductContent = {
  name: string
  description_intro?: string | null
  description_footer?: string | null
  description_bullets?: string[]
  description_specs?: { label: string; value: string }[]
}

export type ProductTranslationResult = {
  name: string
  description_intro?: string
  description_footer?: string
  description_bullets?: string[]
  description_specs?: { label: string; value: string }[]
}

export async function autoTranslateProduct(
  product: ProductContent,
  locale: string
): Promise<ProductTranslationResult> {
  const [
    name,
    intro,
    footer,
  ] = await Promise.all([
    translateText(product.name, locale),
    product.description_intro ? translateText(product.description_intro, locale) : Promise.resolve(""),
    product.description_footer ? translateText(product.description_footer, locale) : Promise.resolve(""),
  ])

  // Bullet'ları paralel çevir
  const bullets = product.description_bullets?.length
    ? await Promise.all(product.description_bullets.map((b) => translateText(b, locale)))
    : []

  // Spec label ve value'ları paralel çevir
  const specs: { label: string; value: string }[] = []
  if (product.description_specs?.length) {
    const pairs = await Promise.all(
      product.description_specs.map(async (s) => ({
        label: await translateText(s.label, locale),
        value: await translateText(s.value, locale),
      }))
    )
    specs.push(...pairs)
  }

  return {
    name,
    ...(intro ? { description_intro: intro } : {}),
    ...(footer ? { description_footer: footer } : {}),
    ...(bullets.length ? { description_bullets: bullets } : {}),
    ...(specs.length ? { description_specs: specs } : {}),
  }
}
