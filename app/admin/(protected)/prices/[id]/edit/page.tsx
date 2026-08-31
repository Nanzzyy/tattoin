import { notFound } from "next/navigation";
import { PriceForm } from "@/components/admin/price-form";
import { prisma } from "@/lib/prisma";

export default async function EditPricePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isSafeInteger(id)) notFound();
  const item = await prisma.priceItem.findUnique({ where: { id } });
  if (!item) notFound();
  return <main className="adminMain"><header className="adminPageHeader adminPageHeader--editor"><div><p className="adminEyebrow">Price list / Edit</p><h1>{item.serviceName}</h1><p>Update the public price, duration, or description.</p></div></header><PriceForm item={item} /></main>;
}
