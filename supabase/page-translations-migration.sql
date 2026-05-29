-- content_pages tablosuna çeviri desteği
ALTER TABLE public.content_pages
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
