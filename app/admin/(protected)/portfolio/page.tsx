import Image from "next/image";
import Link from "next/link";
import { deletePortfolioAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Edit, Plus } from "@/components/icons";
import { getPrisma } from "@/lib/prisma";

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const prisma = await getPrisma();
  const [items, query] = await Promise.all([
    prisma.portfolioItem.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    searchParams,
  ]);

  return (
    <main className="adminMain">
      <header className="adminPageHeader"><div><p className="adminEyebrow">Content library</p><h1>Portfolio <span>{items.length}</span></h1><p>Curate the tattoo work shown on your public website.</p></div><Link className="adminButton adminButton--primary" href="/admin/portfolio/new"><Plus /> Add artwork</Link></header>
      {(query.saved || query.deleted) && <div className="successToast">✓ {query.saved ? "Artwork saved and published." : "Artwork removed."}</div>}
      {items.length ? <div className="adminPortfolioGrid">
        {items.map((item) => (
          <article key={item.id}>
            <div className="adminArtwork"><Image src={item.imageUrl} alt={item.altText} fill unoptimized sizes="(max-width: 700px) 100vw, 30vw" />{item.featured && <span>Featured</span>}</div>
            <div className="adminArtworkMeta"><div><p>{item.style}</p><h2>{item.title}</h2><small>Order {item.sortOrder} · Updated {item.updatedAt.toLocaleDateString("en-GB")}</small></div><div className="cardActions"><Link className="iconButton" href={`/admin/portfolio/${item.id}/edit`} aria-label={`Edit ${item.title}`}><Edit /></Link><form action={deletePortfolioAction.bind(null, item.id)}><DeleteButton label={item.title} /></form></div></div>
          </article>
        ))}
      </div> : <div className="emptyState"><span>▧</span><h2>No artwork yet</h2><p>Publish your first portfolio piece to bring the gallery to life.</p><Link className="adminButton adminButton--primary" href="/admin/portfolio/new">Add artwork</Link></div>}
    </main>
  );
}
