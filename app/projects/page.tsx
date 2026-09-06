import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects — Amit",
  description: "Selected web development projects by Amit."
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <div className="detail-hero container">
          <div className="hero-kicker">
            <span />
            All Projects
          </div>
          <h1 className="section-title">
            Everything I&apos;ve
            <br />
            <em>shipped so far.</em>
          </h1>
        </div>
        <Projects projects={projects} />
      </main>
      <Footer />
    </>
  );
}
