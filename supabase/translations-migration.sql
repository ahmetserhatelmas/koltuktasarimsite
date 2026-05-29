-- =====================================================
-- Ürün çeviri alanı — Supabase SQL Editor'da çalıştırın
-- =====================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Örnek yapı:
-- {
--   "en": { "name": "...", "description_intro": "...", "description_footer": "...",
--            "description_bullets": ["..."], "description_specs": [{"label":"...","value":"..."}] },
--   "ru": { ... },
--   "ar": { ... }
-- }
