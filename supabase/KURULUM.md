# Supabase Kurulum Talimatları

## 1. Supabase Projesi Oluştur

1. https://supabase.com adresine gidin ve giriş yapın
2. "New Project" butonuna tıklayın
3. Proje adı girin (örn. `koltukdunyasi`)
4. Güçlü bir veritabanı şifresi belirleyin
5. Region seçin (Europe Frankfurt önerilir)

## 2. Ortam Değişkenlerini Ayarla

Supabase Dashboard'da **Settings → API** bölümüne gidin ve şu değerleri kopyalayın:

`.env.local` dosyasını açın ve doldurun:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## 3. Şemayı Oluştur

Supabase Dashboard'da **SQL Editor** bölümüne gidin.
`supabase/schema.sql` dosyasının tüm içeriğini kopyalayıp çalıştırın.

## 4. Admin Kullanıcısı Oluştur

### a) Kullanıcı oluştur
Supabase Dashboard → **Authentication → Users → Invite User**
E-posta ve şifre belirleyin.

### b) Admin rolü ver
SQL Editor'da çalıştırın (kullanıcı ID'nizi ve e-postanızı girin):

```sql
-- Önce kullanıcı ID'sini bulun
SELECT id FROM auth.users WHERE email = 'admin@email.com';

-- Ardından admin rolü verin (ID'yi değiştirin)
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@email.com';
```

## 5. Mevcut Verileri Yükle (Seed)

```bash
node scripts/seed-supabase.mjs
```

Bu komut:
- 62 mevcut ürünü ekler
- 3 hero slider'ı ekler
- 5 kategoriyi ekler
- 10 öne çıkan ürünü ekler

## 6. Siteyi Çalıştır

```bash
npm run dev
```

Admin paneline erişim: http://localhost:3000/admin

## Storage Hakkında

Yeni ürün görselleri `media` bucket'ına yüklenir.
Schema.sql çalıştırıldığında bucket otomatik oluşturulur.

Eğer oluşmadıysa, Supabase Dashboard → **Storage → Create Bucket**
- Name: `media`
- Public: ✓ (işaretli olmalı)
