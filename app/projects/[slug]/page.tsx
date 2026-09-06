import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProjectBySlug } from "@/lib/data";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found — Amit" };
  return {
    title: `${project.title} — Amit`,
    description: project.description
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main>
        <div className="detail-hero container">
          <div className="hero-kicker">
            <span />
            {project.category}
          </div>

          <h1 className="section-title">{project.title}</h1>

          <div className="detail-meta">
            {project.techStack.map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ddd",
                  borderRadius: "999px",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "#666"
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="project-image detail-cover-image">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={1600}
              height={900}
              sizes="(max-width: 850px) 100vw, 70vw"
              unoptimized
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "40px", flexWrap: "wrap" }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className="button button-dark"
              >
                View Live ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener"
                className="button button-light"
              >
                View Code ↗
              </a>
            )}
          </div>

          <div className="detail-block" style={{ marginTop: "60px" }}>
            <h3>Overview</h3>
            <p>{project.description}</p>
          </div>

          {project.problem && (
            <div className="detail-block">
              <h3>The Problem</h3>
              <p>{project.problem}</p>
            </div>
          )}

          {project.solution && (
            <div className="detail-block">
              <h3>The Solution</h3>
              <p>{project.solution}</p>
            </div>
          )}

          {project.gallery?.length > 0 && (
            <div className="detail-gallery">
              {project.gallery.map((img, i) => (
                <div
                  key={i}
                  className={`detail-gallery-item${i === 0 ? " detail-gallery-featured" : ""}`}
                >
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 480px) 100vw, (max-width: 850px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
