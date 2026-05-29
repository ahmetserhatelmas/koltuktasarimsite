"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { parseAnnouncementItems } from "@/lib/announcements"
import { SOCIAL_PLATFORMS } from "@/lib/social"
import { AnnouncementEditor } from "../_components/AnnouncementEditor"
import { ImageUpload } from "../_components/ImageUpload"

type Setting = {
  key: string
  value: string
  label: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [announcementEnabled, setAnnouncementEnabled] = useState(true)
  const [announcementItems, setAnnouncementItems] = useState<string[]>([])
  const [translating, setTranslating] = useState(false)
  const [transStatus, setTransStatus] = useState("")

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from("settings")
      .select("*")
      .order("key")
    const map = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]))
    const existingKeys = new Set((data ?? []).map((s) => s.key))
    const merged = [...(data ?? [])]
    for (const platform of SOCIAL_PLATFORMS) {
      if (!existingKeys.has(platform.key)) {
        merged.push({ key: platform.key, value: "", label: platform.label })
      }
    }
    setSettings(merged)

    setAnnouncementEnabled(map.announcement_enabled !== "false")
    const parsed = parseAnnouncementItems(map.announcement_items)
    setAnnouncementItems(
      parsed.length > 0
        ? parsed
        : [
            "9 AYA VARAN TAKSİT İMKANI",
            "TOPTAN SATIŞ İÇİN **BİZİ ARAYIN!**",
            "TÜM ALIŞVERİŞLERİNİZE **ÜCRETSİZ TESLİMAT!**",
          ]
    )

    // Çeviri satırları yoksa ekle
    const transKeys = ["announcement_items_en", "announcement_items_ru", "announcement_items_ar"]
    const transLabels: Record<string, string> = {
      announcement_items_en: "Duyuru Metinleri — English",
      announcement_items_ru: "Duyuru Metinleri — Русский",
      announcement_items_ar: "Duyuru Metinleri — العربية",
    }
    for (const key of transKeys) {
      if (!existingKeys.has(key)) {
        merged.push({ key, value: "", label: transLabels[key] })
      }
    }

    // Brand Story key'leri yoksa placeholder ekle
    const brandKeys: Record<string, string> = {
      brand_title: "Marka Başlığı (TR)",
      brand_text: "Marka Metni (TR)",
      brand_title_en: "Marka Başlığı (EN)",
      brand_text_en: "Marka Metni (EN)",
      brand_title_ru: "Marka Başlığı (RU)",
      brand_text_ru: "Marka Metni (RU)",
      brand_title_ar: "Marka Başlığı (AR)",
      brand_text_ar: "Marka Metni (AR)",
    }
    for (const [key, label] of Object.entries(brandKeys)) {
      if (!existingKeys.has(key)) {
        merged.push({ key, value: "", label })
      }
    }

    setSettings(merged)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  function updateValue(key: string, value: string) {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    const supabase = createClient()

    const contactKeys = new Set([
      "map_embed_url",
      "contact_phone",
      "contact_whatsapp",
      "contact_email",
      "contact_address",
      "default_certificate_url",
    ])
    const socialKeys = new Set(SOCIAL_PLATFORMS.map((p) => p.key))

    const updates = settings
      .filter((s) => contactKeys.has(s.key))
      .map((s) =>
        supabase
          .from("settings")
          .update({ value: s.value, updated_at: new Date().toISOString() })
          .eq("key", s.key)
      )

    const socialUpsert = supabase.from("settings").upsert(
      settings
        .filter((s) => socialKeys.has(s.key))
        .map((s) => ({
          key: s.key,
          value: s.value.trim(),
          label: SOCIAL_PLATFORMS.find((p) => p.key === s.key)?.label ?? s.label,
          updated_at: new Date().toISOString(),
        }))
    )

    const announcementTranslationKeys = ["announcement_items_en", "announcement_items_ru", "announcement_items_ar"]
    const translatedSettings = settings.filter((s) => announcementTranslationKeys.includes(s.key))

    const announcementUpsert = supabase.from("settings").upsert([
      {
        key: "announcement_enabled",
        value: announcementEnabled ? "true" : "false",
        label: "Duyuru Bandı Aktif",
        updated_at: new Date().toISOString(),
      },
      {
        key: "announcement_items",
        value: JSON.stringify(announcementItems.filter((i) => i.trim())),
        label: "Duyuru Metinleri (JSON)",
        updated_at: new Date().toISOString(),
      },
      ...translatedSettings.map((s) => ({
        key: s.key,
        value: s.value,
        label: s.label,
        updated_at: new Date().toISOString(),
      })),
    ])

    const brandStoryKeys = ["brand_title", "brand_text", "brand_title_en", "brand_text_en", "brand_title_ru", "brand_text_ru", "brand_title_ar", "brand_text_ar"]
    const brandUpsert = supabase.from("settings").upsert(
      settings
        .filter((s) => brandStoryKeys.includes(s.key))
        .map((s) => ({
          key: s.key,
          value: s.value,
          label: s.label,
          updated_at: new Date().toISOString(),
        }))
    )

    const results = await Promise.all([...updates, socialUpsert, announcementUpsert, brandUpsert])
    const failed = results.find((r) => r.error)

    if (failed?.error) {
      setError(failed.error.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  async function handleTranslateAnnouncements() {
    if (announcementItems.filter(Boolean).length === 0) return
    setTranslating(true)
    setTransStatus("Çeviriliyor...")
    try {
      const langs: Array<{ code: string; key: string; label: string }> = [
        { code: "en", key: "announcement_items_en", label: "English" },
        { code: "ru", key: "announcement_items_ru", label: "Русский" },
        { code: "ar", key: "announcement_items_ar", label: "العربية" },
      ]
      const translated: Record<string, string[]> = { en: [], ru: [], ar: [] }

      for (const item of announcementItems.filter(Boolean)) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: item,
            description_intro: "",
            description_footer: "",
            description_bullets: [],
            description_specs: [],
          }),
        })
        if (!res.ok) continue
        const data = await res.json()
        for (const lang of langs) {
          const tr = data.translations?.[lang.code]
          if (tr?.name) translated[lang.code].push(tr.name)
        }
      }

      setSettings((prev) =>
        prev.map((s) => {
          const lang = langs.find((l) => l.key === s.key)
          if (!lang) return s
          const items = translated[lang.code]
          return { ...s, value: items.length > 0 ? JSON.stringify(items) : s.value }
        })
      )
      setTransStatus("✓ Duyurular çevrildi (EN, RU, AR)")
    } catch {
      setTransStatus("✗ Çeviri başarısız")
    } finally {
      setTranslating(false)
    }
  }

  async function handleTranslateBrandStory() {
    const titleTr = settings.find((s) => s.key === "brand_title")?.value ?? ""
    const textTr  = settings.find((s) => s.key === "brand_text")?.value ?? ""
    if (!titleTr && !textTr) return
    setTranslating(true)
    setTransStatus("Brand Story çeviriliyor...")
    try {
      const langs = [
        { code: "en", titleKey: "brand_title_en", textKey: "brand_text_en" },
        { code: "ru", titleKey: "brand_title_ru", textKey: "brand_text_ru" },
        { code: "ar", titleKey: "brand_title_ar", textKey: "brand_text_ar" },
      ]
      for (const lang of langs) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: titleTr,
            description_intro: textTr,
            description_footer: "",
            description_bullets: [],
            description_specs: [],
          }),
        })
        if (!res.ok) continue
        const data = await res.json()
        const tr = data.translations?.[lang.code]
        if (tr) {
          if (tr.name)              updateValue(lang.titleKey, tr.name)
          if (tr.description_intro) updateValue(lang.textKey,  tr.description_intro)
        }
      }
      setTransStatus("✓ Brand Story çevrildi (EN, RU, AR)")
    } catch {
      setTransStatus("✗ Çeviri başarısız")
    } finally {
      setTranslating(false)
    }
  }

  const mapSetting = settings.find((s) => s.key === "map_embed_url")
  const certSetting = settings.find((s) => s.key === "default_certificate_url")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Site Ayarları</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Duyuru bandı, iletişim bilgileri, sosyal medya ve harita konumu
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              ✓ Ayarlar kaydedildi!
            </div>
          )}

          <AnnouncementEditor
            enabled={announcementEnabled}
            items={announcementItems}
            onEnabledChange={setAnnouncementEnabled}
            onItemsChange={setAnnouncementItems}
          />

          {/* Duyuru Çevirisi */}
          <div className="border border-zinc-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Duyuru Bandı Çevirisi
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Üstteki duyuruları EN/RU/AR diline otomatik çevirin. Kaydet ile birlikte uygulanır.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTranslateAnnouncements}
                disabled={translating || announcementItems.filter(Boolean).length === 0}
                className="h-9 shrink-0 border border-blue-300 bg-blue-50 px-4 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {translating ? "Çeviriliyor..." : "🌐 Otomatik Çevir"}
              </button>
            </div>
            {transStatus && (
              <p className={`mb-3 text-xs font-medium ${transStatus.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                {transStatus}
              </p>
            )}
            {(["announcement_items_en", "announcement_items_ru", "announcement_items_ar"] as const).map((key) => {
              const s = settings.find((x) => x.key === key)
              if (!s) return null
              let preview: string[] = []
              try { preview = JSON.parse(s.value) } catch { /* empty */ }
              return (
                <div key={key} className="mb-3">
                  <p className="mb-1 text-xs font-semibold text-zinc-500">{s.label}</p>
                  {preview.length > 0 ? (
                    <ul className="space-y-1">
                      {preview.map((item, i) => (
                        <li key={i} className="text-xs text-zinc-600">• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">Henüz çevrilmedi</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Brand Story */}
          <div className="border border-zinc-200 bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Ana Sayfa Tanıtım Yazısı
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Ana sayfanın alt kısmındaki başlık ve açıklama metni. TR girdikten sonra otomatik çevirin.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTranslateBrandStory}
                disabled={translating}
                className="h-9 shrink-0 border border-blue-300 bg-blue-50 px-4 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {translating ? "Çeviriliyor..." : "🌐 Otomatik Çevir"}
              </button>
            </div>
            {transStatus && transStatus.includes("Brand") && (
              <p className={`mb-3 text-xs font-medium ${transStatus.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                {transStatus}
              </p>
            )}
            <div className="space-y-4">
              {[
                { key: "brand_title", label: "Başlık — Türkçe", multiline: false },
                { key: "brand_text",  label: "Metin — Türkçe",  multiline: true  },
                { key: "brand_title_en", label: "Başlık — English", multiline: false },
                { key: "brand_text_en",  label: "Metin — English",  multiline: true  },
                { key: "brand_title_ru", label: "Başlık — Русский", multiline: false },
                { key: "brand_text_ru",  label: "Metin — Русский",  multiline: true  },
                { key: "brand_title_ar", label: "Başlık — العربية", multiline: false },
                { key: "brand_text_ar",  label: "Metin — العربية",  multiline: true  },
              ].map(({ key, label, multiline }) => {
                const s = settings.find((x) => x.key === key)
                if (!s) return null
                return (
                  <div key={key}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {label}
                    </label>
                    {multiline ? (
                      <textarea
                        rows={3}
                        value={s.value}
                        onChange={(e) => updateValue(key, e.target.value)}
                        className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                      />
                    ) : (
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => updateValue(key, e.target.value)}
                        className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
              İletişim Bilgileri
            </h2>
            <div className="space-y-4">
              {settings
                .filter((s) =>
                  ["contact_phone", "contact_whatsapp", "contact_email", "contact_address"].includes(
                    s.key
                  )
                )
                .map((s) => (
                  <div key={s.key}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {s.label}
                    </label>
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => updateValue(s.key, e.target.value)}
                      className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                      placeholder={
                        s.key === "contact_phone"
                          ? "+90 543 841 25 50"
                          : s.key === "contact_whatsapp"
                            ? "905438412550"
                            : ""
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Sertifika Görseli */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
              Varsayılan Sertifika Görseli
            </h2>
            <p className="mb-5 text-xs text-zinc-500">
              Ürün sayfalarında gösterilecek sertifika bandı. Ürün bazında özel görsel yüklenirse bu görselin önüne geçer.
            </p>
            <ImageUpload
              value={certSetting?.value ?? "/brand/certificate.png"}
              onChange={(url) => {
                if (certSetting) {
                  updateValue("default_certificate_url", url)
                }
              }}
              label="Sertifika Görseli"
            />
            {(certSetting?.value || "/brand/certificate.png") && (
              <div className="mt-4 overflow-hidden rounded border border-zinc-100 bg-zinc-50">
                <Image
                  src={certSetting?.value || "/brand/certificate.png"}
                  alt="Sertifika önizleme"
                  width={900}
                  height={200}
                  className="h-auto w-full object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Sosyal Medya */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              Sosyal Medya
            </h2>
            <p className="mb-5 text-xs text-zinc-500">
              Footer&apos;daki &quot;Bizi Takip Edin&quot; bölümünde gösterilir. Boş bırakılan
              ikonlar görünür kalır, tıklanamaz.
            </p>
            <div className="space-y-4">
              {SOCIAL_PLATFORMS.map((platform) => {
                const setting = settings.find((s) => s.key === platform.key)
                return (
                  <div key={platform.key}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {platform.label}
                    </label>
                    <input
                      type="url"
                      value={setting?.value ?? ""}
                      onChange={(e) => updateValue(platform.key, e.target.value)}
                      className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                      placeholder={platform.placeholder}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Harita */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
              Google Harita
            </h2>

            {/* Adım adım talimat */}
            <ol className="mb-5 space-y-1.5 text-xs text-zinc-500">
              <li className="flex gap-2"><span className="font-bold text-zinc-800">1.</span> <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">maps.google.com</a>&apos;da işyerinizi aratın</li>
              <li className="flex gap-2"><span className="font-bold text-zinc-800">2.</span> <span>Paylaş (Share) butonuna tıklayın</span></li>
              <li className="flex gap-2"><span className="font-bold text-zinc-800">3.</span> <span><strong className="text-zinc-700">&quot;Harita yerleştir&quot;</strong> (Embed a map) sekmesini seçin</span></li>
              <li className="flex gap-2"><span className="font-bold text-zinc-800">4.</span> <span><strong className="text-zinc-700">&quot;HTML kopyala&quot;</strong> butonuna tıklayın</span></li>
              <li className="flex gap-2"><span className="font-bold text-zinc-800">5.</span> <span>Kopyalanan koddan yalnızca <code className="bg-zinc-100 px-1">src=&quot;...&quot;</code> içini yapıştırın</span></li>
            </ol>

            <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ⚠️ URL <strong>https://www.google.com/maps/embed?pb=</strong> ile başlamalıdır. Harita sayfasının adres çubuğundaki URL değil, embed kodu içindeki URL kullanılmalıdır.
            </div>

            {mapSetting && (
              <>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Embed URL
                </label>
                <input
                  type="text"
                  value={mapSetting.value}
                  onChange={(e) => {
                    let v = e.target.value.trim()
                    // https:// eksikse ekle
                    if (v && !v.startsWith("http")) v = "https://" + v
                    updateValue("map_embed_url", v)
                  }}
                  className={`h-10 w-full border px-3 text-sm outline-none focus:border-zinc-900 ${
                    mapSetting.value && !mapSetting.value.includes("/maps/embed")
                      ? "border-red-300 bg-red-50"
                      : "border-zinc-200"
                  }`}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />

                {/* Hatalı URL uyarısı */}
                {mapSetting.value && !mapSetting.value.includes("/maps/embed") && !mapSetting.value.includes("output=embed") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    ❌ Bu geçerli bir embed URL değil. Yukarıdaki 5. adımı takip edin.
                  </p>
                )}

                {/* Önizleme — sadece geçerli embed URL'de göster */}
                {mapSetting.value && (mapSetting.value.includes("/maps/embed") || mapSetting.value.includes("output=embed")) && (
                  <div className="mt-4 overflow-hidden border border-zinc-200">
                    <p className="border-b border-zinc-100 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500">
                      ✓ Önizleme
                    </p>
                    <iframe
                      src={mapSetting.value}
                      className="aspect-video w-full"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-11 bg-zinc-900 px-8 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      )}
    </div>
  )
}
