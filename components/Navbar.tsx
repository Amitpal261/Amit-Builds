"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        id="mobile-navigation"
        className={`floating-nav${menuOpen ? " mobile-open" : ""}`}
      >
        <Link href="/projects" className="nav-link" onClick={closeMenu}>
          Projects
        </Link>
        <Link href="/services" className="nav-link" onClick={closeMenu}>
          Services
        </Link>
        <Link href="/#skills" className="nav-link" onClick={closeMenu}>
          Skills
        </Link>
        <Link href="/#about" className="nav-link" onClick={closeMenu}>
          About
        </Link>
        <Link href="/contact" className="nav-link nav-cta" onClick={closeMenu}>
          Get a Quote
        </Link>
      </nav>

      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand">
            AMIT.
          </Link>
          <div className="status">
            <span className="status-dot" />
            Available for select projects
          </div>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}
