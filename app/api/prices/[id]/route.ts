import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { removePriceItem, updatePriceItem } from "@/lib/content";
import { firstZodError, priceSchema } from "@/lib/validation";

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
    const parsed = priceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
    const item = await updatePriceItem(id, parsed.data);
    return NextResponse.json({ data: item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update service." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  try {
    await removePriceItem(id);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }
}
