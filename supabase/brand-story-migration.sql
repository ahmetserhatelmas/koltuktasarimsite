-- Brand Story (Ana sayfa tanıtım yazısı) settings kayıtları
INSERT INTO public.settings (key, value, label) VALUES
  ('brand_title',    'Konferans ve Ofis Koltukları', 'Marka Başlığı (TR)'),
  ('brand_text',     'Koltuk Dünyası vitrininde yalnızca KoltukDunyam klasörünüzdeki ürünler yer alır: konferans sandalyeleri, konferans koltukları (Dolphin, Martin, Rom), bar tabureleri ve stadyum serileri. Fiyatlar için teklif alın.', 'Marka Metni (TR)'),
  ('brand_title_en', '', 'Marka Başlığı (EN)'),
  ('brand_text_en',  '', 'Marka Metni (EN)'),
  ('brand_title_ru', '', 'Marka Başlığı (RU)'),
  ('brand_text_ru',  '', 'Marka Metni (RU)'),
  ('brand_title_ar', '', 'Marka Başlığı (AR)'),
  ('brand_text_ar',  '', 'Marka Metni (AR)')
ON CONFLICT (key) DO NOTHING;
