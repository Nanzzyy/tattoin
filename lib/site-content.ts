import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/prisma";

export const getPublicContent = unstable_cache(
  async () => {
    const prisma = await getPrisma();
    return Promise.all([
      prisma.portfolioItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.priceItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    ]);
  },
  ["public-site-content"],
  { revalidate: 60, tags: ["public-site-content"] },
);
