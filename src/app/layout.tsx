import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
