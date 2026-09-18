# Setup Neon + Cloudflare R2

## 1. Neon

Buat satu Neon project/database untuk client ini. Simpan dua connection string:

- pooled URL untuk `DATABASE_URL`;
- direct URL untuk `DIRECT_URL`.

Setelah `.env` terisi, jalankan migration Prisma:

```bash
npm install
npm run db:deploy
npm run db:seed
```

SQL schema yang dijalankan ada di [`prisma/migrations/20260918000000_neon_init/migration.sql`](../prisma/migrations/20260918000000_neon_init/migration.sql).

Jika perlu menjalankan SQL secara manual melalui `psql`, gunakan ini pada database Neon yang masih kosong:

```bash
psql "$DIRECT_URL" -v ON_ERROR_STOP=1 \
  -f prisma/migrations/20260918000000_neon_init/migration.sql
npx prisma migrate resolve --applied 20260918000000_neon_init
```

Gunakan cara manual tersebut sebagai pengganti `npm run db:deploy`, bukan sesudahnya. `migrate resolve` diperlukan agar Prisma mencatat migration sebagai sudah diterapkan.

## 2. Cloudflare R2

1. Buat bucket, misalnya `tattoin-media`.
2. Buat R2 API token dengan hak Object Read & Write hanya untuk bucket tersebut.
3. Aktifkan public access melalui custom domain seperti `media.domain-anda.com` atau URL `r2.dev`.
4. Isi `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, dan `R2_PUBLIC_URL`.

Upload dilakukan melalui server action/API sehingga credential R2 tidak masuk ke browser. Karena URL media dikirim langsung dari public R2 domain, konfigurasi CORS browser tidak diperlukan untuk jalur upload CMS ini.

Object key yang disimpan pada database berbentuk `portfolio/<uuid>.webp`. Kolom `imageUrl` adalah URL publik untuk rendering; kolom `imageKey` dipakai saat mengganti atau menghapus gambar.

## 3. Validasi cepat

```bash
npm run typecheck
npm run lint
npm run build
```

Setelah login ke `/admin/portfolio`, upload satu gambar baru. Pastikan object `portfolio/...webp` muncul di bucket R2 dan gambar tampil di halaman publik.
