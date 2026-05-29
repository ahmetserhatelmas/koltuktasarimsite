-- =====================================================
-- Settings tablosu — Supabase SQL Editor'da çalıştırın
-- =====================================================

CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admin all settings" ON public.settings
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Başlangıç değerleri
INSERT INTO public.settings (key, value, label) VALUES
  ('map_embed_url',    '', 'Google Harita Embed URL'),
  ('contact_phone',   '+90 543 841 25 50', 'Telefon'),
  ('contact_whatsapp','905438412550', 'WhatsApp Numarası'),
  ('contact_email',   '', 'E-posta'),
  ('contact_address', '', 'Adres'),
  ('social_instagram', '', 'Instagram URL'),
  ('social_facebook',  '', 'Facebook URL'),
  ('social_x',         '', 'X (Twitter) URL'),
  ('social_linkedin',  '', 'LinkedIn URL'),
  ('social_youtube',   '', 'YouTube URL')
ON CONFLICT (key) DO NOTHING;
