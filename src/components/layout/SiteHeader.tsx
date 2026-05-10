"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MOBILE_MENU, NAV_MAIN, SITE_NAME } from "@/lib/site-data";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path
        d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7.5-3.3A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
    </svg>
  );
}

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M9 11V8a3 3 0 0 1 6 0v3" strokeLinecap="round" />
      <path d="M5 9h14l-1 11H6L5 9Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path
        d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15 13l4 1.5v3a1 1 0 0 1-1.1 1A17 17 0 0 1 5.5 5.1 1 1 0 0 1 6.5 4Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGlobe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a16 16 0 0 1 0 18M12 3a16 16 0 0 0 0 18" />
    </svg>
  );
}

const flags = ["🇹🇷", "🇬🇧", "🇸🇦", "🇷🇺"] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-shadow supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100 active:scale-95"
            aria-label="Menüyü aç"
          >
            <IconMenu className="h-6 w-6" />
          </button>
          <Link
            href="/#hesap"
            className="rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100"
            aria-label="Hesabım"
          >
            <IconUser className="h-5 w-5" />
          </Link>
        </div>

        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-zinc-900 transition hover:opacity-80 sm:text-2xl md:flex-none"
        >
          {SITE_NAME}
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
          <label className="relative w-full max-w-xl">
            <span className="sr-only">Ara</span>
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Ne aramıştınız?"
              className="h-11 w-full rounded-full border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-4"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-0.5 sm:flex">
            {flags.map((f) => (
              <button
                key={f}
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-zinc-100"
                aria-label="Dil"
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex md:hidden">
            <button
              type="button"
              className="rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100"
              aria-label="Telefon"
            >
              <IconPhone className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100"
              aria-label="Dil seçimi"
            >
              <IconGlobe className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            className="hidden rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100 sm:inline-flex"
            aria-label="Favoriler"
          >
            <IconHeart className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="hidden rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100 md:inline-flex"
            aria-label="Hesabım"
          >
            <IconUser className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative rounded-full p-2 text-zinc-800 transition hover:bg-zinc-100"
            aria-label="Sepet"
          >
            <IconBag className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-semibold text-white">
              0
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-100 px-4 pb-3 pt-0 md:hidden">
        <label className="relative block">
          <span className="sr-only">Ara</span>
          <IconSearch className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Ne aramıştınız?"
            className="h-11 w-full rounded-full border border-zinc-200 bg-white pl-4 pr-11 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-4"
          />
        </label>
      </div>

      <nav className="hidden border-t border-zinc-100 md:block">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-800 lg:gap-x-8 lg:text-xs">
          {NAV_MAIN.map((item) => {
            const active =
              !item.href.includes("#") &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative inline-block py-1 transition hover:text-zinc-950 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-zinc-900 after:transition after:duration-300 hover:after:scale-x-100 ${
                    active ? "text-zinc-950 after:scale-x-100" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>

      {/* Full-viewport overlay: must NOT live inside <header> — backdrop-blur there traps fixed positioning and clips the drawer */}
      <div
        className={`fixed inset-0 z-[100] min-h-[100dvh] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 min-h-[100dvh] bg-black/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-label="Menüyü kapat"
        />
        <div
          className={`absolute left-0 top-0 flex h-[100dvh] min-h-0 w-[min(100%,320px)] max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <span className="font-serif text-lg text-zinc-900">{SITE_NAME}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
              aria-label="Kapat"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-zinc-100">
              {MOBILE_MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Hesabım
            </div>
            <ul className="divide-y divide-zinc-100">
              {["Üye Ol", "Üye Girişi", "Siparişlerim", "Favorilerim"].map((label) => (
                <li key={label}>
                  <Link href="/#hesap" className="block px-4 py-3 text-sm text-zinc-800 hover:bg-zinc-50">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Yardım
            </div>
            <ul className="divide-y divide-zinc-100">
              {["Kargom Nerede", "Bize Ulaşın", "Hesap Numaralarımız"].map((label) => (
                <li key={label}>
                  <Link href="/iletisim" className="block px-4 py-3 text-sm text-zinc-800 hover:bg-zinc-50">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
