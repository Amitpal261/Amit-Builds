import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <div className="hero" style={{ minHeight: "60vh" }}>
          <div className="container">
            <div className="hero-kicker">
              <span />
              404
            </div>
            <h1 className="hero-title" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
              Page not found.
            </h1>
            <div style={{ marginTop: "40px" }}>
              <Link href="/" className="button button-dark">
                Back home ↗
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
