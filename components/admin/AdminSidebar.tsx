"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" }
];

export default function AdminSidebar({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <svg
          className="admin-brand-logo"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="92" fill="none" stroke="white" strokeWidth="1" opacity="0.55" />
          <circle cx="100" cy="100" r="84" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
          <g stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M100 46 L60 154" />
            <path d="M100 46 L140 154" />
            <path d="M78 108 L122 108" />
          </g>
          <path d="M100 38 L106 46 L100 54 L94 46 Z" fill="#b08d57" />
          <line x1="70" y1="168" x2="130" y2="168" stroke="#b08d57" strokeWidth="1.2" opacity="0.8" />
        </svg>
        <span>AMIT. Admin</span>
      </div>

      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`admin-nav-link${active ? " active" : ""}`}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        );
      })}

      <button className="admin-logout" onClick={handleLogout}>
        Log out
      </button>
    </aside>
  );
}
