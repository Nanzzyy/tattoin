# TATTOIN — Tattoo Studio & CMS

Production-ready tattoo studio landing page and built-in content management system, built with Next.js App Router, Prisma, SQLite, and vanilla CSS.

## Local setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The CMS is available at `/admin/login`.

The development seed credentials are:

- Username: `admin`
- Password: `InkAndIron!2026`

Change `ADMIN_USERNAME` and `ADMIN_PASSWORD` before seeding any production database.

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run db:migrate   # Apply checked-in SQLite migrations
npm run db:migrate:dev # Author a migration with Prisma Migrate
npm run db:deploy    # Apply migrations in production
npm run db:seed      # Seed studio content and the initial administrator
npm run db:studio    # Open Prisma Studio
```

## Content and uploads

Portfolio images uploaded from the CMS are validated, resized, stripped of metadata, converted to WebP, and saved in `public/uploads`. Use persistent storage for the SQLite path configured by `DATABASE_URL` and for `public/uploads` when deploying to a host with an ephemeral filesystem.

## Environment

See `.env.example` for every supported variable. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin for correct sitemap, robots, and social metadata URLs.

`db:migrate` and `db:deploy` use the checked-in Prisma SQL history through the SQLite JavaScript driver, which also works on Linux distributions not targeted by Prisma's schema-engine binary. Use `db:migrate:dev` when authoring new migrations on a Prisma-supported development host.
