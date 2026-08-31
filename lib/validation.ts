import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess((value) => (value === "" ? undefined : value), z.string().trim().max(max).optional());

const checkbox = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

export const portfolioSchema = z.object({
  title: z.string().trim().min(2, "Judul minimal 2 karakter.").max(80),
  altText: z.string().trim().min(8, "Alt text minimal 8 karakter.").max(160),
  description: optionalText(320),
  style: z.string().trim().min(2, "Style wajib diisi.").max(50),
  featured: checkbox,
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export const priceSchema = z.object({
  serviceName: z.string().trim().min(2, "Nama layanan minimal 2 karakter.").max(80),
  price: z.coerce.number().int().min(0, "Harga tidak boleh negatif.").max(999_999_999),
  description: optionalText(320),
  category: z.string().trim().min(2, "Kategori wajib diisi.").max(50),
  duration: optionalText(80),
  featured: checkbox,
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Data yang dikirim tidak valid.";
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";
}
