export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="text-xl font-bold uppercase tracking-wide text-[var(--accent)] sm:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-zinc-600 sm:text-base">{subtitle}</p> : null}
    </div>
  );
}
