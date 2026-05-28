import Link from "next/link";
import { CONTACT, SITE_NAME } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/server";

function IconHeadset(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M5 16v-3a7 7 0 0 1 14 0v3" strokeLinecap="round" />
      <path d="M5 16v2a2 2 0 0 0 2 2h1v-6H6a1 1 0 0 0-1 1v1Zm14 0v2a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1v1Z" />
    </svg>
  );
}

function IconWA(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.5 12.3c0 4.5-3.7 8.2-8.2 8.2-1.4 0-2.8-.4-4-1.1L3.5 21l1.7-4.6c-.8-1.3-1.2-2.8-1.2-4.3 0-4.5 3.7-8.2 8.2-8.2s8.3 3.7 8.3 8.2ZM12 4.9a7.3 7.3 0 0 0-6.2 11.1l.2.3-.9 2.6 2.7-.9.3.2a7.3 7.3 0 1 0 3.9-13.3Zm4.2 10.3c-.2.6-1.2 1.1-1.7 1.1s-1 .2-2.2-.7c-1.6-.9-2.6-3-2.7-3.1-.1-.2-.7-.9-.7-1.7s.4-1.2.6-1.4.1-.3.3-.5.2-.3.3-.5.1-.3 0-.5-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.6h-.6a1.2 1.2 0 0 0-.9.4c-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.2.2 2 3 4.9 4.2.7.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.5-.1 1.2-.5 1.4-1 .2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.5Z" />
    </svg>
  );
}

const footerCols = [
  {
    title: "Kategoriler",
    links: [
      ["Konferans Sandalyeleri", "/konferans-sandalyeleri"],
      ["Konferans Koltukları", "/konferans-koltuklari"],
      ["Bar Taburesi", "/bar-taburesi"],
      ["Stadyum", "/stadyum"],
      ["Projeler", "/#projeler"],
    ],
  },
] as const;

function contactLine(label: string, value: string) {
  const display = value.trim() || "—";
  return (
    <p className="text-sm text-zinc-600">
      <span className="font-medium text-zinc-900">{label}: </span>
      {display}
    </p>
  );
}

export async function SiteFooter() {
  // Supabase'den güncel iletişim bilgilerini ve harita URL'sini çek
  let phone = CONTACT.phone;
  let whatsapp = CONTACT.whatsapp;
  let email = CONTACT.email;
  let address = CONTACT.address;
  let mapEmbedUrl = "";

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("settings").select("key, value");
    if (data) {
      const map = Object.fromEntries(data.map((s: { key: string; value: string }) => [s.key, s.value]));
      phone = map.contact_phone || phone;
      whatsapp = map.contact_whatsapp || whatsapp;
      email = map.contact_email || email;
      address = map.contact_address || address;
      mapEmbedUrl = map.map_embed_url || "";
    }
  } catch {
    // Supabase bağlantısı yoksa statik değerlere fallback
  }

  const isValidMap = mapEmbedUrl && (mapEmbedUrl.includes("/maps/embed") || mapEmbedUrl.includes("output=embed"))

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Kategoriler */}
          {footerCols.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <p className="text-sm font-semibold text-zinc-900">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-zinc-600 transition hover:text-zinc-900">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Harita */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-sm font-semibold text-zinc-900">Konum</p>
            {isValidMap ? (
              <div className="overflow-hidden rounded border border-zinc-200">
                <iframe
                  src={mapEmbedUrl}
                  className="h-56 w-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded border border-dashed border-zinc-200 text-xs text-zinc-400">
                Harita eklenmemiş
              </div>
            )}
            {address.trim() && (
              <p className="mt-2 text-xs text-zinc-500">{address}</p>
            )}
          </div>

          {/* İletişim */}
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-sm font-semibold text-zinc-900">İletişim</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
                <IconHeadset className="h-5 w-5 shrink-0 text-zinc-600" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Müşteri Hattı</p>
                  <p className="text-xs text-zinc-600">{phone.trim() || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
                <IconWA className="h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">WhatsApp</p>
                  <p className="text-xs text-zinc-600">{whatsapp.trim() || "—"}</p>
                </div>
              </div>
              {email.trim() && (
                <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
                  <p className="text-xs font-semibold text-zinc-900">E-posta</p>
                  <p className="text-xs text-zinc-600">{email}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500 sm:flex-row sm:text-left">
          <p>
            Tüm hakları saklıdır © {new Date().getFullYear()} — {SITE_NAME}
          </p>
          <p className="text-zinc-400">Tanıtım sitesi</p>
        </div>
      </div>
    </footer>
  );
}
