import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site-data";

const posts = [
  {
    title: "Sosyal medyadayız!",
    desc: "Yeni koleksiyonlar, kampanyalar ve dekorasyon fikirleri için bizi sosyal medyadan takip edin.",
    image: "/blog/blog-social.jpg",
    imageAlt: "Modern yaşam alanında şık koltuk ve oturma grubu",
    href: "/#blog",
  },
  {
    title: "Talep veya önerileriniz için",
    desc: "Satış öncesi ve sonrası tüm sorularınız, öneri ve talepleriniz için iletişim formunu kullanabilirsiniz.",
    image: "/blog/blog-iletisim.jpg",
    imageAlt: "Çalışma masasında not alan profesyonel — müşteri iletişimi",
    href: "/iletisim",
  },
  {
    title: "Showroom ve kalite",
    desc: "Seçili kumaşlar, dayanıklı iskelet ve uzun ömürlü döşeme — ürünlerimizi yerinde inceleyebilirsiniz.",
    image: "/blog/blog-showroom.jpg",
    imageAlt: "Aydınlık mobilya showroom’unda koltuk ve oturma düzenlemesi",
    href: "/#uretim",
  },
] as const;

export function BlogGrid() {
  return (
    <section id="blog" className="scroll-mt-28 bg-zinc-50/80 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-zinc-900 sm:text-3xl">{SITE_NAME} Blog</h2>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">Güncel yazılarımızı takip edin.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] bg-zinc-100">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-zinc-900">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{post.desc}</p>
                <Link
                  href={post.href}
                  className="mt-4 inline-flex w-fit items-center gap-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Detaylı Bilgi <span aria-hidden>»</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
