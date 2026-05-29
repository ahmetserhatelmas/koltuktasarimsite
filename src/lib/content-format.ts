export function formatContentHtml(text: string): string {
  if (!text.trim()) return ""

  return text
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      const html = trimmed
        .split(/\n/)
        .map((line) =>
          line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        )
        .join("<br />")
      return `<p class="mb-4 leading-relaxed text-zinc-600">${html}</p>`
    })
    .join("")
}
