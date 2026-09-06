import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import QuoteCTA from "@/components/QuoteCTA";
import Footer from "@/components/Footer";
import { getProjects, getServices, getTestimonials } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [projects, services, testimonials] = await Promise.all([
    getProjects({ featuredOnly: true }),
    getServices(),
    getTestimonials({ featuredOnly: true })
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Projects projects={projects} />
        <About />
        <Skills />
        <Process />
        <Services services={services} />
        <Testimonials testimonials={testimonials} />
        <FAQ />
        <QuoteCTA />
      </main>
      <Footer />
    </>
  );
}
