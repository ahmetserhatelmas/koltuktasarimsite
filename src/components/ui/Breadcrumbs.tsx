import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 ? <span className="text-zinc-300">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="transition hover:text-zinc-900">
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
