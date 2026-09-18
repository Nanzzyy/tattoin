import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "@/components/icons";
import { formatIDR } from "@/lib/format";
import { getPrisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const prisma = await getPrisma();
  const [portfolioCount, priceCount, featuredCount, latest, priceAggregate] = await Promise.all([
    prisma.portfolioItem.count(),
    prisma.priceItem.count(),
    prisma.portfolioItem.count({ where: { featured: true } }),
    prisma.portfolioItem.findMany({ take: 4, orderBy: { updatedAt: "desc" } }),
    prisma.priceItem.aggregate({ _min: { price: true }, where: { price: { gt: 0 } } }),
  ]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <main className="adminMain">
      <header className="adminPageHeader adminPageHeader--dashboard"><div><p className="adminEyebrow">{now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}</p><h1>{greeting},<br /><em>make your mark.</em></h1></div><a className="adminButton" href="/" target="_blank" rel="noreferrer">View website <ArrowUpRight /></a></header>

      <section className="metricGrid" aria-label="Content overview">
        <article><span>Portfolio pieces</span><strong>{String(portfolioCount).padStart(2, "0")}</strong><Link href="/admin/portfolio">Manage work <ArrowRight /></Link></article>
        <article><span>Services listed</span><strong>{String(priceCount).padStart(2, "0")}</strong><Link href="/admin/prices">Manage pricing <ArrowRight /></Link></article>
        <article><span>Featured pieces</span><strong>{String(featuredCount).padStart(2, "0")}</strong><p>Curated on homepage</p></article>
        <article><span>Prices start at</span><strong className="metricPrice">{formatIDR(priceAggregate._min.price ?? 0)}</strong><p>Public guide price</p></article>
      </section>

      <section className="dashboardGrid">
        <div className="dashboardPanel">
          <div className="panelHeader"><div><p className="adminEyebrow">Recently updated</p><h2>Portfolio</h2></div><Link href="/admin/portfolio">View all <ArrowRight /></Link></div>
          <div className="recentGrid">
            {latest.map((item) => <Link href={`/admin/portfolio/${item.id}/edit`} key={item.id}><div><Image src={item.imageUrl} alt={item.altText} fill unoptimized sizes="180px" /></div><span><b>{item.title}</b><small>{item.style}</small></span></Link>)}
          </div>
        </div>
        <aside className="quickPanel"><p className="adminEyebrow">Quick create</p><h2>Add something<br /><em>new.</em></h2><Link href="/admin/portfolio/new"><Plus /> New artwork</Link><Link href="/admin/prices/new"><Plus /> New service</Link></aside>
      </section>
    </main>
  );
}
