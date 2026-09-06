import { IService } from "@/models/Service";

const fallback: Partial<IService>[] = [
  {
    title: "Website Design",
    description: "A clean, responsive marketing website built to convert visitors into leads.",
    startingPrice: "₹5,000",
    deliveryTime: "5–7 days",
    features: ["Responsive design", "Mobile optimization", "SEO basics", "WhatsApp integration"],
    icon: "◆"
  },
  {
    title: "Full-Stack Web App",
    description: "A complete product with authentication, database and an admin dashboard.",
    startingPrice: "₹18,000",
    deliveryTime: "2–3 weeks",
    features: ["Next.js + MongoDB", "Admin dashboard", "Auth & roles", "API integration"],
    icon: "▲",
    featured: true
  },
  {
    title: "Ongoing Support",
    description: "Monthly maintenance, small features and fixes for an existing product.",
    startingPrice: "₹3,000/mo",
    deliveryTime: "Ongoing",
    features: ["Bug fixes", "Small feature adds", "Performance checks", "Priority WhatsApp support"],
    icon: "●"
  }
];

export default function Services({
  services,
  sectionNumber = "05"
}: {
  services: IService[];
  sectionNumber?: string;
}) {
  const list = services.length > 0 ? services : (fallback as IService[]);

  return (
    <section id="services">
      <div className="container">
        <div className="section-intro">
          <div className="section-number">{sectionNumber} — SERVICES</div>
          <h2 className="section-title">
            What I can
            <br />
            <em>build for you.</em>
          </h2>
        </div>

        <div className="services-grid">
          {list.map((service) => (
            <div
              className={`service-card${service.featured ? " featured" : ""}`}
              key={service.title}
            >
              <div className="service-icon">{service.icon || "✦"}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-price">{service.startingPrice}</div>
              <div className="service-delivery">{service.deliveryTime}</div>
              <ul className="service-features">
                {service.features?.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
