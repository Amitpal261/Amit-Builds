import Link from "next/link";

export default function QuoteCTA() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918929682324";
  const message = encodeURIComponent("Hi Amit, I'd like to discuss a website project.");

  return (
    <section id="quote" className="quote">
      <div className="container">
        <div className="quote-box">
          <div className="quote-label">Have a project in mind?</div>
          <h2 className="quote-title">Let&apos;s make something people want to use.</h2>

          <div className="quote-bottom">
            <p className="quote-description">
              Tell me what you&apos;re building, what you need and when you want it. I&apos;ll
              get back to you with a clear quote and timeline.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                className="quote-button"
                href={`https://wa.me/${whatsapp}?text=${message}`}
                target="_blank"
                rel="noopener"
              >
                WhatsApp Me <span>↗</span>
              </a>
              <Link className="quote-button" href="/contact">
                Send a Brief <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
