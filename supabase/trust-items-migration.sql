-- Trust Bar (Güven Bantı) öğeleri tablosu
CREATE TABLE IF NOT EXISTS public.trust_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'star',   -- truck | return | phone | chair | star | shield | clock | globe
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Herkese okuma izni
CREATE POLICY "Public read trust_items" ON public.trust_items
  FOR SELECT USING (true);

-- Admin yazma izni
CREATE POLICY "Admin all trust_items" ON public.trust_items
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

ALTER TABLE public.trust_items ENABLE ROW LEVEL SECURITY;

-- Varsayılan öğeler
INSERT INTO public.trust_items (icon, title, description, sort_order) VALUES
  ('truck',  'Hızlı Gönderim',   'Siparişleriniz hızlıca teslim edilir.', 1),
  ('return', 'Kolay İade',       'Sorunsuz iade ve değişim.',             2),
  ('phone',  'Hızlı İletişim',   'WhatsApp ile online destek.',           3),
  ('chair',  'Kaliteli Ürünler', 'Ergonomi ve dayanıklılık önceliğimiz.', 4)
ON CONFLICT DO NOTHING;
