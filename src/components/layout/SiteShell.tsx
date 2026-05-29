import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingSocial } from "@/components/layout/FloatingSocial";
import { MobileDock } from "@/components/layout/MobileDock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { NAV_MAIN } from "@/lib/site-data";
import type { NavItem } from "@/lib/supabase/types";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: navRaw } = await supabase
    .from("nav_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const navItems: NavItem[] =
    navRaw && navRaw.length > 0
      ? (navRaw as NavItem[])
      : NAV_MAIN.map((item, i) => ({
          id: item.href,
          label: item.label,
          href: item.href,
          sort_order: i + 1,
          is_active: true,
          created_at: "",
        }));

  return (
    <>
      <AnnouncementBar />
      <SiteHeader navItems={navItems} />
      <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
      <SiteFooter />
      <MobileDock />
      <FloatingSocial />
    </>
  );
}
