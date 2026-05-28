"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
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
      <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15 13l4 1.5v3a1 1 0 0 1-1.1 1A17 17 0 0 1 5.5 5.1 1 1 0 0 1 6.5 4Z" strokeLinejoin="round" />
    </svg>
  );
}

const items = [
  { href: "/#kategoriler", label: "Kategoriler", Icon: IconList },
  { href: "/konferans-koltuklari", label: "Ürünler", Icon: IconBag },
  { href: "/stadyum", label: "Stadyum", Icon: IconHeart },
  { href: "/iletisim", label: "İletişim", Icon: IconPhone },
] as const;

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Mobil kısayollar"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pt-1">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
                  active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
