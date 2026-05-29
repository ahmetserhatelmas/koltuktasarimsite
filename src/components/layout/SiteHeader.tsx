"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchOverlay } from "./SearchOverlay";
import type { NavItem } from "@/lib/supabase/types";

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

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15 13l4 1.5v3a1 1 0 0 1-1.1 1A17 17 0 0 1 5.5 5.1 1 1 0 0 1 6.5 4Z" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-sm p-2 text-zinc-800 transition hover:bg-zinc-100 md:hidden"
            aria-label="Menüyü aç"
          >
            <IconMenu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex shrink-0 items-center md:mr-2 lg:mr-4">
            <Image
              src="/brand/logo.png"
              alt="Koltuk Dünyası"
              width={944}
              height={644}
              className="h-14 w-auto sm:h-16 md:h-[4.5rem] lg:h-20"
              priority
            />
          </Link>

          <nav className="hidden flex-1 justify-center md:flex">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-800 lg:gap-x-6 lg:text-xs">
              {navItems.map((item) => {
                const active =
                  !item.href.includes("#") &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`));
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`py-1 transition hover:text-zinc-950 ${active ? "text-zinc-950 underline decoration-2 underline-offset-4" : ""}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-sm p-2 text-zinc-700 transition hover:bg-zinc-100"
              aria-label="Arama"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            <LanguageSwitcher />
            <Link
              href="/iletisim"
              className="hidden items-center gap-2 rounded-sm border border-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-900 transition hover:bg-zinc-900 hover:text-white sm:flex"
            >
              <IconPhone className="h-4 w-4" />
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </header>

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
          className={`absolute left-0 top-0 flex h-[100dvh] w-[min(100%,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <Image
              src="/brand/logo.png"
              alt="Koltuk Dünyası"
              width={944}
              height={644}
              className="h-11 w-auto"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm p-2 hover:bg-zinc-100"
              aria-label="Kapat"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-zinc-100">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-3.5 text-sm font-medium uppercase tracking-wide text-zinc-800 hover:bg-zinc-50"
                >
                  {t.nav.home}
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3.5 text-sm font-medium uppercase tracking-wide text-zinc-800 hover:bg-zinc-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
