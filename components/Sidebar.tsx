"use client";

import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  CircleDotDashed,
  Database,
  LayoutDashboard,
  Plus,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trades", label: "Trades", icon: BookOpenCheck },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <Link href="/" className="brand" onClick={onClose}>
            <span className="brand-mark"><CircleDotDashed size={18} /></span>
            <span>Trade<span className="brand-suffix">Journal</span></span>
          </Link>
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <div className="vault-selector"><Database size={14} /><span>Main Portfolio</span><ChevronDown size={13} /></div>
        <p className="eyebrow sidebar-label">Workspace</p>
        <nav className="nav-list" aria-label="Trading journal navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} onClick={onClose} className={`nav-item ${active ? "active" : ""}`}>
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="privacy-note">
          <span className="privacy-dot" />
          <div><strong>Local database</strong><small>Private on this Mac</small></div>
        </div>
        <Link href="/new" className="new-entry-button" onClick={onClose}>
          <Plus size={18} />
          <span>New Trade</span>
          <kbd>⌘ N</kbd>
        </Link>
      </aside>
    </>
  );
}
