"use client"

interface Props {
  value: string[]
  onChange: (bullets: string[]) => void
  label?: string
}

export function BulletsEditor({
  value,
  onChange,
  label = "Madde Listesi",
}: Props) {
  function update(index: number, text: string) {
    onChange(value.map((b, i) => (i === index ? text : b)))
  }

  function add() {
    onChange([...value, ""])
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <div className="space-y-2">
        {value.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">•</span>
            <input
              type="text"
              value={bullet}
              onChange={(e) => update(i, e.target.value)}
              placeholder="Madde metni..."
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
        + Madde Ekle
      </button>
    </div>
  )
}
