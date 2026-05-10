import { ANNOUNCEMENT_ITEMS } from "@/lib/site-data";

export function AnnouncementBar() {
  const text = ANNOUNCEMENT_ITEMS.join("   •   ");

  return (
    <div className="bg-zinc-900 text-[11px] font-medium uppercase tracking-wide text-white sm:text-xs">
      <div className="relative overflow-hidden py-2">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block px-6">{text}</span>
          <span className="inline-block px-6" aria-hidden>
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
