-- Ürünlere renk seçenekleri ekle
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;
