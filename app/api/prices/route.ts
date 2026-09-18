import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { createPriceItem } from "@/lib/content";
import { getPrisma } from "@/lib/prisma";
import { firstZodError, priceSchema } from "@/lib/validation";

export async function GET() {
  const prisma = await getPrisma();
  const items = await prisma.priceItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ data: items }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const parsed = priceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
    const item = await createPriceItem(parsed.data);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create service." }, { status: 400 });
  }
}
