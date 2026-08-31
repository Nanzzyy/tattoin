import { prisma } from "@/lib/prisma";
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
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (await prisma.portfolioItem.findFirst({ where: { slug, ...(currentId ? { id: { not: currentId } } : {}) }, select: { id: true } })) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
}

export async function createPortfolioItem(input: PortfolioInput, file: File) {
  const imageUrl = await savePortfolioImage(file);
  if (!imageUrl) throw new Error("Gambar portfolio wajib dipilih.");

  try {
    return await prisma.portfolioItem.create({
      data: { ...input, description: input.description ?? null, slug: await uniqueSlug(input.title), imageUrl },
    });
  } catch (error) {
    await deleteUploadedImage(imageUrl);
    throw error;
  }
}

export async function updatePortfolioItem(id: number, input: PortfolioInput, file?: File | null) {
  const existing = await prisma.portfolioItem.findUniqueOrThrow({ where: { id } });
  const newImageUrl = file?.size ? await savePortfolioImage(file) : null;

  try {
    const updated = await prisma.portfolioItem.update({
      where: { id },
      data: { ...input, description: input.description ?? null, slug: await uniqueSlug(input.title, id), ...(newImageUrl ? { imageUrl: newImageUrl } : {}) },
    });
    if (newImageUrl) await deleteUploadedImage(existing.imageUrl);
    return updated;
  } catch (error) {
    if (newImageUrl) await deleteUploadedImage(newImageUrl);
    throw error;
  }
}

export async function removePortfolioItem(id: number) {
  const item = await prisma.portfolioItem.delete({ where: { id } });
  await deleteUploadedImage(item.imageUrl);
  return item;
}

export function createPriceItem(input: PriceInput) {
  return prisma.priceItem.create({ data: { ...input, description: input.description ?? null, duration: input.duration ?? null } });
}

export function updatePriceItem(id: number, input: PriceInput) {
  return prisma.priceItem.update({ where: { id }, data: { ...input, description: input.description ?? null, duration: input.duration ?? null } });
}

export function removePriceItem(id: number) {
  return prisma.priceItem.delete({ where: { id } });
}
