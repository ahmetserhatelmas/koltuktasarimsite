-- Üst kayan duyuru bandı ayarları
INSERT INTO public.settings (key, value, label) VALUES
  ('announcement_enabled', 'true', 'Duyuru Bandı Aktif'),
  ('announcement_items', '["9 AYA VARAN TAKSİT İMKANI","TOPTAN SATIŞ İÇİN **BİZİ ARAYIN!**","TÜM ALIŞVERİŞLERİNİZE **ÜCRETSİZ TESLİMAT!**","SEÇİLİ ÜRÜNLERDE **İNDİRİM FIRSATI**"]', 'Duyuru Metinleri (JSON)')
ON CONFLICT (key) DO NOTHING;
