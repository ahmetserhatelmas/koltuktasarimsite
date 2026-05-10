import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT, SITE_NAME } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `İletişim | ${SITE_NAME}`,
  description: "Koltuk Dünyası iletişim — demo sayfa.",
};

function Placeholder({ label, value }: { label: string; value: string }) {
  const display = value.trim();
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-9 w-9 shrink-0 rounded-full border border-zinc-200 bg-zinc-50" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-800">{display || "—"}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-serif text-3xl text-zinc-900 sm:text-4xl">İletişim Bilgilerimiz</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">Sizi arayalım</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Formu doldurun; sipariş, öneri veya diğer talepleriniz için sizi bilgilendirelim. (Demo — gönderim
                yapılmaz.)
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">Bize ulaşın</h2>
              <div className="mt-5 space-y-5">
                <Placeholder label="Telefon" value={CONTACT.phone} />
                <Placeholder label="WhatsApp" value={CONTACT.whatsapp} />
                <Placeholder label="E-posta" value={CONTACT.email} />
                <Placeholder label="Adres" value={CONTACT.address} />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900">İletişim formu</h2>
            <ContactForm />
          </section>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-inner">
          <div className="aspect-[21/9] min-h-[200px] w-full bg-gradient-to-br from-zinc-100 to-zinc-200">
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-500">
              Harita alanı — müşteri adresi netleşince Google Haritalar embed eklenebilir.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
