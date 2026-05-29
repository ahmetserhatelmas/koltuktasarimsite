-- Footer içerik sayfaları (Kurumsal + Yasal)
CREATE TABLE IF NOT EXISTS public.content_pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('kurumsal', 'yasal')),
  content TEXT DEFAULT '',
  image_url TEXT,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read content_pages" ON public.content_pages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin all content_pages" ON public.content_pages
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

INSERT INTO public.content_pages (slug, title, section, content, link_url, sort_order) VALUES
  ('hakkimizda', 'Hakkımızda', 'kurumsal', '', NULL, 1),
  ('project-export', 'Project & Export', 'kurumsal', '', NULL, 2),
  ('referanslar', 'Referanslar', 'kurumsal', '', NULL, 3),
  ('sikca-sorulanlar', 'Sıkça Sorulanlar', 'kurumsal', '', NULL, 4),
  ('blog', 'Blog', 'kurumsal', '', NULL, 5),
  ('bize-ulasin', 'Bize Ulaşın', 'kurumsal', '', '/iletisim', 6),
  ('kvkk', 'K.V.K.K. Bilgilendirmesi', 'yasal', '', NULL, 1),
  ('gizlilik', 'Gizlilik Sözleşmesi', 'yasal', '', NULL, 2),
  ('cerez', 'Çerez Kullanımı', 'yasal', '', NULL, 3),
  ('cevre', 'Çevre Politikası', 'yasal', '', NULL, 4)
ON CONFLICT (slug) DO NOTHING;
