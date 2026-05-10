import Link from "next/link";

export function BrandStory() {
  return (
    <section className="border-t border-zinc-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl text-zinc-900 sm:text-3xl">Konferans ve ofis koltukları</h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600 sm:text-base">
          <strong className="font-semibold text-zinc-800">Koltuk Dünyası</strong> demo vitrininde; ergonomik çalışma
          sandalyeleri, yönetici modelleri ve gaming serileri için sade, hızlı ve mobil uyumlu bir deneyim
          sunuyoruz. Ürün görselleri referans amaçlıdır — canlı katalog ve stok bilgisi entegrasyonu sonradan
          eklenebilir.
        </p>
        <Link href="/iletisim" className="mt-6 inline-block text-sm font-semibold text-red-600 transition hover:text-red-700">
          Devamı…
        </Link>
      </div>
    </section>
  );
}
