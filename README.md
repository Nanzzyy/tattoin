# TATTOIN — Tattoo Studio & CMS

Production-ready tattoo studio landing page and built-in content management system, built with Next.js App Router, Prisma, Neon PostgreSQL, Cloudflare R2, and vanilla CSS.

## Local setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The CMS is available at `/admin/login`.

Set a real `ADMIN_USERNAME` and a long random `ADMIN_PASSWORD` in `.env` before running the seed.

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run db:migrate   # Apply checked-in PostgreSQL migrations
npm run db:migrate:dev # Author a migration with Prisma Migrate
npm run db:deploy    # Apply migrations in production
npm run db:seed      # Seed studio content and the initial administrator
npm run db:studio    # Open Prisma Studio
npm run docker:build # Build the Coolify production image
```

## Coolify deployment

The production setup uses one Next.js container, Neon PostgreSQL, and Cloudflare R2. Follow the complete setup in [`docs/coolify-deployment.md`](docs/coolify-deployment.md) and [`docs/neon-r2-setup.md`](docs/neon-r2-setup.md).

## Content and uploads

Portfolio images uploaded from the CMS are validated, resized, stripped of metadata, converted to WebP, and stored in Cloudflare R2. PostgreSQL stores only the public URL and R2 object key.

## Environment

See `.env.example` for every supported variable. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin for correct sitemap, robots, and social metadata URLs.

`DATABASE_URL` is the pooled Neon connection used by the app. `DIRECT_URL` is the direct Neon connection used by Prisma CLI commands. Use `db:migrate:dev` only when authoring a new migration; use `db:deploy` in production.
