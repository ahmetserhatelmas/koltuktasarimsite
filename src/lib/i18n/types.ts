export type Locale = "tr" | "en" | "ru" | "ar"

export const LOCALES: Locale[] = ["tr", "en", "ru", "ar"]

export const LOCALE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  ar: "العربية",
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ru: "🇷🇺",
  ar: "🇸🇦",
}

export const RTL_LOCALES: Locale[] = ["ar"]

export function isRTL(locale: Locale) {
  return RTL_LOCALES.includes(locale)
}

export const LOCALE_COOKIE = "kd_locale"

/** Ürün çeviri yapısı (Supabase'de JSONB olarak saklanır) */
export type ProductTranslation = {
  name: string
  description_intro?: string
  description_footer?: string
  description_bullets?: string[]
  description_specs?: { label: string; value: string }[]
}

export type ProductTranslations = Partial<Record<Exclude<Locale, "tr">, ProductTranslation>>
