"use client"

import { useState } from "react"
import type { ProductColor } from "@/lib/supabase/types"

interface Props {
  value: ProductColor[]
  onChange: (colors: ProductColor[]) => void
}

const PRESET_COLORS = [
  { name: "Siyah", hex: "#1a1a1a" },
  { name: "Beyaz", hex: "#f5f5f5" },
  { name: "Gri", hex: "#808080" },
  { name: "Antrasit", hex: "#3b3b3b" },
  { name: "Lacivert", hex: "#1b2a5e" },
  { name: "Mavi", hex: "#2563eb" },
  { name: "Açık Mavi", hex: "#7eb8f7" },
  { name: "Kırmızı", hex: "#dc2626" },
  { name: "Bordo", hex: "#7f1d1d" },
  { name: "Yeşil", hex: "#16a34a" },
  { name: "Kahverengi", hex: "#78350f" },
  { name: "Bej", hex: "#d4b896" },
  { name: "Turuncu", hex: "#ea580c" },
  { name: "Sarı", hex: "#ca8a04" },
  { name: "Mor", hex: "#7c3aed" },
]

export function ColorsEditor({ value, onChange }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState("")
  const [newHex, setNewHex] = useState("#1a1a1a")

  function addColor() {
    if (!newName.trim()) return
    const color: ProductColor = { name: newName.trim(), hex: newHex }
    onChange([...value, color])
    setNewName("")
    setNewHex("#1a1a1a")
    setShowAdd(false)
  }

  function removeColor(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function addPreset(preset: ProductColor) {
    if (value.some((c) => c.hex === preset.hex)) return
    onChange([...value, preset])
  }

  return (
    <div>
      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Renk Seçenekleri
      </label>

      {/* Mevcut renkler */}
      {value.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {value.map((c, i) => (
            <div key={i} className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1.5 pl-1.5 pr-3">
              <span
                className="h-6 w-6 rounded-full border border-zinc-300 shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-xs font-medium text-zinc-700">{c.name}</span>
              <button
                type="button"
                onClick={() => removeColor(i)}
                className="ml-1 text-zinc-400 hover:text-red-500"
                aria-label="Kaldır"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hazır renkler */}
      <div className="mb-4">
        <p className="mb-2 text-xs text-zinc-400">Hazır renkler:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => {
            const selected = value.some((c) => c.hex === preset.hex)
            return (
              <button
                key={preset.hex}
                type="button"
                onClick={() => addPreset(preset)}
                title={preset.name}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                  selected
                    ? "border-zinc-400 bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                }`}
                disabled={selected}
              >
                <span
                  className="h-4 w-4 rounded-full border border-zinc-300"
                  style={{ backgroundColor: preset.hex }}
                />
                {preset.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Özel renk ekle */}
      {showAdd ? (
        <div className="flex flex-wrap items-end gap-3 rounded border border-zinc-200 bg-zinc-50 p-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Renk Adı</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="örn. Lacivert"
              className="h-9 w-40 border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Renk Seç</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                className="h-9 w-12 cursor-pointer border border-zinc-200 bg-white p-0.5"
              />
              <span className="text-xs font-mono text-zinc-500">{newHex}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addColor}
              disabled={!newName.trim()}
              className="h-9 bg-zinc-900 px-4 text-xs font-semibold text-white disabled:opacity-40 hover:bg-zinc-700"
            >
              Ekle
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="h-9 border border-zinc-200 px-4 text-xs text-zinc-500 hover:border-zinc-400"
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="h-9 border border-dashed border-zinc-300 px-4 text-xs text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-700"
        >
          + Özel Renk Ekle
        </button>
      )}
    </div>
  )
}
