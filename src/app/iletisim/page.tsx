import type { Metadata } from "next"
import { ContactForm } from "@/components/forms/ContactForm"
import { createClient } from "@/lib/supabase/server"
import { SITE_NAME } from "@/lib/site-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `İletişim | ${SITE_NAME}`,
  description: "Koltuk Dünyası iletişim bilgileri ve konum.",
}

type ContactInfo = {
  phone: string
  whatsapp: string
  email: string
  address: string
  mapEmbedUrl: string
}

async function getContactInfo(): Promise<ContactInfo> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("settings").select("key, value")
    const map = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]))
    return {
      phone: map.contact_phone ?? "",
      whatsapp: map.contact_whatsapp ?? "",
      email: map.contact_email ?? "",
      address: map.contact_address ?? "",
      mapEmbedUrl: map.map_embed_url ?? "",
    }
  } catch {
    return { phone: "", whatsapp: "", email: "", address: "", mapEmbedUrl: "" }
  }
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  if (!value) return null
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-800 underline-offset-2 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-zinc-800">{value}</p>
        )}
      </div>
    </div>
  )
}

export default async function ContactPage() {
  const contact = await getContactInfo()

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-serif text-3xl text-zinc-900 sm:text-4xl">
          İletişim Bilgilerimiz
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">Bize ulaşın</h2>
              <div className="mt-5 space-y-5">
                <ContactRow
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  label="Telefon"
                  value={contact.phone}
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                />
                <ContactRow
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.107 1.523 5.83L.057 23.998l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm.001 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.722.976.995-3.63-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                    </svg>
                  }
                  label="WhatsApp"
                  value={contact.whatsapp ? `+${contact.whatsapp}` : ""}
                  href={`https://wa.me/${contact.whatsapp}`}
                />
                <ContactRow
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  label="E-posta"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
                <ContactRow
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  label="Adres"
                  value={contact.address}
                />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900">Sizi arayalım</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Formu doldurun; sipariş, öneri veya diğer talepleriniz için sizi
              bilgilendirelim.
            </p>
            <ContactForm />
          </section>
        </div>

        {/* Harita */}
        <div className="mt-14 overflow-hidden border border-zinc-200">
          {contact.mapEmbedUrl ? (
            <iframe
              src={contact.mapEmbedUrl}
              className="aspect-[21/9] min-h-[240px] w-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Konum haritası"
            />
          ) : (
            <div className="aspect-[21/9] min-h-[200px] w-full bg-zinc-50 flex items-center justify-center">
              <p className="text-sm text-zinc-400">
                Harita henüz eklenmedi — Admin Paneli → Ayarlar&apos;dan ekleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
