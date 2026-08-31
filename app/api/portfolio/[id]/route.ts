import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { removePortfolioItem, updatePortfolioItem } from "@/lib/content";
import { firstZodError, portfolioSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

function parseId(value: string) {
  const id = Number.parseInt(value, 10);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, { params }: Context) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  try {
    const formData = await request.formData();
    const parsed = portfolioSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
    const fileValue = formData.get("image");
    const item = await updatePortfolioItem(id, parsed.data, fileValue instanceof File ? fileValue : null);
    return NextResponse.json({ data: item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update artwork." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  try {
    await removePortfolioItem(id);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }
}
