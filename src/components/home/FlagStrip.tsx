const flags = [
  { code: "DE", label: "Almanya" },
  { code: "AZ", label: "Azerbaycan" },
  { code: "IQ", label: "Irak" },
  { code: "MD", label: "Moldova" },
  { code: "EG", label: "Mısır" },
  { code: "GE", label: "Gürcistan" },
  { code: "CY", label: "Kıbrıs" },
] as const;

export function FlagStrip() {
  return (
    <section className="border-y border-zinc-100 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {flags.map((f) => (
          <div
            key={f.code}
            className="flex h-11 min-w-[72px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-zinc-300 hover:bg-white"
            title={f.label}
          >
            {f.code}
          </div>
        ))}
      </div>
    </section>
  );
}
