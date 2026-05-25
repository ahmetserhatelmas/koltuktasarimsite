import { ANNOUNCEMENT_TEXT } from "@/lib/site-data";

export function AnnouncementBar() {
  return (
    <div className="bg-zinc-900 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
      {ANNOUNCEMENT_TEXT}
    </div>
  );
}
