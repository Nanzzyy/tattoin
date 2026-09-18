import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/prisma";

export const PUBLIC_CONTENT_CACHE_TAG = "public-site-content-v2";

export const getPublicContent = unstable_cache(
  async () => {
    const prisma = await getPrisma();
    return Promise.all([
      prisma.portfolioItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.priceItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    ]);
  },
  [PUBLIC_CONTENT_CACHE_TAG],
  { revalidate: 60, tags: [PUBLIC_CONTENT_CACHE_TAG] },
);
