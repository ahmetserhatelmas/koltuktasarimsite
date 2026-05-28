"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Görsel" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file: File) {
    if (!file) return
    setError("")
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError("Yükleme başarısız: " + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      {value && (
        <div className="relative mb-3 h-40 w-40 border border-zinc-200 bg-zinc-50">
          <Image
            src={value}
            alt="Görsel önizleme"
            fill
            className="object-contain p-2"
            sizes="160px"
            unoptimized={value.startsWith("http")}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] text-white hover:bg-red-700"
            title="Görseli kaldır"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="h-9 border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-60"
        >
          {uploading ? "Yükleniyor..." : value ? "Görseli Değiştir" : "Görsel Yükle"}
        </button>

        <span className="text-xs text-zinc-400">veya URL girin:</span>
        <input
          type="url"
          value={value.startsWith("http") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="h-9 flex-1 border border-zinc-200 px-3 text-xs outline-none focus:border-zinc-900"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
