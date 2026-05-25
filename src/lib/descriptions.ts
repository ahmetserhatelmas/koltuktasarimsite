/** Her kategori için ürün açıklaması — KoltukDunyam klasöründeki yazı.docx dosyalarından alınmıştır */

export type ProductSpec = { label: string; value: string };

export type CategoryDescription = {
  intro?: string;
  specs?: ProductSpec[];
  bullets?: string[];
  footer?: string;
};

export const CATEGORY_DESCRIPTIONS: Record<string, CategoryDescription> = {
  bar: {
    intro: "Bar taburemiz, yüksek çalışma tezgahları, bar tezgahları ve kafe ortamları için tasarlanmış ergonomik bir oturma çözümüdür.",
    specs: [
      { label: "Oturma Yüksekliği", value: "56–80 cm arası ayarlanabilir" },
      { label: "Oturma Genişliği", value: "39 cm" },
      { label: "Oturma Derinliği", value: "32 cm" },
      { label: "Ayak Tabanı", value: "Krom taban sacı Ø40 cm" },
      { label: "Amortisör", value: "260'lık amortisör" },
      { label: "Kaplama", value: "2 cm 32dns sünger üzerine deri kaplama" },
      { label: "Dönüş", value: "360° dönebilir" },
      { label: "Taşıma Kapasitesi", value: "Maks. 110 kg" },
      { label: "Kutu Ölçüleri", value: "60×40×40 cm" },
      { label: "Garanti", value: "1 yıl" },
    ],
    bullets: [
      "Yükseklik ayarı yapılabilir",
      "Kolay kurulum — montaj gerektirmez",
      "Islak zeminde kullanım önerilmez",
    ],
  },

  konferans: {
    intro: "Konferans, sinema, tiyatro ve seminer salonları için özel üretim koltuk serimiz. Alman hammaddesi ve TSE ISO 9001:2000 kalite sertifikası ile üretilmektedir.",
    specs: [
      { label: "Sünger", value: "60 dns poliüretan dökme sünger" },
      { label: "Ayak", value: "40×60×1,50 mm elektrostatik toz boyalı" },
      { label: "Kumaş", value: "Alev almaz, leke tutmaz, antibakteriyal" },
      { label: "Plastik Aksamlar", value: "PP enjeksiyon, geçmeli vidalı" },
      { label: "Yazı Tablası", value: "PP hareketli — opsiyonel" },
      { label: "Garanti", value: "3 yıl koltuk, 15 yıl poliüretan sünger" },
      { label: "Hammadde", value: "BASF (Alman mali)" },
    ],
    bullets: [
      "İstenilen renk ve adette özel üretim yapılır",
      "Konferans salonlarınızda mimari destek, akustik panel uygulaması, platform yükseltme, ses ve ışıklandırma profesyonel destek hizmetleri",
      "Ücretsiz keşif",
    ],
  },

  stadyum: {
    intro: "TOGAN Stadyum Koltuğu; üniversitelerin desteğiyle antropometrik ölçümlere uygun olarak tasarlanmış, emsallerine göre en ergonomik ürün olarak üretilmektedir.",
    bullets: [
      "Tek koltukta 3 ayrı renk kullanılabilecek şekilde tasarlanmıştır",
      "Minimum 38 cm yüksekliğindeki basamaklara 45 cm oturma yüksekliğinde monte edilerek ideal görüş açısı sağlanır",
      "Kapalı halde 23,20 cm alan kaplar; yaklaşık 56,80 cm geçiş alanı bırakır — tahliye süresini %65 kısaltır",
      "36,60 cm sırt yüksekliği ile yaslanma konforu ve crash barrier işlevi",
      "Gazlı sistem üretim tekniği — 200.000 darbeye dayanıklı (standart 40.000)",
      "UL-94 V2 alev geciktirme standardı — alev aldıktan en geç 25 saniyede söner",
      "Ömür boyu korozyon garantili metal aksamlar",
      "Renk solmasına karşı Grade 5 (Mükemmel) seviyesi — 3 yıl garanti",
      "Uluslararası federasyonların (UEFA vb.) gereksinimlerini karşılar",
    ],
    footer: "Tamamen orijinal hammadde ile üretilmektedir.",
  },
};

/** Ürün ID'sine göre kategori açıklamasını döner */
export function getDescriptionForProduct(id: string): CategoryDescription | null {
  if (id.startsWith("bar-")) return CATEGORY_DESCRIPTIONS.bar;
  if (id.startsWith("ks-") || id.startsWith("kk-")) return CATEGORY_DESCRIPTIONS.konferans;
  if (id.startsWith("st-")) return CATEGORY_DESCRIPTIONS.stadyum;
  return null;
}
