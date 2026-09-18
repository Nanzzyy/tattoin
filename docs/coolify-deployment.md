# Deployment Coolify

Arsitektur production Type B:

```text
Visitor -> Coolify / Next.js -> Neon PostgreSQL
                         \-> Cloudflare R2
```

Neon menyimpan data CMS dan session admin. R2 menyimpan hasil upload gambar; container tidak membutuhkan volume database atau volume upload.

## Konfigurasi resource

Buat Application dari repository Git, branch `main`, lalu pilih build pack **Dockerfile**.

- Base Directory: `/`
- Dockerfile Location: `/Dockerfile`
- Ports Exposes: `41873`
- Healthcheck: sudah tersedia pada `/api/prices`

## Environment variables

Isi environment Coolify dari `.env.example`. Minimal:

```env
PORT=41873
HOSTNAME=0.0.0.0
DATABASE_URL=postgresql://...-pooler....neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://....neon.tech/neondb?sslmode=require
ADMIN_USERNAME=admin
ADMIN_PASSWORD=gunakan-password-random-yang-kuat
NEXT_PUBLIC_SITE_URL=https://domain-production-anda
NEXT_PUBLIC_WHATSAPP_NUMBER=628xxxxxxxxxx
R2_ACCOUNT_ID=cloudflare-account-id
R2_BUCKET_NAME=tattoin-media
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://media.domain-anda.com
```

`DATABASE_URL` memakai hostname Neon yang memiliki suffix `-pooler`. `DIRECT_URL` memakai hostname direct tanpa suffix `-pooler` dan dipakai oleh Prisma CLI. Jangan commit nilai credential.

## Deploy dan migrasi

Migration dijalankan oleh entrypoint container sebelum Next.js start:

```bash
npm run db:deploy
npm run db:seed
```

Untuk Coolify, jalankan `npm run db:seed` sekali setelah deployment pertama melalui terminal/resource command, dengan `ADMIN_PASSWORD` sudah terpasang. Entrypoint hanya menjalankan seed jika `RUN_DB_SEED=true`; biarkan `false` agar restart tidak menyentuh password admin.

Build lokal:

```bash
docker build -t tattoin:coolify .
```

Setelah deploy, periksa healthcheck, halaman publik, login `/admin/login`, dan upload/delete portfolio. Setelah konten diubah, halaman publik memakai revalidation 60 detik dan action admin melakukan invalidasi cache.

Tidak perlu memasang persistent volume untuk `/app/data` atau `/app/public/uploads`. Backup Neon dan lifecycle/backup policy R2 tetap harus diaktifkan terpisah.
