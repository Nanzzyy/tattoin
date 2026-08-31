import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const uploadDirectory = path.join(process.cwd(), "public", "uploads");

export async function savePortfolioImage(file: File) {
  if (!file.size) return null;
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran gambar maksimal 8 MB.");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Format gambar harus JPG, PNG, WebP, atau AVIF.");

  const input = Buffer.from(await file.arrayBuffer());
  const image = sharp(input, { failOn: "error", limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error("File gambar tidak dapat dibaca.");

  await mkdir(uploadDirectory, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  await image
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86, smartSubsample: true })
    .toFile(path.join(uploadDirectory, filename));

  return `/uploads/${filename}`;
}

export async function deleteUploadedImage(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/")) return;
  const filename = path.basename(imageUrl);
  if (!/^[a-f0-9-]+\.webp$/i.test(filename)) return;

  try {
    await unlink(path.join(uploadDirectory, filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
