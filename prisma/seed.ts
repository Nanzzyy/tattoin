import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

function directConnectionUrl() {
  const configured = process.env.DIRECT_URL;
  if (configured) {
    try {
      if (!new URL(configured).hostname.includes(".REGION.")) return configured;
    } catch {
      // Fall through to the pooled URL below.
    }
  }

  const pooled = process.env.DATABASE_URL;
  if (!pooled) return undefined;

  try {
    const url = new URL(pooled);
    url.hostname = url.hostname.replace("-pooler.", ".");
    return url.toString();
  } catch {
    return undefined;
  }
}

const connectionString = directConnectionUrl();
if (!connectionString) throw new Error("DIRECT_URL atau DATABASE_URL belum dikonfigurasi.");

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD wajib diisi sebelum menjalankan seed.");
  const passwordHash = await bcrypt.hash(password, 12);

  const existingAdmin = await prisma.adminUser.findUnique({ where: { username } });
  if (!existingAdmin) {
    await prisma.adminUser.create({ data: { username, passwordHash } });
  } else if (process.env.RESET_ADMIN_PASSWORD === "true") {
    await prisma.adminUser.update({ where: { username }, data: { passwordHash, failedLoginCount: 0, lockedUntil: null } });
  }

  const portfolio = [
    { title: "Nocturne Raven", slug: "nocturne-raven", imageUrl: "/images/portfolio-raven.png", altText: "Blackwork raven and botanical tattoo on an upper arm", description: "Blackwork composition with botanical linework and a quiet, gothic rhythm.", style: "Blackwork", featured: true, sortOrder: 1 },
    { title: "Wild Bloom", slug: "wild-bloom", imageUrl: "/images/portfolio-floral.png", altText: "Fine-line floral tattoo across a shoulder blade", description: "A soft single-needle arrangement drawn to move naturally with the shoulder.", style: "Fine line", featured: true, sortOrder: 2 },
    { title: "Koi Current", slug: "koi-current", imageUrl: "/images/portfolio-koi.png", altText: "Japanese-inspired koi and wave forearm tattoo", description: "Layered scales and water movement in black with restrained oxblood accents.", style: "Japanese", featured: true, sortOrder: 3 },
    { title: "Sacred Geometry", slug: "sacred-geometry", imageUrl: "/images/portfolio-geometry.png", altText: "Geometric ornamental tattoo flowing along a calf", description: "Architectural dotwork built around the body's natural lines.", style: "Ornamental", featured: false, sortOrder: 4 },
    { title: "Lunar Moth", slug: "lunar-moth", imageUrl: "/images/portfolio-moth.png", altText: "Minimalist crescent moon and moth forearm tattoo", description: "Celestial symbolism rendered in delicate line and stipple work.", style: "Minimal", featured: false, sortOrder: 5 }
  ];

  for (const item of portfolio) {
    await prisma.portfolioItem.upsert({ where: { slug: item.slug }, update: item, create: item });
  }

  const prices = [
    { serviceName: "Flash Piece", price: 750000, description: "Curated ready-to-ink design, up to 8 cm.", category: "Tattoo", duration: "1–2 hours", featured: false, sortOrder: 1 },
    { serviceName: "Fine Line", price: 1200000, description: "Custom minimal linework tailored to your placement.", category: "Tattoo", duration: "2–3 hours", featured: true, sortOrder: 2 },
    { serviceName: "Blackwork Session", price: 2500000, description: "Half-day custom blackwork or ornamental session.", category: "Tattoo", duration: "4–5 hours", featured: false, sortOrder: 3 },
    { serviceName: "Full Day Session", price: 4500000, description: "For large-scale custom work and continuing projects.", category: "Tattoo", duration: "7–8 hours", featured: true, sortOrder: 4 },
    { serviceName: "Design Consultation", price: 150000, description: "In-depth concept, placement, and sizing session; deducted from your booking.", category: "Consultation", duration: "45 minutes", featured: false, sortOrder: 5 },
    { serviceName: "Touch-up", price: 0, description: "One complimentary touch-up within 90 days for eligible work.", category: "Aftercare", duration: "By assessment", featured: false, sortOrder: 6 }
  ];

  if (await prisma.priceItem.count() === 0) {
    await prisma.priceItem.createMany({ data: prices });
  }

  console.info(`Seed complete. Admin user: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
