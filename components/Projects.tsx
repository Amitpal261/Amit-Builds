"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProject } from "@/models/Project";
import {
  Tag,
  Plane,
  Heart,
  ExternalLink,
  ArrowUpRight,
  Layers,
  LayoutGrid,
  X,
  Sparkles
} from "lucide-react";

interface ProjectsProps {
  projects?: IProject[];
  showHeading?: boolean;
}

const fallbackProjects: Partial<IProject>[] = [
  {
    _id: "65e000000000000000000001",
    title: "MediLink",
    slug: "medilink",
    category: "Healthcare",
    description:
      "Healthcare booking platform with separate experiences for doctors, patients, and admins.",
    problem:
      "Clinics needed a single unified system to manage appointments across doctors, patients, and staff without juggling spreadsheets or phone calls.",
    solution:
      "Built role-based dashboards for Admin, Doctor, and Patient with real-time appointment booking, achieving sub-100ms response times.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Express", "Tailwind CSS"],
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
        size: "wide"
      }
    ],
    liveUrl: "https://medilink-doctors.netlify.app/",
    featured: true,
    order: 1
  },
  {
    _id: "65e000000000000000000002",
    title: "Streaming UI",
    slug: "streaming-ui",
    category: "Entertainment",
    description:
      "A cinematic content browsing interface with filtering, discovery, and smooth scrolling.",
    problem:
      "Wanted to explore how high-traffic streaming platforms deliver a fast, cinematic browsing experience at scale.",
    solution:
      "Used React Query for intelligent caching and infinite scroll, cutting perceived load time by 60%.",
    techStack: ["React", "Firebase", "REST API", "Tailwind CSS"],
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
        size: "wide"
      }
    ],
    liveUrl: "https://netflix-cf98a.web.app/Home",
    featured: true,
    order: 2
  },
  {
    _id: "65e000000000000000000003",
    title: "Snap Grocer",
    slug: "snap-grocer",
    category: "E-commerce",
    description:
      "Modern grocery shopping experience with product discovery, live search, and cart functionality.",
    problem:
      "Grocery shopping applications often feel cluttered, heavy, and sluggish on mobile cellular connections.",
    solution:
      "Built with Redux Toolkit for predictable state and lazy loading for a snappy mobile-first experience, tested with Jest.",
    techStack: ["React", "Redux Toolkit", "Tailwind CSS", "Jest"],
    coverImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
        size: "wide"
      }
    ],
    liveUrl: "https://snapgrocerr.netlify.app",
    featured: true,
    order: 3
  }
];

export default function Projects({ projects, showHeading = true }: ProjectsProps) {
  const allProjects = useMemo(() => {
    return projects && projects.length > 0 ? projects : (fallbackProjects as IProject[]);
  }, [projects]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"cards" | "archive">("cards");
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [modalProject, setModalProject] = useState<IProject | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    allProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [allProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return allProjects;
    return allProjects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [allProjects, selectedCategory]);

  // Toggle like
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper to extract key tech badge
  const getTechLabel = (project: IProject) => {
    if (project.techStack && project.techStack.length > 0) {
      return project.techStack.slice(0, 2).join(" · ");
    }
    return "Full-Stack";
  };

  // Helper to extract metric / highlight badge
  const getMetricLabel = (project: IProject) => {
    if (project.slug === "medilink") return "Sub-100ms Live";
    if (project.slug === "streaming-ui") return "60% Faster Cache";
    if (project.slug === "snap-grocer") return "Mobile-First PWA";
    return "Production Ready";
  };

  return (
    <section id="projects" className="travel-showcase-section">
      <div className="container">
        {showHeading && (
          <div className="travel-header-bar">
            <div>
              <div className="section-number">01 — SELECTED WORK</div>
              <h2 className="section-title" style={{ marginTop: "8px" }}>
                A few things I&apos;ve
                <br />
                <em>built recently.</em>
              </h2>
            </div>

            {/* Filter Pills & View Mode */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div className="travel-filter-row">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`travel-filter-pill${selectedCategory === cat ? " active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "All" && <Sparkles style={{ width: 12, height: 12 }} />}
                    {cat}
                  </button>
                ))}
              </div>

              {/* View switch */}
              <div
                style={{
                  display: "inline-flex",
                  background: "#f0f0ee",
                  borderRadius: "999px",
                  padding: "4px",
                  border: "1px solid var(--line)"
                }}
              >
                <button
                  type="button"
                  title="Card Showcase"
                  onClick={() => setViewMode("cards")}
                  style={{
                    border: "none",
                    background: viewMode === "cards" ? "#111" : "transparent",
                    color: viewMode === "cards" ? "#fff" : "#666",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 600
                  }}
                >
                  <LayoutGrid style={{ width: 13, height: 13 }} />
                  Cards
                </button>
                <button
                  type="button"
                  title="Archive View"
                  onClick={() => setViewMode("archive")}
                  style={{
                    border: "none",
                    background: viewMode === "archive" ? "#111" : "transparent",
                    color: viewMode === "archive" ? "#fff" : "#666",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 600
                  }}
                >
                  <Layers style={{ width: 13, height: 13 }} />
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            CARD SHOWCASE (Exact Archetype from download (9).jpg)
           ========================================================= */}
        {viewMode === "cards" && (
          <div className="travel-cards-grid">
            {filteredProjects.map((project, idx) => {
              const projectId = project._id || project.slug;
              const isLiked = !!likedIds[projectId];
              const projectHref = `/projects/${project.slug}`;
              // Alternate between Style A (Immersive Glass Card) and Style B (Split Card)
              const isImmersive = idx % 2 === 0;

              if (isImmersive) {
                // ==========================================
                // STYLE A: Immersive Full-Bleed Card (New York Style)
                // ==========================================
                return (
                  <article key={projectId} className="travel-card travel-card-immersive">
                    {/* Background photo */}
                    <div className="card-immersive-bg">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>

                    {/* Floating frosted glass heart/bookmark button */}
                    <button
                      type="button"
                      className={`card-floating-action${isLiked ? " is-saved" : ""}`}
                      aria-label={isLiked ? "Remove bookmark" : "Bookmark project"}
                      onClick={(e) => toggleLike(projectId, e)}
                    >
                      <Heart
                        style={{
                          width: 18,
                          height: 18,
                          fill: isLiked ? "#e11d48" : "none",
                          stroke: isLiked ? "#e11d48" : "currentColor"
                        }}
                      />
                    </button>

                    {/* Lower Frosted Glass Overlay */}
                    <div className="card-immersive-content">
                      <h3 className="card-immersive-title">{project.title}</h3>
                      <p className="card-immersive-subtitle">
                        {project.category} · Web Application
                      </p>

                      {/* Meta Tags Row: Tag Icon & Airplane Icon */}
                      <div className="card-immersive-meta">
                        <span className="card-meta-badge-glass">
                          <Tag style={{ width: 14, height: 14 }} />
                          {getTechLabel(project)}
                        </span>
                        <span className="card-meta-badge-glass">
                          <Plane style={{ width: 14, height: 14 }} />
                          {getMetricLabel(project)}
                        </span>
                      </div>

                      {/* Full-width White Rounded Pill CTA Button */}
                      <Link href={projectHref} className="card-btn-pill-white">
                        Explore Project ↗
                      </Link>
                    </div>
                  </article>
                );
              }

              // ==========================================
              // STYLE B: Clean Split Dual-Tone Card (San Francisco Style)
              // ==========================================
              return (
                <article key={projectId} className="travel-card travel-card-split">
                  {/* Inset Rounded Photo */}
                  <div className="card-split-media">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>

                  {/* Clean White Lower Container */}
                  <div className="card-split-body">
                    <div className="card-split-info">
                      <h3 className="card-split-title">{project.title}</h3>
                      <p className="card-split-subtitle">
                        {project.category} · Production Build
                      </p>

                      {/* Meta Tags Row: Tag Icon & Airplane Icon */}
                      <div className="card-split-meta">
                        <span className="card-meta-badge-dark">
                          <Tag style={{ width: 14, height: 14 }} />
                          {getTechLabel(project)}
                        </span>
                        <span className="card-meta-badge-dark">
                          <Plane style={{ width: 14, height: 14 }} />
                          {getMetricLabel(project)}
                        </span>
                      </div>
                    </div>

                    {/* Action Row: Dark Pill CTA + Circular Heart Icon Button */}
                    <div className="card-split-actions">
                      <Link href={projectHref} className="card-btn-pill-dark">
                        Explore Project ↗
                      </Link>
                      <button
                        type="button"
                        className={`card-btn-circle-action${isLiked ? " is-saved" : ""}`}
                        aria-label={isLiked ? "Remove bookmark" : "Bookmark project"}
                        onClick={(e) => toggleLike(projectId, e)}
                      >
                        <Heart
                          style={{
                            width: 18,
                            height: 18,
                            fill: isLiked ? "#e11d48" : "none",
                            stroke: isLiked ? "#e11d48" : "currentColor"
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =========================================================
            ARCHIVE LIST VIEW
           ========================================================= */}
        {viewMode === "archive" && (
          <div className="projects-list" style={{ marginTop: "24px" }}>
            {filteredProjects.map((project, index) => {
              const href = `/projects/${project.slug}`;
              const indexStr = String(index + 1).padStart(2, "0");

              return (
                <div key={project.slug} className="project-row-wrap" style={{ position: "relative" }}>
                  <Link className="project" href={href}>
                    <span className="project-index">{indexStr}</span>
                    <div className="project-info">
                      <span className="project-title">{project.title}</span>
                      <span className="project-meta">{project.category}</span>
                    </div>
                    <span className="project-arrow">↗</span>
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-live-badge"
                      style={{
                        position: "absolute",
                        right: "60px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#666",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        border: "1px solid var(--line)",
                        background: "#fff"
                      }}
                    >
                      <ExternalLink style={{ width: 11, height: 11 }} />
                      Live Demo
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Navigation Link */}
        <div style={{ textAlign: "center", marginTop: "44px" }}>
          <Link
            href="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#111",
              borderBottom: "1.5px solid #111",
              paddingBottom: "4px"
            }}
          >
            Explore Complete Projects Archive
            <ArrowUpRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {modalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setModalProject(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "32px",
              maxWidth: "640px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "32px",
              position: "relative",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalProject(null)}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#f0f0ee",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div style={{ position: "relative", width: "100%", height: "260px", borderRadius: "20px", overflow: "hidden", marginBottom: "20px" }}>
              <Image
                src={modalProject.coverImage}
                alt={modalProject.title}
                fill
                sizes="600px"
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#666" }}>
                {modalProject.category}
              </span>
            </div>

            <h3 id="modal-title" style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 12px", color: "#111" }}>
              {modalProject.title}
            </h3>

            <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#555", margin: "0 0 20px" }}>
              {modalProject.description}
            </p>

            {modalProject.techStack && modalProject.techStack.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                {modalProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      background: "#f4f4f3",
                      color: "#333",
                      padding: "4px 10px",
                      borderRadius: "999px"
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href={`/projects/${modalProject.slug}`}
                className="button button-dark"
                onClick={() => setModalProject(null)}
              >
                Read Case Study ↗
              </Link>
              {modalProject.liveUrl && (
                <a
                  href={modalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-light"
                >
                  Open Live Demo ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
