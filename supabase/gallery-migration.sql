-- Ürünlere galeri görselleri alanı ekle
-- Supabase SQL Editor'da çalıştırın

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
