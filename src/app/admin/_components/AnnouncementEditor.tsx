"use client"

interface Props {
  enabled: boolean
  items: string[]
  onEnabledChange: (enabled: boolean) => void
  onItemsChange: (items: string[]) => void
}

export function AnnouncementEditor({
  enabled,
  items,
  onEnabledChange,
  onItemsChange,
}: Props) {
  function updateItem(index: number, value: string) {
    const next = [...items]
    next[index] = value
    onItemsChange(next)
  }

  function addItem() {
    onItemsChange([...items, ""])
  }

  function removeItem(index: number) {
    onItemsChange(items.filter((_, i) => i !== index))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onItemsChange(next)
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onItemsChange(next)
  }

  return (
    <div className="border border-zinc-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Üst Duyuru Bandı
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Sitenin en üstünde kayan metinler. Kalın yazı için{" "}
            <code className="bg-zinc-100 px-1">**metin**</code> kullanın.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          Aktif
        </label>
      </div>

      {/* Önizleme */}
      {enabled && items.some((i) => i.trim()) && (
        <div className="mb-5 overflow-hidden border border-zinc-200">
          <p className="border-b border-zinc-100 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500">
            Önizleme
          </p>
          <div className="bg-[#3d4230] py-2 text-[10px] font-medium uppercase tracking-wide text-white">
            <p className="truncate px-4">
              {items.filter(Boolean).join(" • ")}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="mt-2.5 w-5 shrink-0 text-xs text-zinc-400">{i + 1}.</span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder='örn. TÜM ALIŞVERİŞLERİNİZE **ÜCRETSİZ TESLİMAT!**'
              className="h-10 flex-1 border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="h-4 w-8 border border-zinc-200 text-[10px] text-zinc-500 hover:border-zinc-900 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === items.length - 1}
                className="h-4 w-8 border border-zinc-200 text-[10px] text-zinc-500 hover:border-zinc-900 disabled:opacity-30"
              >
                ↓
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="mt-1 h-10 w-10 shrink-0 border border-zinc-200 text-zinc-400 hover:border-red-300 hover:text-red-600"
              aria-label="Kaldır"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 h-9 border border-dashed border-zinc-300 px-4 text-xs text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-700"
      >
        + Duyuru Ekle
      </button>
    </div>
  )
}
