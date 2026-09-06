const faqs = [
  {
    q: "How long does a typical project take?",
    a: "A marketing website usually takes 5–7 days. A full-stack app with a database and admin dashboard takes 2–3 weeks depending on scope."
  },
  {
    q: "Do you work with businesses outside India?",
    a: "Yes. Payments and calls are handled remotely over WhatsApp, email or a video call, whatever works best for you."
  },
  {
    q: "What do you need from me to get started?",
    a: "A short brief on your business, goals and any reference sites you like. I'll turn that into a clear scope and timeline."
  },
  {
    q: "Can you maintain the site after launch?",
    a: "Yes, ongoing support plans are available for fixes, small features and monitoring after your site goes live."
  }
];

export default function FAQ() {
  return (
    <section id="faq">
      <div className="container">
        <div className="section-intro">
          <div className="section-number">07 — FAQ</div>
          <h2 className="section-title">
            Questions you
            <br />
            <em>might be asking.</em>
          </h2>
        </div>

        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
