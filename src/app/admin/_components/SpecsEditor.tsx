"use client"

import type { ProductSpec } from "@/lib/supabase/types"

interface Props {
  value: ProductSpec[]
  onChange: (specs: ProductSpec[]) => void
}

export function SpecsEditor({ value, onChange }: Props) {
  function update(index: number, field: keyof ProductSpec, text: string) {
    const next = value.map((s, i) =>
      i === index ? { ...s, [field]: text } : s
    )
    onChange(next)
  }

  function add() {
    onChange([...value, { label: "", value: "" }])
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Teknik Özellikler
      </p>

      <div className="space-y-2">
        {value.map((spec, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={spec.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Özellik adı"
              className="h-9 w-36 border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => update(i, "value", e.target.value)}
              placeholder="Değer"
              className="h-9 flex-1 border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-9 w-9 items-center justify-center border border-zinc-200 text-zinc-400 hover:border-red-300 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-2 h-8 border border-dashed border-zinc-300 px-4 text-xs text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
      >
        + Özellik Ekle
      </button>
    </div>
  )
}
