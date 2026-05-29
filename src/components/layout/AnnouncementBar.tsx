import { createClient } from "@/lib/supabase/server"
import { parseAnnouncementItems } from "@/lib/announcements"
import { getLocale } from "@/lib/i18n/server"
import { getDict } from "@/lib/i18n/dict"
import { AnnouncementTicker } from "./AnnouncementTicker"

export async function AnnouncementBar() {
  let enabled = true
  let items: string[] = []

  try {
    const locale = await getLocale()
    const t = getDict(locale)
    const supabase = await createClient()
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [
        "announcement_enabled",
        "announcement_items",
        "announcement_items_en",
        "announcement_items_ru",
        "announcement_items_ar",
      ])

    if (data) {
      const map = Object.fromEntries(data.map((s) => [s.key, s.value]))
      enabled = map.announcement_enabled !== "false"

      if (locale !== "tr") {
        const localizedKey = `announcement_items_${locale}`
        const localizedRaw = map[localizedKey]
        const localizedItems = localizedRaw ? parseAnnouncementItems(localizedRaw) : []

        if (localizedItems.length > 0) {
          // DB'den çevrilmiş duyurular varsa kullan
          items = localizedItems
        } else {
          // Yoksa dict'teki hardcoded çevirileri kullan
          items = (t.announcements as readonly string[]).slice()
        }
      } else {
        items = parseAnnouncementItems(map.announcement_items)
      }
    }
  } catch {
    return null
  }

  if (!enabled || items.length === 0) return null

  return <AnnouncementTicker items={items} />
}
