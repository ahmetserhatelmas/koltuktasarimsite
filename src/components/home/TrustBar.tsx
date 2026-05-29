"use client"

export type TrustIcon = "truck" | "return" | "phone" | "chair" | "star" | "shield" | "clock" | "globe"

export type TrustItem = {
  id: string
  icon: TrustIcon
  title: string
  description: string
  sort_order: number
  is_active: boolean
}

function TrustIconSvg({ icon, ...props }: { icon: TrustIcon } & React.SVGProps<SVGSVGElement>) {
  const shared = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", ...props }
  switch (icon) {
    case "truck":
      return (
        <svg {...shared}>
          <path d="M14 18V6H4v12h2" strokeLinecap="round" />
          <path d="M14 8h3l3 4v6h-3" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      )
    case "return":
      return (
        <svg {...shared}>
          <path d="M4 8h11a3 3 0 0 1 3 3v6H8" strokeLinejoin="round" />
          <path d="M8 17H4v-5" strokeLinejoin="round" />
          <path d="M7 12 4 9l3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "phone":
      return (
        <svg {...shared}>
          <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15 13l4 1.5v3a1 1 0 0 1-1.1 1A17 17 0 0 1 5.5 5.1 1 1 0 0 1 6.5 4Z" strokeLinejoin="round" />
        </svg>
      )
    case "chair":
      return (
        <svg {...shared}>
          <path d="M6 14h12v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3Z" strokeLinejoin="round" />
          <path d="M8 14V9a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v5" strokeLinejoin="round" />
          <path d="M9 21h6" strokeLinecap="round" />
        </svg>
      )
    case "star":
      return (
        <svg {...shared}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
        </svg>
      )
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 4 7v5c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V7l-8-4Z" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "clock":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "globe":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M2 12h20M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

const DEFAULT_ITEMS: TrustItem[] = [
  { id: "1", icon: "truck",  title: "Hızlı Gönderim",   description: "Siparişleriniz hızlıca teslim edilir.", sort_order: 1, is_active: true },
  { id: "2", icon: "return", title: "Kolay İade",       description: "Sorunsuz iade ve değişim.",             sort_order: 2, is_active: true },
  { id: "3", icon: "phone",  title: "Hızlı İletişim",   description: "WhatsApp ile online destek.",           sort_order: 3, is_active: true },
  { id: "4", icon: "chair",  title: "Kaliteli Ürünler", description: "Ergonomi ve dayanıklılık önceliğimiz.", sort_order: 4, is_active: true },
]

export function TrustBar({ items }: { items?: TrustItem[] }) {
  const displayItems = (items && items.length > 0 ? items : DEFAULT_ITEMS).filter((i) => i.is_active)

  return (
    <section className="border-y border-zinc-200 bg-white py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
        {displayItems.map((item) => (
          <div key={item.id} className="flex gap-4 border-l-2 border-zinc-900 pl-4">
            <TrustIconSvg icon={item.icon} className="mt-1 h-8 w-8 shrink-0 text-zinc-900" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
              <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
