-- Kategorilere aktif/pasif durumu
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE NOT NULL;

UPDATE public.categories SET is_active = TRUE WHERE is_active IS NULL;
