-- =====================================================
-- Slider + Kategori + Duyuru çeviri alanları
-- Supabase SQL Editor'da çalıştırın
-- =====================================================

-- Sliders
ALTER TABLE public.sliders
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Categories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Duyuru çevirileri (settings tablosuna ek satırlar)
INSERT INTO public.settings (key, value, label) VALUES
  ('announcement_items_en', '', 'Duyuru Metinleri — English'),
  ('announcement_items_ru', '', 'Duyuru Metinleri — Русский'),
  ('announcement_items_ar', '', 'Duyuru Metinleri — العربية')
ON CONFLICT (key) DO NOTHING;
