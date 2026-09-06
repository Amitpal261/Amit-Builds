import Link from "next/link";

export default function Hero() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8929682324";
  const message = encodeURIComponent("Hi Amit, I'm interested in getting a website made.");

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-kicker">
          <span />
          Web Developer · Delhi NCR
        </div>

        <h1 className="hero-title">
          I build websites
          <br />
          people <em>remember.</em>
        </h1>

        <div className="hero-bottom">
          <p className="hero-description">
            I design and build fast, modern websites for businesses that want to look
            credible, feel premium and turn visitors into customers.
          </p>

          <div className="hero-actions">
            <a
              href={`https://wa.me/${whatsapp}?text=${message}`}
              target="_blank"
              rel="noopener"
              className="button button-dark"
            >
              Start a project ↗
            </a>
            <Link href="/projects" className="button button-light">
              Explore work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


