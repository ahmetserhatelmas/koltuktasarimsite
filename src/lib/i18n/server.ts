import { cookies } from "next/headers"
import type { Locale } from "./types"
import { LOCALE_COOKIE, LOCALES } from "./types"
import { getDict } from "./dict"

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  if (value && LOCALES.includes(value as Locale)) return value as Locale
  return "tr"
}

export async function getServerDict() {
  const locale = await getLocale()
  return { locale, t: getDict(locale) }
}
