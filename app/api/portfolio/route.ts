import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { createPortfolioItem } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { firstZodError, portfolioSchema } from "@/lib/validation";

export async function GET() {
  const items = await prisma.portfolioItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ data: items }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const parsed = portfolioSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
    const file = formData.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Image is required." }, { status: 400 });
    const item = await createPortfolioItem(parsed.data, file);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create artwork." }, { status: 400 });
  }
}
