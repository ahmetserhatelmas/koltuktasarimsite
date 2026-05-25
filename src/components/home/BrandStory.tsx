import Link from "next/link";

export function BrandStory() {
  return (
    <section className="border-t border-zinc-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold uppercase tracking-wide text-[var(--accent)] sm:text-2xl">
          Konferans ve ofis koltukları
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600 sm:text-base">
          <strong className="font-semibold text-zinc-800">Koltuk Dünyası</strong> vitrininde yalnızca KoltukDunyam
          klasörünüzdeki ürünler yer alır: konferans sandalyeleri, konferans koltukları (Dolphin, Martin, Rom),
          bar tabureleri ve stadyum serileri. Fiyatlar için teklif alın.
        </p>
        <Link
          href="/iletisim"
          className="mt-6 inline-flex h-10 items-center border border-zinc-900 px-5 text-xs font-bold uppercase tracking-wider text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
        >
          İletişim
        </Link>
      </div>
    </section>
  );
}
