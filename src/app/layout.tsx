import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import { SiteShell } from "@/components/layout/SiteShell";
import { I18nProvider } from "@/lib/i18n/context";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n/types";
import { SITE_NAME } from "@/lib/site-data";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Konferans, bar ve stadyum koltukları`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Koltuk Dünyası — konferans sandalyeleri, konferans koltukları, bar tabureleri ve stadyum koltuk sistemleri.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = rawLocale && LOCALES.includes(rawLocale as Locale) ? (rawLocale as Locale) : "tr";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased">
        <I18nProvider initialLocale={locale}>
          <SiteShell>{children}</SiteShell>
        </I18nProvider>
      </body>
    </html>
  );
}
