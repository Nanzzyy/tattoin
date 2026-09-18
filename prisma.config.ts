import "dotenv/config";
import { defineConfig } from "prisma/config";

function isPlaceholderUrl(value: string) {
  try {
    return new URL(value).hostname.includes(".REGION.");
  } catch {
    return true;
  }
}

function deriveDirectUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    url.hostname = url.hostname.replace("-pooler.", ".");
    return url.toString();
  } catch {
    return undefined;
  }
}

const directUrl = process.env.DIRECT_URL && !isPlaceholderUrl(process.env.DIRECT_URL)
  ? process.env.DIRECT_URL
  : deriveDirectUrl(process.env.DATABASE_URL) ?? "postgresql://postgres:postgres@localhost:5432/tattoin?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI uses the direct Neon connection for migrations and Studio.
    url: directUrl,
  },
});
