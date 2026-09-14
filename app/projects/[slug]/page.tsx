import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProjectBySlug, getProjects } from "@/lib/data";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(?:$|[?#])/i.test(url);
}

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

  const galleryItems = (project.gallery || []).map((item) =>
    typeof item === "string" ? { url: item, size: "small" as const } : { url: item.url, size: item.size || "small" }
  );

  return (
    <div id="project-detail-page" className="page-shell">
      <Navbar />
      <main>
        <div className="detail-hero container">
          <div style={{ marginBottom: "20px" }}>
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#666",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#f0f0ee",
                border: "1px solid var(--line)"
              }}
            >
              ← Back to all projects
            </Link>
          </div>

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

          {galleryItems.length > 0 && (
            <div className={`detail-gallery detail-gallery-count-${Math.min(galleryItems.length, 4)}`}>
              {galleryItems.map((item, i) => (
                <div
                  key={`${item.url}-${i}`}
                  className={`detail-gallery-item detail-gallery-item-${item.size || "small"}`}
                >
                  {isVideoUrl(item.url) ? (
                    <video
                      src={item.url}
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={`${project.title} video ${i + 1}`}
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={`${project.title} screenshot ${i + 1}`}
                      width={1200}
                      height={800}
                      sizes="(max-width: 480px) 100vw, (max-width: 850px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "60px", paddingTop: "30px", borderTop: "1px solid var(--line)", flexWrap: "wrap", gap: "16px" }}>
            <Link href="/projects" className="button button-light">
              ← Back to all projects
            </Link>
            <Link href="/contact" className="button button-dark">
              Discuss a similar project ↗
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
