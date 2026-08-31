import Link from "next/link";
import { deletePriceAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Edit, Plus } from "@/components/icons";
import { formatIDR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function PricesPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const [items, query] = await Promise.all([
    prisma.priceItem.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    searchParams,
  ]);

  return (
    <main className="adminMain">
      <header className="adminPageHeader"><div><p className="adminEyebrow">Service catalogue</p><h1>Price list <span>{items.length}</span></h1><p>Keep public guide prices clear, current, and considered.</p></div><Link className="adminButton adminButton--primary" href="/admin/prices/new"><Plus /> Add service</Link></header>
      {(query.saved || query.deleted) && <div className="successToast">✓ {query.saved ? "Service saved and published." : "Service removed."}</div>}
      {items.length ? <div className="adminPriceTable">
        <div className="priceTableHead"><span>Service</span><span>Category</span><span>Duration</span><span>Price</span><span>Actions</span></div>
        {items.map((item) => <article key={item.id}><div><small>{item.featured ? "★ Most requested" : `Order ${item.sortOrder}`}</small><b>{item.serviceName}</b><p>{item.description}</p></div><span data-label="Category">{item.category}</span><span data-label="Duration">{item.duration ?? "—"}</span><strong data-label="Price">{formatIDR(item.price)}</strong><div className="cardActions"><Link className="iconButton" href={`/admin/prices/${item.id}/edit`} aria-label={`Edit ${item.serviceName}`}><Edit /></Link><form action={deletePriceAction.bind(null, item.id)}><DeleteButton label={item.serviceName} /></form></div></article>)}
      </div> : <div className="emptyState"><span>≋</span><h2>No services yet</h2><p>Add your first service to publish a price guide.</p><Link className="adminButton adminButton--primary" href="/admin/prices/new">Add service</Link></div>}
    </main>
  );
}
