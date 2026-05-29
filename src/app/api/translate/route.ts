import { NextRequest, NextResponse } from "next/server"

const TARGET_LOCALES = ["en", "ru", "ar"] as const
type TargetLocale = (typeof TARGET_LOCALES)[number]

const LANG_MAP: Record<TargetLocale, string> = {
  en: "en",
  ru: "ru",
  ar: "ar",
}

async function translateText(text: string, to: string): Promise<string> {
  if (!text?.trim()) return ""
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|${to}&de=iletisim@koltukdunyam.com`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return text
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    // MyMemory bazen "MYMEMORY WARNING" döner
    if (translated && !translated.startsWith("MYMEMORY WARNING")) return translated
    return text
  } catch {
    return text
  }
}

async function translateAll(text: string): Promise<Record<TargetLocale, string>> {
  const results = await Promise.all(
    TARGET_LOCALES.map((locale) => translateText(text, LANG_MAP[locale]))
  )
  return Object.fromEntries(TARGET_LOCALES.map((l, i) => [l, results[i]])) as Record<TargetLocale, string>
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string
      description_intro?: string
      description_footer?: string
      description_bullets?: string[]
      description_specs?: { label: string; value: string }[]
    }

    const [nameT, introT, footerT, bulletsT, specLabelsT, specValuesT] = await Promise.all([
      translateAll(body.name ?? ""),
      translateAll(body.description_intro ?? ""),
      translateAll(body.description_footer ?? ""),
      // Bullet'ları tek string olarak gönder, sonra böl
      Promise.resolve(null),
      // Spec label'larını çevir
      body.description_specs?.length
        ? translateAll(body.description_specs.map((s) => s.label).join("\n"))
        : Promise.resolve(null),
      body.description_specs?.length
        ? translateAll(body.description_specs.map((s) => s.value).join("\n"))
        : Promise.resolve(null),
    ])

    // Bullet'ları ayrı ayrı çevir
    const bulletTranslations: Record<TargetLocale, string[]> = { en: [], ru: [], ar: [] }
    if (body.description_bullets?.length) {
      const bulletResults = await Promise.all(
        body.description_bullets.map((b) => translateAll(b))
      )
      for (const locale of TARGET_LOCALES) {
        bulletTranslations[locale] = bulletResults.map((r) => r[locale])
      }
    }

    const translations: Record<TargetLocale, Record<string, unknown>> = { en: {}, ru: {}, ar: {} }

    for (const locale of TARGET_LOCALES) {
      translations[locale] = {
        name: nameT[locale] || body.name,
        ...(body.description_intro ? { description_intro: introT[locale] } : {}),
        ...(body.description_footer ? { description_footer: footerT[locale] } : {}),
        ...(body.description_bullets?.length
          ? { description_bullets: bulletTranslations[locale] }
          : {}),
        ...(body.description_specs?.length && specLabelsT && specValuesT
          ? {
              description_specs: body.description_specs.map((s, i) => ({
                label: specLabelsT[locale].split("\n")[i] ?? s.label,
                value: specValuesT[locale].split("\n")[i] ?? s.value,
              })),
            }
          : {}),
      }
    }

    return NextResponse.json({ translations })
  } catch (err) {
    console.error("Translate API error:", err)
    return NextResponse.json({ error: "Çeviri başarısız." }, { status: 500 })
  }
}
