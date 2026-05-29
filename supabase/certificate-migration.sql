-- Ürün sertifika alanları
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS show_certificate BOOLEAN DEFAULT TRUE NOT NULL,
  ADD COLUMN IF NOT EXISTS certificate_url  TEXT;

-- Varsayılan sertifika görseli ayarı
INSERT INTO public.settings (key, value, label)
VALUES ('default_certificate_url', '/brand/certificate.png', 'Varsayılan Sertifika Görseli')
ON CONFLICT (key) DO NOTHING;
