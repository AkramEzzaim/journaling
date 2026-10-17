"use client";

import { ChevronRight, LockKeyhole, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const command = event.metaKey || event.ctrlKey;
      if (command && event.key.toLowerCase() === "n") {
        event.preventDefault();
        router.push("/new");
      }
      if (command && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (pathname !== "/trades") router.push("/trades?focus=search");
        else document.querySelector<HTMLInputElement>("[data-trade-search]")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  const pageName = pathname === "/"
      ? "Dashboard"
    : pathname.startsWith("/trades/")
      ? "Trade"
      : pathname.split("/")[1].replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <header className="topbar">
        <button className="topbar-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={17} /></button>
        <div className="topbar-context"><span>Trading Journal</span><ChevronRight size={12} /><strong>{pageName}</strong></div>
        <div className="topbar-actions">
          <span className="local-status"><LockKeyhole size={12} />Local only</span>
          <time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date())}</time>
          <Link href="/new" className="topbar-new" aria-label="New trade"><Plus size={16} /></Link>
        </div>
      </header>
      <main className="main-area">{children}</main>
    </div>
  );
}
