import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CONTACT, SITE_NAME } from "@/lib/site-data";

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

function IconPackage(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3Z" strokeLinejoin="round" />
      <path d="M12 12 21 7.5M12 12v9M12 12 3 7.5" strokeLinecap="round" strokeLinejoin="round" />
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
  {
    title: "Kurumsal",
    links: [
      ["Hakkımızda", "/#kurumsal"],
      ["Project & Export", "/#export"],
      ["Referanslar", "/#referans"],
      ["Sıkça Sorulanlar", "/#sss"],
      ["Hesap Numaraları", "/#hesap"],
      ["Bize Ulaşın", "/iletisim"],
    ],
  },
  {
    title: "Yasal Bilgilendirme",
    links: [
      ["K.V.K.K. Bilgilendirmesi", "/#kvkk"],
      ["Gizlilik Sözleşmesi", "/#gizlilik"],
      ["Mesafeli Satış Sözleşmesi", "/#mesafeli"],
      ["İade ve Değişim Koşulları", "/#iade"],
      ["Üyelik Sözleşmesi", "/#uyelik"],
      ["Çerez Kullanımı", "/#cerez"],
      ["Çevre Politikası", "/#cevre"],
    ],
  },
  {
    title: "Alışveriş",
    links: [
      ["Yeni Üyelik", "/#uye"],
      ["Üye Girişi", "/#giris"],
      ["Siparişlerim", "/#siparis"],
      ["Favori Ürünlerim", "/#favori"],
      ["Şifremi Unuttum", "/#sifre"],
      ["Alışveriş Sepetim", "/#sepet"],
      ["Havale Bildirim Formu", "/#havale"],
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

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-md lg:text-right lg:ml-auto">
            <p className="text-sm font-semibold text-zinc-900">E-Bültene Kaydol</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
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

          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-sm font-semibold text-zinc-900">İletişim</p>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                <IconHeadset className="mt-0.5 h-6 w-6 shrink-0 text-zinc-700" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Müşteri Hattı</p>
                  {contactLine("Telefon", CONTACT.phone)}
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                <IconWA className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">WhatsApp Destek</p>
                  {contactLine("WhatsApp", CONTACT.whatsapp)}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-sm font-semibold text-zinc-900">E-posta</p>
                {contactLine("E-posta", CONTACT.email)}
                <p className="mt-3 text-sm font-semibold text-zinc-900">Adres</p>
                <p className="mt-1 text-sm text-zinc-600">{CONTACT.address.trim() || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500 sm:flex-row sm:text-left">
          <p>
            Tüm hakları saklıdır © {new Date().getFullYear()} — {SITE_NAME}
          </p>
          <p className="text-zinc-400">Demo vitrin sitesi</p>
        </div>
      </div>
    </footer>
  );
}
