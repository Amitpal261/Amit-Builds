import Image from "next/image";
import Link from "next/link";
import { IProject } from "@/models/Project";

const fallback: Partial<IProject>[] = [
  {
    title: "MediLink",
    slug: "medilink",
    category: "Healthcare",
    description:
      "Healthcare booking platform with separate experiences for doctors, patients and admins.",
    techStack: ["Next.js", "MongoDB", "Express"],
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
    liveUrl: "https://medilink-doctors.netlify.app/"
  },
  {
    title: "Streaming UI",
    slug: "streaming-ui",
    category: "Entertainment",
    description:
      "A cinematic content browsing interface with filtering, discovery and smooth scrolling.",
    techStack: ["React", "Firebase", "REST API"],
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
    liveUrl: "https://netflix-cf98a.web.app/Home"
  },
  {
    title: "Snap Grocer",
    slug: "snap-grocer",
    category: "E-commerce",
    description:
      "Modern grocery shopping experience with product discovery, search and cart functionality.",
    techStack: ["React", "Redux", "Tailwind"],
    coverImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    liveUrl: "https://snapgrocerr.netlify.app"
  }
];

export default function Projects({ projects }: { projects: IProject[] }) {
  const list = projects.length > 0 ? projects : (fallback as IProject[]);

  return (
    <section id="projects">
      <div className="container">
        <div className="section-intro">
          <div className="section-number">01 — SELECTED WORK</div>
          <h2 className="section-title">
            A few things I&apos;ve
            <br />
            <em>built recently.</em>
          </h2>
        </div>

        <div className="projects">
          {list.map((project, i) => {
            const href = project._id ? `/projects/${project.slug}` : project.liveUrl || "#";
            const isInternal = Boolean(project._id);

            const content = (
              <>
                <div className="project-index">{String(i + 1).padStart(2, "0")}</div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    {project.techStack?.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="project-image">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    width={1200}
                    height={800}
                    unoptimized
                  />
                  <div className="project-arrow">↗</div>
                </div>
              </>
            );

            return isInternal ? (
              <Link className="project" href={href} key={project.slug}>
                {content}
              </Link>
            ) : (
              <a
                className="project"
                href={href}
                target="_blank"
                rel="noopener"
                key={project.slug}
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
