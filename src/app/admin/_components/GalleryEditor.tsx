"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

export function GalleryEditor({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFiles(files: FileList) {
    setError("")
    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: err } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: true })
      if (err) {
        setError("Yükleme hatası: " + err.message)
        continue
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }

    onChange([...value, ...uploaded])
    setUploading(false)
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function moveLeft(index: number) {
    if (index === 0) return
    const next = [...value]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  function moveRight(index: number) {
    if (index === value.length - 1) return
    const next = [...value]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Galeri Görselleri
        </p>
        <p className="text-xs text-zinc-400">{value.length} görsel</p>
      </div>
      <p className="mb-3 text-xs text-zinc-400">
        Ana görsel dışında ek fotoğraflar — detay sayfasında sol/sağ ok ile görüntülenir.
        Sıralamayı ← → oklarıyla değiştirebilirsiniz.
      </p>

      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="relative">
              <div className="relative h-24 w-24 border border-zinc-200 bg-zinc-50">
                <Image
                  src={url}
                  alt={`Galeri ${i + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="96px"
                  unoptimized={url.startsWith("http")}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] text-white hover:bg-red-700"
                >
                  ×
                </button>
              </div>
              <div className="mt-1 flex justify-between gap-0.5">
                <button
                  type="button"
                  onClick={() => moveLeft(i)}
                  disabled={i === 0}
                  className="flex h-6 flex-1 items-center justify-center border border-zinc-200 text-xs text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveRight(i)}
                  disabled={i === value.length - 1}
                  className="flex h-6 flex-1 items-center justify-center border border-zinc-200 text-xs text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30"
                >
                  →
                </button>
              </div>
              <p className="text-center text-[10px] text-zinc-400">#{i + 1}</p>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files)
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="h-9 border border-dashed border-zinc-300 px-5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-60"
      >
        {uploading ? "Yükleniyor..." : "+ Galeri Görseli Ekle"}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
