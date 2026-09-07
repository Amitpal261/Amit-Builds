"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLogin) return <>{children}</>;

  return (
    <div className={`admin-shell${menuOpen ? " admin-menu-open" : ""}`}>
      <button
        className="admin-menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close admin navigation" : "Open admin navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <button
        className="admin-menu-backdrop"
        type="button"
        aria-label="Close admin navigation"
        onClick={() => setMenuOpen(false)}
      />
      <AdminSidebar onNavigate={() => setMenuOpen(false)} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
