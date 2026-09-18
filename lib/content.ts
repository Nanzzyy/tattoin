import { getPrisma } from "@/lib/prisma";
import { deleteUploadedImage, savePortfolioImage } from "@/lib/uploads";
import { slugify } from "@/lib/validation";

type PortfolioInput = {
  title: string;
  altText: string;
  description?: string;
  style: string;
  featured: boolean;
  sortOrder: number;
};

type PriceInput = {
  serviceName: string;
  price: number;
  description?: string;
  category: string;
  duration?: string;
  featured: boolean;
  sortOrder: number;
};

async function uniqueSlug(title: string, currentId?: number) {
  const prisma = await getPrisma();
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (await prisma.portfolioItem.findFirst({ where: { slug, ...(currentId ? { id: { not: currentId } } : {}) }, select: { id: true } })) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
}

export async function createPortfolioItem(input: PortfolioInput, file: File) {
  const prisma = await getPrisma();
  const image = await savePortfolioImage(file);
  if (!image) throw new Error("Gambar portfolio wajib dipilih.");

  try {
    return await prisma.portfolioItem.create({
      data: { ...input, description: input.description ?? null, slug: await uniqueSlug(input.title), ...image },
    });
  } catch (error) {
    await deleteUploadedImage(image.imageKey);
    throw error;
  }
}

export async function updatePortfolioItem(id: number, input: PortfolioInput, file?: File | null) {
  const prisma = await getPrisma();
  const existing = await prisma.portfolioItem.findUniqueOrThrow({ where: { id } });
  const newImage = file?.size ? await savePortfolioImage(file) : null;

  let updated;
  try {
    updated = await prisma.portfolioItem.update({
      where: { id },
      data: { ...input, description: input.description ?? null, slug: await uniqueSlug(input.title, id), ...(newImage ?? {}) },
    });
  } catch (error) {
    if (newImage) await deleteUploadedImage(newImage.imageKey);
    throw error;
  }

  if (newImage) {
    try {
      await deleteUploadedImage(existing.imageKey);
    } catch (error) {
      // The database already points at the new object; keep it and clean up the old object later.
      console.warn("R2 object cleanup failed after portfolio update.", error);
    }
  }

  return updated;
}

export async function removePortfolioItem(id: number) {
  const prisma = await getPrisma();
  const item = await prisma.portfolioItem.delete({ where: { id } });
  await deleteUploadedImage(item.imageKey);
  return item;
}

export async function createPriceItem(input: PriceInput) {
  const prisma = await getPrisma();
  return prisma.priceItem.create({ data: { ...input, description: input.description ?? null, duration: input.duration ?? null } });
}

export async function updatePriceItem(id: number, input: PriceInput) {
  const prisma = await getPrisma();
  return prisma.priceItem.update({ where: { id }, data: { ...input, description: input.description ?? null, duration: input.duration ?? null } });
}

export async function removePriceItem(id: number) {
  const prisma = await getPrisma();
  return prisma.priceItem.delete({ where: { id } });
}
