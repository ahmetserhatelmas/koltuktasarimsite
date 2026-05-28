"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

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

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from("settings")
      .select("*")
      .order("key")
    setSettings(data ?? [])
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

    const updates = settings.map((s) =>
      supabase
        .from("settings")
        .update({ value: s.value, updated_at: new Date().toISOString() })
        .eq("key", s.key)
    )

    const results = await Promise.all(updates)
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

  const mapSetting = settings.find((s) => s.key === "map_embed_url")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Site Ayarları</h1>
        <p className="mt-1 text-sm text-zinc-500">
          İletişim bilgileri ve harita konumu
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

          {/* İletişim Bilgileri */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
              İletişim Bilgileri
            </h2>
            <div className="space-y-4">
              {settings
                .filter((s) => s.key !== "map_embed_url")
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
                      placeholder={s.key === "contact_phone" ? "+90 543 841 25 50" : ""}
                    />
                  </div>
                ))}
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
