import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingSocial } from "@/components/layout/FloatingSocial";
import { MobileDock } from "@/components/layout/MobileDock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
      <SiteFooter />
      <MobileDock />
      <FloatingSocial />
    </>
  );
}
