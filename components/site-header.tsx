"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Close, Instagram, Menu } from "@/components/icons";

const links = [
  ["Work", "#work"],
  ["Approach", "#approach"],
  ["Pricing", "#pricing"],
  ["Studio", "#studio"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`siteHeader${scrolled ? " siteHeader--scrolled" : ""}`}>
      <Link className="brand" href="/">
        <span className="brandMark">T</span>
        <span>TATTOIN<small>Bali · Indonesia</small></span>
      </Link>

      <nav className="desktopNav" aria-label="Primary navigation">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>

      <div className="headerActions">
        <a className="socialLink" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
        <Link className="button button--small" href="#booking">Book a session <ArrowUpRight /></Link>
        <button className="menuButton" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>{open ? <Close /> : <Menu />}</button>
      </div>

      <div id="mobile-navigation" className={`mobileNav${open ? " mobileNav--open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {links.map(([label, href], index) => <Link key={href} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link>)}
          <Link href="#booking" onClick={() => setOpen(false)}><span>05</span>Book now</Link>
        </nav>
        <p>Custom work · Thoughtful process<br />Bali, Indonesia</p>
      </div>
    </header>
  );
}
