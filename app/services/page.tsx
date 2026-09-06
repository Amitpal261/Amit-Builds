import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import QuoteCTA from "@/components/QuoteCTA";
import FAQ from "@/components/FAQ";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services & Pricing — Amit",
  description: "Website design, full-stack web apps and ongoing support, with clear starting prices."
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <Navbar />
      <main>
        <div className="detail-hero container">
          <div className="hero-kicker">
            <span />
            Services & Pricing
          </div>
          <h1 className="section-title">
            Clear scope.
            <br />
            <em>Clear pricing.</em>
          </h1>
        </div>
        <Services services={services} sectionNumber="01" />
        <FAQ />
        <QuoteCTA />
      </main>
      <Footer />
    </>
  );
}
