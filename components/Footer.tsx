import Link from "next/link";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918929682324";

  const message = encodeURIComponent(
    "Hi Amit, I'm interested in getting a website made.",
  );

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Main CTA */}
        <div className="footer-main">
          <div className="footer-eyebrow">
            <span className="footer-dot" />
            Available for freelance projects
          </div>

          <h2 className="footer-title">
            Have a project
            <br />
            <em>in mind?</em>
          </h2>

          <p className="footer-description">
            I design and build modern websites for businesses, creators and
            brands that want to look better online and turn visitors into
            customers.
          </p>

          <div className="footer-cta">
            <a
              href={`https://wa.me/${whatsapp}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-button footer-button-dark"
            >
              Let's work together ↗
            </a>

            <Link href="/contact" className="footer-button footer-button-light">
              Get in touch
            </Link>
          </div>
        </div>

        {/* Footer information */}
        <div className="footer-grid">
          {/* About */}
          <div className="footer-column footer-about">
            <div className="footer-name">Amit.</div>

            <p>
              Freelance web developer based in Delhi NCR, creating fast, modern
              and conversion-focused websites.
            </p>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h3>Services</h3>

            <Link href="/services">Website Design</Link>
            <Link href="/services">Web Development</Link>
            <Link href="/services">Landing Pages</Link>
            <Link href="/services">Website Redesign</Link>
          </div>

          {/* Explore */}
          <div className="footer-column">
            <h3>Explore</h3>

            <Link href="/">Home</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>

          {/* Connect */}
          <div className="footer-column">
            <h3>Connect</h3>

            <a
              href="https://instagram.com/amit_builds__"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                className="social-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" className="social-icon-fill" />
              </svg>
              Instagram ↗
            </a>

            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg
                className="social-icon social-icon-stroke"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
                <path d="M9 8.5c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.6.7c.6 1.1 1.5 1.9 2.7 2.5l.6-.7c.2-.2.4-.2.7-.1l1.7.8c.2.1.3.3.3.5v.4c0 .3-.1.6-.4.8-.4.3-1 .4-1.5.3-2.1-.5-4.9-2.9-5.9-4.5-.3-.5-.3-1.1 0-1.6Z" />
              </svg>
              WhatsApp ↗
            </a>

            <a href="mailto:creative.minds9953@gmail.com">
              <svg
                className="social-icon social-icon-stroke"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                <path d="m3 7 9 7 9-7" />
              </svg>
              Email ↗
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Amit. All rights reserved.</span>

          <span className="footer-location">Delhi NCR · India</span>

          <a href="#top" className="footer-top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
