# YorumAraç

Sürücülerin gerçek araç deneyimleri: yorumlar, kronik sorunlar, "tekrar alır mısın?" oyları.

- Altyapı: [Hono](https://hono.dev) (sunucuda oluşturulan sayfalar), Vercel Functions
- Veritabanı: Neon Postgres (Vercel Marketplace). Tablolar ilk istekte otomatik oluşur. Veritabanı kanundan projesiyle ortak; bu yüzden YorumAraç'ın tabloları `ya_` önekiyle adlandırılır (`ya_reviews`, `ya_issues`, `ya_votes`, `ya_reports`).
- Yayın: `main` dalına her gönderim (push) Vercel'de otomatik yayına çıkar.

## Yerelde çalıştırma

```
npm install
npm run dev
```

http://127.0.0.1:3000 adresini aç. Bağlantı adresi (`DATABASE_URL`) yoksa `.pglite/` klasöründe gömülü bir Postgres kullanılır.

## Vercel ayarları

1. Proje: GitHub'daki `yorumarac` deposuna bağlı. Framework: Hono.
2. Veritabanı: Vercel panelinde proje → **Storage** → **Create Database** → **Neon** → Free → projeye bağla. `DATABASE_URL` ortam değişkeni kendiliğinden eklenir, sonra **Redeploy**.
3. Alan adı: proje → **Settings → Domains** → `yorumarac.com` ve `www.yorumarac.com`. Alan adının kayıtlı olduğu Nics panelinde nameserver'ları `ns1.vercel-dns.com` ve `ns2.vercel-dns.com` yap.

## Moderasyon

Bir içerik 5 farklı kişiden bildirim alınca otomatik gizlenir. Elle müdahale için Neon panelindeki SQL Editor:

```sql
SELECT kind, target_id, reason FROM ya_reports ORDER BY id DESC LIMIT 20;
UPDATE ya_reviews SET status='hidden' WHERE id=12;   -- gizle
UPDATE ya_reviews SET status='live'   WHERE id=12;   -- geri aç
```

## Klasörler

- `src/app.tsx`: sayfa adresleri, formlar, oylar
- `src/views/`: sayfa şablonları
- `src/data/`: 16 kategori ve araç kataloğu (otomobilde 96 marka, 1.067 model)
- `src/sql.ts`: veritabanı bağlantısı ve tablo şeması
- `public/`: stil, JavaScript ve yazı tipleri
