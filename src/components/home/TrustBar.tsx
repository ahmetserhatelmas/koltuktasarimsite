function IconTruck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M14 18V6H4v12h2" strokeLinecap="round" />
      <path d="M14 8h3l3 4v6h-3" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function IconReturn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 8h11a3 3 0 0 1 3 3v6H8" strokeLinejoin="round" />
      <path d="M8 17H4v-5" strokeLinejoin="round" />
      <path d="M7 12 4 9l3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15 13l4 1.5v3a1 1 0 0 1-1.1 1A17 17 0 0 1 5.5 5.1 1 1 0 0 1 6.5 4Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChair(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 14h12v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3Z" strokeLinejoin="round" />
      <path d="M8 14V9a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v5" strokeLinejoin="round" />
      <path d="M9 21h6" strokeLinecap="round" />
    </svg>
  );
}

const items = [
  {
    title: "Hızlı Gönderim",
    desc: "Siparişleriniz hızlıca teslim edilir.",
    Icon: IconTruck,
  },
  {
    title: "Kolay İade",
    desc: "Sorunsuz iade ve değişim.",
    Icon: IconReturn,
  },
  {
    title: "Hızlı İletişim",
    desc: "WhatsApp ile online destek.",
    Icon: IconPhone,
  },
  {
    title: "Kaliteli Ürünler",
    desc: "Ergonomi ve dayanıklılık önceliğimiz.",
    Icon: IconChair,
  },
] as const;

export function TrustBar() {
  return (
    <section className="border-b border-zinc-100 bg-zinc-50/60 py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(({ title, desc, Icon }) => (
          <div
            key={title}
            className="flex gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Icon className="mt-1 h-8 w-8 shrink-0 text-zinc-900" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{title}</p>
              <p className="mt-1 text-sm text-zinc-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
