import { CONTACT } from "@/lib/site-data"

/** Sadece rakamları bırakır (wa.me için) */
export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "")
}

/** Ekranda gösterim için formatlar */
export function formatWhatsAppDisplay(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("+")) return trimmed

  const digits = normalizeWhatsAppNumber(trimmed)
  if (!digits) return trimmed

  if (digits.length === 12 && digits.startsWith("90")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  if (digits.length === 10 && digits.startsWith("5")) {
    return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  return `+${digits}`
}

export function whatsappHref(number: string, message?: string): string {
  const digits = normalizeWhatsAppNumber(number)
  if (!digits) return "#"
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function whatsappQuoteUrl(productName?: string, number?: string): string {
  const digits = normalizeWhatsAppNumber(number || CONTACT.whatsapp)
  const message = productName
    ? `Merhaba, "${productName}" ürünü hakkında fiyat teklifi almak istiyorum.`
    : "Merhaba, ürünleriniz hakkında bilgi almak istiyorum."
  return whatsappHref(digits, message)
}
