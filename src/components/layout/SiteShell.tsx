import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingSocial } from "@/components/layout/FloatingSocial";
import { MobileDock } from "@/components/layout/MobileDock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactProvider } from "@/lib/contact-context";
import { getNavItems } from "@/lib/nav-links";
import { createClient } from "@/lib/supabase/server";
import { CONTACT } from "@/lib/site-data";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [{ data: whatsappRow }, navItems] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "contact_whatsapp").single(),
    getNavItems(),
  ]);

  const whatsapp = whatsappRow?.value?.trim() || CONTACT.whatsapp;

  return (
    <ContactProvider whatsapp={whatsapp}>
      <AnnouncementBar />
      <SiteHeader navItems={navItems} />
      <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
      <SiteFooter />
      <MobileDock />
      <FloatingSocial />
    </ContactProvider>
  );
}
