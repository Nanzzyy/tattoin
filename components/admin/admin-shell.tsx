"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { ArrowUpRight, Close, Menu } from "@/components/icons";

const navItems = [
  { href: "/admin", label: "Overview", icon: "⌂" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "▧" },
  { href: "/admin/prices", label: "Price list", icon: "≋" },
];

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="adminShell">
      <aside className={`adminSidebar${open ? " adminSidebar--open" : ""}`}>
        <div className="adminBrand"><span>T</span><div>TATTOIN<small>Studio CMS</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><Close /></button></div>
        <nav aria-label="Admin navigation">
          <p>Workspace</p>
          {navItems.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return <Link className={active ? "active" : ""} key={item.href} href={item.href} onClick={() => setOpen(false)}><span>{item.icon}</span>{item.label}</Link>;
          })}
        </nav>
        <div className="adminSidebarFoot">
          <a href="/" target="_blank">View live site <ArrowUpRight /></a>
          <form action={logoutAction}><button type="submit"><span>{username.slice(0, 1).toUpperCase()}</span><div><b>{username}</b><small>Sign out</small></div></button></form>
        </div>
      </aside>
      <div className="adminStage">
        <header className="adminMobileHeader"><button type="button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button><b>TATTOIN</b><a href="/" target="_blank" aria-label="View site"><ArrowUpRight /></a></header>
        {children}
      </div>
      {open && <button type="button" className="adminOverlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    </div>
  );
}
