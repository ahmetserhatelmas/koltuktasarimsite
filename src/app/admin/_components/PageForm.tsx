"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { ContentPage } from "@/lib/supabase/types"
import { ImageUpload } from "./ImageUpload"

interface Props {
  page: ContentPage
}

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
] as const

export function PageForm({ page }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [translating, setTranslating] = useState(false)
  const [transStatus, setTransStatus] = useState("")

  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content ?? "")
  const [imageUrl, setImageUrl] = useState(page.image_url ?? "")
  const [linkUrl, setLinkUrl] = useState(page.link_url ?? "")
  const [isActive, setIsActive] = useState(page.is_active)
  const [sortOrder, setSortOrder] = useState(page.sort_order.toString())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)

    const supabase = createClient()
    const { error: err } = await supabase
      .from("content_pages")
      .upsert({
        slug: page.slug,
        section: page.section,
        title: title.trim(),
        content: content.trim() || null,
        image_url: imageUrl || null,
        link_url: linkUrl.trim() || null,
        is_active: isActive,
        sort_order: parseInt(sortOrder) || 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: "slug" })

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    setSuccess("Sayfa kaydedildi!")
    setSaving(false)
    router.refresh()
  }

  async function handleAutoTranslate() {
    if (!title.trim() && !content.trim()) {
      setTransStatus("Çevrilecek içerik yok.")
      return
    }
    setTranslating(true)
    setTransStatus("")

    try {
      const supabase = createClient()

      setTransStatus("Çevriliyor...")

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title.trim(),
          description_intro: content.trim(),
          description_footer: "",
          description_bullets: [],
          description_specs: [],
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => null) as { error?: string } | null
        setTransStatus(`Hata: ${errBody?.error ?? "Çeviri isteği başarısız."}`)
        setTranslating(false)
        return
      }

      const data = await res.json() as {
        translations?: Record<string, { name?: string; description_intro?: string }>
      }

      const { data: existing } = await supabase
        .from("content_pages")
        .select("translations")
        .eq("slug", page.slug)
        .single()
      const currentTrans = (existing?.translations as Record<string, unknown>) ?? {}

      for (const loc of LOCALES) {
        const tr = data.translations?.[loc.code]
        currentTrans[loc.code] = {
          title: tr?.name || title,
          content: tr?.description_intro || content,
        }
      }

      // DB'ye kaydet
      const { error: err } = await supabase
        .from("content_pages")
        .upsert({
          slug: page.slug,
          section: page.section,
          title: title.trim(),
          content: content.trim() || null,
          image_url: imageUrl || null,
          link_url: linkUrl.trim() || null,
          is_active: isActive,
          sort_order: parseInt(sortOrder) || 0,
          translations: currentTrans,
          updated_at: new Date().toISOString(),
        }, { onConflict: "slug" })

      if (err) {
        setTransStatus(`Hata: ${err.message}`)
      } else {
        setTransStatus("✓ EN, RU, AR çevirileri kaydedildi!")
      }
    } catch (e) {
      setTransStatus(`Hata: ${String(e)}`)
    }

    setTranslating(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Sayfa Bilgileri
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Sıralama
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Özel Link{" "}
              <span className="font-normal normal-case tracking-normal text-zinc-400">
                (boş = /sayfa/{page.slug})
              </span>
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/iletisim"
              className="h-10 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          Sitede görünür
        </label>
      </div>

      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Kapak Görseli
        </h2>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          label="Sayfa Görseli (isteğe bağlı)"
        />
      </div>

      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          İçerik (Türkçe)
        </h2>
        <p className="mb-3 text-xs text-zinc-400">
          Başlık için <code className="bg-zinc-100 px-1"># Başlık</code>,
          alt başlık için <code className="bg-zinc-100 px-1">## Alt Başlık</code>,
          liste için <code className="bg-zinc-100 px-1">* madde</code>,
          kalın için <code className="bg-zinc-100 px-1">**metin**</code>
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="w-full border border-zinc-200 px-3 py-2 text-sm leading-relaxed outline-none focus:border-zinc-900"
          placeholder="Sayfa içeriğini buraya yazın..."
        />
      </div>

      {/* Otomatik çeviri */}
      <div className="border border-zinc-200 bg-white p-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Otomatik Çeviri
        </h2>
        <p className="mb-4 text-xs text-zinc-400">
          Türkçe başlık ve içeriği İngilizce, Rusça ve Arapçaya otomatik çevirir.
          Önce &quot;Güncelle&quot; ile Türkçeyi kaydedin, ardından çevirin.
        </p>
        <button
          type="button"
          onClick={handleAutoTranslate}
          disabled={translating}
          className="h-10 border border-zinc-300 bg-zinc-50 px-5 text-xs font-bold uppercase tracking-wider text-zinc-700 transition hover:border-zinc-900 hover:bg-white disabled:opacity-60"
        >
          {translating ? "Çevriliyor..." : "Otomatik Çevir (EN / RU / AR)"}
        </button>
        {transStatus && (
          <p className="mt-2 text-xs text-zinc-500">{transStatus}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="h-11 bg-zinc-900 px-8 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Güncelle"}
          </button>
          <a
            href={`/sayfa/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 border border-zinc-200 px-6 text-xs font-semibold leading-[2.75rem] text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            Önizle ↗
          </a>
        </div>
        {error && (
          <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
            ✓ {success}
          </div>
        )}
      </div>
    </form>
  )
}
