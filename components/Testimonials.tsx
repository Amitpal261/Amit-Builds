import { ITestimonial } from "@/models/Testimonial";

export default function Testimonials({
  testimonials,
  sectionNumber = "06"
}: {
  testimonials: ITestimonial[];
  sectionNumber?: string;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials">
      <div className="container">
        <div className="section-intro">
          <div className="section-number">{sectionNumber} — TESTIMONIALS</div>
          <h2 className="section-title">
            What clients
            <br />
            <em>say about working with me.</em>
          </h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t._id}>
              <div className="testimonial-rating">{"★".repeat(t.rating)}</div>
              <p className="testimonial-message">&ldquo;{t.message}&rdquo;</p>
              <div className="testimonial-person">
                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
