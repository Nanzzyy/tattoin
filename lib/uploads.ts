import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { deleteObject, publicObjectUrl, putObject } from "@/lib/r2";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export type StoredImage = { imageUrl: string; imageKey: string };

export async function savePortfolioImage(file: File) {
  if (!file.size) return null;
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran gambar maksimal 8 MB.");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Format gambar harus JPG, PNG, WebP, atau AVIF.");

  const input = Buffer.from(await file.arrayBuffer());
  const image = sharp(input, { failOn: "error", limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error("File gambar tidak dapat dibaca.");

  const imageKey = `portfolio/${randomUUID()}.webp`;
  const imageUrl = publicObjectUrl(imageKey);
  const output = await image
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86, smartSubsample: true })
    .toBuffer();

  await putObject(imageKey, output);

  return { imageUrl, imageKey } satisfies StoredImage;
}

export async function deleteUploadedImage(imageKey?: string | null) {
  if (!imageKey || !/^portfolio\/[a-f0-9-]+\.webp$/i.test(imageKey)) return;
  await deleteObject(imageKey);
}
