"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  mainImage: string
  galleryImages: string[]
  onChangeMain: (url: string) => void
  onChangeGallery: (urls: string[]) => void
}

export function AllImagesEditor({ mainImage, galleryImages, onChangeMain, onChangeGallery }: Props) {
  const mainRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function uploadFile(file: File, folder = "products") {
    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: err } = await supabase.storage.from("media").upload(path, file, { upsert: true })
    if (err) throw err
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl
  }

  async function handleMainUpload(files: FileList) {
    setError(""); setUploading(true)
    try {
      const url = await uploadFile(files[0])
      // Eski ana görseli galeriye ekle
      if (mainImage) onChangeGallery([mainImage, ...galleryImages])
      onChangeMain(url)
    } catch (e: unknown) {
      setError("Yükleme hatası: " + (e instanceof Error ? e.message : String(e)))
    }
    setUploading(false)
  }

  async function handleGalleryUpload(files: FileList) {
    setError(""); setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file, "gallery"))
      }
      onChangeGallery([...galleryImages, ...urls])
    } catch (e: unknown) {
      setError("Yükleme hatası: " + (e instanceof Error ? e.message : String(e)))
    }
    setUploading(false)
  }

  // Galeri görselini vitrine taşı, mevcut vitrin galeriye gider
  function promoteToMain(index: number) {
    const newMain = galleryImages[index]
    const newGallery = [...galleryImages]
    newGallery.splice(index, 1)
    if (mainImage) newGallery.unshift(mainImage)
    onChangeMain(newMain)
    onChangeGallery(newGallery)
  }

  // Vitrin görselini galeriye indir, galerideki ilk görsel vitrine geçer
  function demoteMain() {
    if (galleryImages.length === 0) { onChangeMain(""); return }
    const newMain = galleryImages[0]
    const newGallery = [...galleryImages.slice(1), mainImage].filter(Boolean)
    onChangeMain(newMain)
    onChangeGallery(newGallery)
  }

  function removeMain() { onChangeMain("") }

  function removeGallery(index: number) {
    onChangeGallery(galleryImages.filter((_, i) => i !== index))
  }

  function moveLeft(index: number) {
    if (index === 0) return
    const next = [...galleryImages]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChangeGallery(next)
  }

  function moveRight(index: number) {
    if (index === galleryImages.length - 1) return
    const next = [...galleryImages]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChangeGallery(next)
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* ── Tüm görseller birlikte ── */}
      <div className="flex flex-wrap gap-3">

        {/* Ana Görsel */}
        {mainImage ? (
          <div className="flex flex-col items-center gap-1">
            <div className="relative h-28 w-28 border-2 border-zinc-900 bg-zinc-50">
              <Image
                src={mainImage}
                alt="Vitrin"
                fill
                className="object-contain p-1"
                sizes="112px"
                unoptimized={mainImage.startsWith("http")}
              />
              <button
                type="button"
                onClick={removeMain}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] text-white hover:bg-red-700"
              >×</button>
            </div>
            <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              ★ Vitrin
            </span>
            <div className="flex w-28 gap-1">
              <button
                type="button"
                onClick={() => mainRef.current?.click()}
                disabled={uploading}
                className="h-6 flex-1 border border-zinc-300 text-[10px] text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-50"
              >
                Değiştir
              </button>
              {galleryImages.length > 0 && (
                <button
                  type="button"
                  onClick={demoteMain}
                  title="Galeriye taşı"
                  className="h-6 w-6 border border-zinc-300 text-[10px] text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                >↓</button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => mainRef.current?.click()}
            disabled={uploading}
            className="flex h-28 w-28 flex-col items-center justify-center gap-1 border-2 border-dashed border-zinc-300 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-600"
          >
            <span className="text-xl">+</span>
            <span>Vitrin Ekle</span>
          </button>
        )}

        {/* Galeri Görselleri */}
        {galleryImages.map((url, i) => (
          <div key={url + i} className="flex flex-col items-center gap-1">
            <div className="relative h-28 w-28 border border-zinc-200 bg-zinc-50">
              <Image
                src={url}
                alt={`Galeri ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="112px"
                unoptimized={url.startsWith("http")}
              />
              <button
                type="button"
                onClick={() => removeGallery(i)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] text-white hover:bg-red-700"
              >×</button>
            </div>
            <button
              type="button"
              onClick={() => promoteToMain(i)}
              className="w-28 rounded border border-zinc-300 py-0.5 text-[10px] font-semibold text-zinc-600 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              ★ Vitrin Yap
            </button>
            <div className="flex w-28 gap-1">
              <button
                type="button"
                onClick={() => moveLeft(i)}
                disabled={i === 0}
                className="h-6 flex-1 border border-zinc-200 text-xs text-zinc-500 hover:border-zinc-900 disabled:opacity-30"
              >←</button>
              <button
                type="button"
                onClick={() => moveRight(i)}
                disabled={i === galleryImages.length - 1}
                className="h-6 flex-1 border border-zinc-200 text-xs text-zinc-500 hover:border-zinc-900 disabled:opacity-30"
              >→</button>
            </div>
          </div>
        ))}

        {/* Yeni galeri görseli ekle */}
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={uploading}
          className="flex h-28 w-28 flex-col items-center justify-center gap-1 border border-dashed border-zinc-300 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-600 disabled:opacity-50"
        >
          <span className="text-xl">+</span>
          <span>{uploading ? "Yükleniyor..." : "Galeri Ekle"}</span>
        </button>
      </div>

      <input ref={mainRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleMainUpload(e.target.files) }} />
      <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleGalleryUpload(e.target.files) }} />

      <p className="text-xs text-zinc-400">
        Bir galeri görselinin altındaki <strong>★ Vitrin Yap</strong> butonuyla vitrin görselini anında değiştirebilirsiniz. Mevcut vitrin galeriye taşınır.
      </p>
    </div>
  )
}
