import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { getPrisma } from "@/lib/prisma";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isSafeInteger(id)) notFound();
  const prisma = await getPrisma();
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item) notFound();
  return <main className="adminMain"><header className="adminPageHeader adminPageHeader--editor"><div><p className="adminEyebrow">Portfolio / Edit</p><h1>{item.title}</h1><p>Update the story, placement, or artwork image.</p></div></header><PortfolioForm item={item} /></main>;
}
