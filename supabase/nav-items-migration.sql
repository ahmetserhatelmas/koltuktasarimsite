-- Navigasyon menü öğeleri tablosu
CREATE TABLE IF NOT EXISTS public.nav_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read nav_items" ON public.nav_items
  FOR SELECT USING (true);

CREATE POLICY "Admin all nav_items" ON public.nav_items
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Varsayılan menü öğeleri
INSERT INTO public.nav_items (label, href, sort_order) VALUES
  ('Konferans Sandalyeleri', '/konferans-sandalyeleri', 1),
  ('Konferans Koltukları',   '/konferans-koltuklari',   2),
  ('Bar Taburesi',           '/bar-taburesi',           3),
  ('Stadyum Koltukları',     '/stadyum',                4),
  ('Projeler',               '/#projeler',              5)
ON CONFLICT DO NOTHING;
