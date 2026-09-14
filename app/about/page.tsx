import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skills from "@/components/Skills";
import QuoteCTA from "@/components/QuoteCTA";

export const metadata: Metadata = {
  title: "About — Amit",
  description: "Learn more about Amit, web developer and digital builder specializing in fast, high-conversion web applications."
};

export const revalidate = 60;

export default function AboutPage() {
  return (
    <div id="about-page" className="page-shell">
      <Navbar />
      <main>
        <div className="detail-hero container">
          <div className="hero-kicker">
            <span />
            About Amit
          </div>
          <h1 className="section-title">
            Engineering digital experiences
            <br />
            <em>with clarity and intent.</em>
          </h1>

          <div className="project-image detail-cover-image" style={{ marginTop: "32px", maxHeight: "420px" }}>
            <Image
              src="https://res.cloudinary.com/dmtcpwldk/image/upload/v1788715230/Gemini_Generated_Image_3ei5km3ei5km3ei5_znmhdo.png"
              alt="Amit workspace and engineering workflow"
              width={1600}
              height={900}
              sizes="(max-width: 850px) 100vw, 70vw"
              priority
              unoptimized
            />
          </div>

          <div className="detail-block" style={{ marginTop: "50px" }}>
            <h3>The Philosophy</h3>
            <p>
              I build web applications and digital products that occupy the space where design, technology, and business meet.
              A good website isn&apos;t merely a visual showcase — it is a high-performance business tool designed to load instantly,
              communicate trust, and guide visitors toward clear action.
            </p>
          </div>

          <div className="detail-block">
            <h3>Background & Craft</h3>
            <p>
              Specializing in the modern JavaScript/TypeScript ecosystem (Next.js, React, Node.js, Express, MongoDB, and Tailwind CSS),
              I work with founders, clinic owners, e-commerce brands, and teams looking to upgrade their digital presence. Every project is
              built mobile-first with clean architecture, sub-second load times, and structured SEO.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "40px", flexWrap: "wrap" }}>
            <Link href="/projects" className="button button-dark">
              View Projects ↗
            </Link>
            <Link href="/contact" className="button button-light">
              Get in Touch ↗
            </Link>
          </div>
        </div>

        <Skills />
        <QuoteCTA />
      </main>
      <Footer />
    </div>
  );
}
