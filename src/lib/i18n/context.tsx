"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Locale } from "./types"
import { LOCALE_COOKIE, isRTL } from "./types"
import { getDict, type Dict } from "./dict"

type I18nContextValue = {
  locale: Locale
  t: Dict
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: "tr",
  t: getDict("tr"),
  setLocale: () => {},
})

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`
    // RTL / LTR
    document.documentElement.dir = isRTL(next) ? "rtl" : "ltr"
    document.documentElement.lang = next
  }, [])

  useEffect(() => {
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, t: getDict(locale), setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
