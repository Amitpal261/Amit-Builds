import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Amit",
  description: "Tell Amit about your project and get a clear quote and timeline."
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="detail-hero container" style={{ paddingBottom: "160px" }}>
          <div className="hero-kicker">
            <span />
            Get in touch
          </div>
          <h1 className="section-title" style={{ marginBottom: "50px" }}>
            Let&apos;s talk about
            <br />
            <em>your project.</em>
          </h1>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
