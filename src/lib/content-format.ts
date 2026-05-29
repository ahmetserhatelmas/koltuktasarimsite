export function formatContentHtml(text: string): string {
  if (!text.trim()) return ""

  const lines = text.split("\n")
  const output: string[] = []
  let inList = false

  function inlineParse(line: string): string {
    return line
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()

    if (!line) {
      if (inList) {
        output.push("</ul>")
        inList = false
      }
      continue
    }

    // Başlıklar
    if (line.startsWith("### ")) {
      if (inList) { output.push("</ul>"); inList = false }
      output.push(`<h3 class="mt-6 mb-2 text-lg font-bold text-zinc-900">${inlineParse(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith("## ")) {
      if (inList) { output.push("</ul>"); inList = false }
      output.push(`<h2 class="mt-8 mb-3 text-xl font-bold text-zinc-900">${inlineParse(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith("# ")) {
      if (inList) { output.push("</ul>"); inList = false }
      output.push(`<h1 class="mt-8 mb-4 text-2xl font-bold text-zinc-900">${inlineParse(line.slice(2))}</h1>`)
      continue
    }

    // Madde işareti (- veya *)
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        output.push('<ul class="mb-4 ml-5 list-disc space-y-1 text-zinc-600">')
        inList = true
      }
      output.push(`<li>${inlineParse(line.replace(/^[-*]\s+/, ""))}</li>`)
      continue
    }

    // Sıralı liste (1. 2. ...)
    if (/^\d+\.\s+/.test(line)) {
      if (inList) { output.push("</ul>"); inList = false }
      // Aynı bloğu ordered list olarak işle
      output.push(`<p class="mb-1 leading-relaxed text-zinc-600">${inlineParse(line)}</p>`)
      continue
    }

    // Normal paragraf
    if (inList) { output.push("</ul>"); inList = false }
    output.push(`<p class="mb-4 leading-relaxed text-zinc-600">${inlineParse(line)}</p>`)
  }

  if (inList) output.push("</ul>")

  return output.join("\n")
}
