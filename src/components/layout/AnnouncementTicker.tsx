import { splitAnnouncementText } from "@/lib/announcements"

interface Props {
  items: string[]
}

export function AnnouncementTicker({ items }: Props) {
  const segments = items.map((text, i) => (
    <span key={i} className="inline-flex shrink-0 items-center">
      <span className="px-8">
        {splitAnnouncementText(text).map((part, j) =>
          part.bold ? (
            <strong key={j} className="font-bold">
              {part.text}
            </strong>
          ) : (
            <span key={j}>{part.text}</span>
          )
        )}
      </span>
      <span className="opacity-60" aria-hidden>
        •
      </span>
    </span>
  ))

  return (
    <div
      className="border-b border-[#2f3628] bg-[#3d4230] py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white sm:text-xs"
      role="region"
      aria-label="Duyurular"
    >
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {segments}
          {segments}
        </div>
      </div>
    </div>
  )
}
