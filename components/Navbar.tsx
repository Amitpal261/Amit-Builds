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
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#111111" strokeWidth="1" opacity="0.55" />
              <circle cx="100" cy="100" r="84" fill="none" stroke="#111111" strokeWidth="0.6" opacity="0.3" />
              <g stroke="#111111" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M100 46 L60 154" />
                <path d="M100 46 L140 154" />
                <path d="M78 108 L122 108" />
              </g>
              <path d="M100 38 L106 46 L100 54 L94 46 Z" fill="#b08d57" />
              <line x1="70" y1="168" x2="130" y2="168" stroke="#b08d57" strokeWidth="1.2" opacity="0.8" />
            </svg>
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
