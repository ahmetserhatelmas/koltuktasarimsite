-- =====================================================
-- Koltuk Dünyası — Supabase Schema
-- Supabase dashboard > SQL Editor'da çalıştırın
-- =====================================================

-- Products tablosu
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('bar', 'konferans-sandalyeleri', 'konferans-koltuklari', 'stadyum')
  ),
  image_url TEXT,
  price NUMERIC(10, 2) DEFAULT 0,
  old_price NUMERIC(10, 2) DEFAULT 0,
  quote_only BOOLEAN DEFAULT TRUE,
  description_intro TEXT,
  description_specs JSONB DEFAULT '[]'::jsonb,
  description_bullets JSONB DEFAULT '[]'::jsonb,
  description_footer TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sliders tablosu (hero slider)
CREATE TABLE IF NOT EXISTS public.sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accent TEXT,
  headline_italic TEXT,
  headline_bold TEXT,
  sub_text TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories tablosu
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  route TEXT NOT NULL,
  tagline TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Öne çıkan ürünler tablosu
CREATE TABLE IF NOT EXISTS public.featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(product_id)
);

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Public read sliders" ON public.sliders
  FOR SELECT USING (true);

CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public read featured" ON public.featured_products
  FOR SELECT USING (true);

-- Admin yazma izni (app_metadata.role = 'admin')
CREATE POLICY "Admin all products" ON public.products
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin all sliders" ON public.sliders
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin all categories" ON public.categories
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin all featured" ON public.featured_products
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- =====================================================
-- Storage bucket
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admin upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
